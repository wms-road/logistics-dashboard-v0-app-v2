"use client"

import { useEffect, useRef, useState } from "react"
import { countries, hubs } from "@/lib/geo-data"

const actions = ["已揽收", "已发运", "清关中", "干线运输", "已妥投", "派送中"]

interface Item {
  id: number
  time: string
  hub: string
  country: string
  flag?: string
  action: string
  tracking: string
}

function makeItem(seq: number): Item {
  const hub = hubs[Math.floor(Math.random() * hubs.length)]
  const c = countries[Math.floor(Math.random() * countries.length)]
  const now = new Date()
  const time = now.toLocaleTimeString("zh-CN", { hour12: false })
  const tracking = "CN" + Math.floor(100000000 + Math.random() * 899999999) + "YT"
  return {
    id: seq,
    time,
    hub: hub.name,
    country: c.name,
    flag: c.flag,
    action: actions[Math.floor(Math.random() * actions.length)],
    tracking,
  }
}

export function ActivityFeed() {
  const seqRef = useRef(0)
  // 初始为空，仅在客户端挂载后生成，避免随机/时间导致的水合不匹配
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    setItems(Array.from({ length: 7 }, () => makeItem(seqRef.current++)))
    const id = setInterval(() => {
      setItems((prev) => [makeItem(seqRef.current++), ...prev].slice(0, 9))
    }, 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((it, idx) => (
        <div
          key={it.id}
          className="flex items-center gap-2 rounded-md border bg-background/30 px-2.5 py-1.5 text-[11px]"
          style={{ opacity: idx === 0 ? 1 : Math.max(0.45, 1 - idx * 0.09) }}
        >
          <span className="font-mono text-[10px] text-muted-foreground">{it.time}</span>
          {it.flag && <span className={`fi fi-${it.flag} h-2.5 w-3.5 rounded-[1px]`} />}
          <span className="text-foreground">
            {it.hub} → {it.country}
          </span>
          <span className="ml-auto rounded-sm bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
            {it.action}
          </span>
        </div>
      ))}
    </div>
  )
}
