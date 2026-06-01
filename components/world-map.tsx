"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo"
import { feature } from "topojson-client"
import type { FeatureCollection, Geometry } from "geojson"
import { allNodes, hubs, routes, nodeById, type MapNode } from "@/lib/geo-data"

interface Size {
  w: number
  h: number
}

// 二次贝塞尔采样
function quadPoint(p0: number[], c: number[], p1: number[], t: number): [number, number] {
  const mt = 1 - t
  const x = mt * mt * p0[0] + 2 * mt * t * c[0] + t * t * p1[0]
  const y = mt * mt * p0[1] + 2 * mt * t * c[1] + t * t * p1[1]
  return [x, y]
}

export default function WorldMap() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const baseRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)

  const [size, setSize] = useState<Size>({ w: 0, h: 0 })
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  // 加载真实世界地图 GeoJSON 数据
  useEffect(() => {
    let active = true
    fetch("/data/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        if (!active) return
        const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry>
        setGeo(fc)
      })
      .catch((e) => console.log("[v0] map load error", e))
    return () => {
      active = false
    }
  }, [])

  // 监听尺寸
  useEffect(() => {
    if (!wrapRef.current) return
    const el = wrapRef.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      setSize({ w: Math.floor(cr.width), h: Math.floor(cr.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 投影：自然地球投影，自适应容器
  const projection = useMemo<GeoProjection | null>(() => {
    if (!geo || size.w === 0 || size.h === 0) return null
    const proj = geoNaturalEarth1()
    proj.fitExtent(
      [
        [size.w * 0.02, size.h * 0.06],
        [size.w * 0.98, size.h * 0.94],
      ],
      geo,
    )
    return proj
  }, [geo, size])

  // 投影后的节点屏幕坐标
  const projectedNodes = useMemo(() => {
    if (!projection) return []
    return allNodes
      .map((n) => {
        const p = projection(n.coord)
        return p ? { node: n, x: p[0], y: p[1] } : null
      })
      .filter(Boolean) as { node: MapNode; x: number; y: number }[]
  }, [projection])

  // 预计算航线（屏幕坐标 + 控制点）
  const arcs = useMemo(() => {
    if (!projection) return []
    return routes
      .map((rt, i) => {
        const from = nodeById(rt.from)
        const to = nodeById(rt.to)
        if (!from || !to) return null
        const a = projection(from.coord)
        const b = projection(to.coord)
        if (!a || !b) return null
        const mx = (a[0] + b[0]) / 2
        const my = (a[1] + b[1]) / 2
        const dx = b[0] - a[0]
        const dy = b[1] - a[1]
        const dist = Math.hypot(dx, dy)
        // 垂直方向抬起控制点形成弧线
        const lift = Math.min(dist * 0.32, 170)
        const nx = -dy / (dist || 1)
        const ny = dx / (dist || 1)
        const cx = mx + nx * lift
        const cy = my + ny * lift - lift * 0.15
        return {
          p0: a as number[],
          c: [cx, cy] as number[],
          p1: b as number[],
          speed: 0.18 + (i % 5) * 0.04,
          offset: (i * 0.137) % 1,
          volume: rt.volume,
        }
      })
      .filter(Boolean) as {
      p0: number[]
      c: number[]
      p1: number[]
      speed: number
      offset: number
      volume: number
    }[]
  }, [projection])

  // 离屏渲染底图（国家轮廓 + 海洋）
  useEffect(() => {
    if (!projection || size.w === 0) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const base = document.createElement("canvas")
    base.width = size.w * dpr
    base.height = size.h * dpr
    const ctx = base.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const path = geoPath(projection, ctx)

    // 海洋背景渐变
    const og = ctx.createRadialGradient(size.w / 2, size.h / 2, 0, size.w / 2, size.h / 2, size.w * 0.7)
    og.addColorStop(0, "rgba(20, 42, 66, 0.55)")
    og.addColorStop(1, "rgba(10, 18, 36, 0.0)")
    ctx.fillStyle = og
    ctx.fillRect(0, 0, size.w, size.h)

    // 经纬网
    ctx.beginPath()
    path({ type: "Sphere" } as any)
    ctx.strokeStyle = "rgba(96, 165, 200, 0.18)"
    ctx.lineWidth = 1
    ctx.stroke()

    if (geo) {
      // 国家填充
      ctx.beginPath()
      geo.features.forEach((f) => path(f as any))
      const fillGrad = ctx.createLinearGradient(0, 0, 0, size.h)
      fillGrad.addColorStop(0, "rgba(45, 78, 110, 0.85)")
      fillGrad.addColorStop(1, "rgba(30, 55, 82, 0.85)")
      ctx.fillStyle = fillGrad
      ctx.fill()

      // 国家边界发光描边
      ctx.beginPath()
      geo.features.forEach((f) => path(f as any))
      ctx.strokeStyle = "rgba(120, 200, 230, 0.45)"
      ctx.lineWidth = 0.6
      ctx.stroke()
    }

    baseRef.current = base
  }, [projection, geo, size])

  // 主渲染循环（底图 + 动态航线）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.w === 0) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let last = 0
    const frameInterval = 1000 / 30 // 限制 ~30fps，降低负载

    const draw = (time: number) => {
      rafRef.current = requestAnimationFrame(draw)
      if (time - last < frameInterval) return
      last = time

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size.w, size.h)

      // 绘制底图
      if (baseRef.current) {
        ctx.drawImage(baseRef.current, 0, 0, size.w, size.h)
      }

      const t = time / 1000

      // 航线静态弧线（统一描边）
      ctx.strokeStyle = "rgba(120, 190, 220, 0.18)"
      ctx.lineWidth = 1
      ctx.beginPath()
      arcs.forEach((arc) => {
        ctx.moveTo(arc.p0[0], arc.p0[1])
        ctx.quadraticCurveTo(arc.c[0], arc.c[1], arc.p1[0], arc.p1[1])
      })
      ctx.stroke()

      // 移动光点 + 拖尾
      arcs.forEach((arc) => {
        const prog = (t * arc.speed + arc.offset) % 1
        const trail = 16
        for (let s = 0; s < trail; s++) {
          const tt = prog - s * 0.016
          if (tt < 0 || tt > 1) continue
          const [x, y] = quadPoint(arc.p0, arc.c, arc.p1, tt)
          const alpha = (1 - s / trail) * 0.85
          ctx.beginPath()
          ctx.arc(x, y, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(245, 200, 110, ${alpha})`
          ctx.fill()
        }
        // 头部亮点 + 光晕（用叠加圆代替昂贵的 shadowBlur）
        const [hx, hy] = quadPoint(arc.p0, arc.c, arc.p1, prog)
        ctx.beginPath()
        ctx.arc(hx, hy, 5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(245, 200, 110, 0.22)"
        ctx.fill()
        ctx.beginPath()
        ctx.arc(hx, hy, 2.6, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 235, 185, 1)"
        ctx.fill()
      })
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [arcs, size])

  const hubIds = new Set(hubs.map((h) => h.id))

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <canvas ref={canvasRef} style={{ width: size.w, height: size.h }} className="absolute inset-0" />

      {/* 节点标记层 */}
      <div className="pointer-events-none absolute inset-0">
        {projectedNodes.map(({ node, x, y }) => {
          const isHub = hubIds.has(node.id)
          const active = hovered === node.id
          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              {/* 闪烁光圈 */}
              <span
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: isHub ? "rgba(120, 220, 235, 0.5)" : "rgba(245, 200, 110, 0.5)",
                  animation: "pulse-ring 2.6s ease-out infinite",
                }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: isHub ? "rgba(120, 220, 235, 0.4)" : "rgba(245, 200, 110, 0.4)",
                  animation: "pulse-ring 2.6s ease-out infinite",
                  animationDelay: "1.3s",
                }}
              />

              {/* 中心点 / 国旗 */}
              <button
                className="pointer-events-auto relative flex items-center justify-center"
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {isHub ? (
                  <span
                    className="block h-2.5 w-2.5 rounded-full ring-2"
                    style={{
                      background: "rgb(150, 230, 245)",
                      boxShadow: "0 0 10px rgba(120,220,235,0.9)",
                    }}
                  />
                ) : (
                  <span
                    className={`fi fi-${node.flag} block rounded-sm`}
                    style={{
                      width: 22,
                      height: 16,
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.6)",
                    }}
                  />
                )}
              </button>

              {/* 标签 */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wide transition-opacity ${
                  active ? "opacity-100" : "opacity-80"
                }`}
                style={{
                  top: isHub ? 10 : 12,
                  color: isHub ? "rgb(160, 235, 245)" : "rgb(245, 215, 160)",
                  background: "rgba(8, 14, 28, 0.7)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                {node.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
