"use client"

import { useEffect, useState } from "react"

interface Stat {
  label: string
  value: number
  suffix: string
  decimals?: number
}

const baseStats: Stat[] = [
  { label: "今日发运单量", value: 128450, suffix: " 单" },
  { label: "在途包裹", value: 96320, suffix: " 件" },
  { label: "活跃航线", value: 13, suffix: " 条" },
  { label: "准时妥投率", value: 98.6, suffix: " %", decimals: 1 },
]

function useTick(initial: number, decimals = 0) {
  const [v, setV] = useState(initial)
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const drift = (Math.random() - 0.45) * (decimals ? 0.2 : Math.max(2, initial * 0.0008))
        const next = prev + drift
        return decimals ? Math.min(99.9, Math.max(95, next)) : Math.max(0, next)
      })
    }, 2000)
    return () => clearInterval(id)
  }, [initial, decimals])
  return v
}

function StatItem({ stat }: { stat: Stat }) {
  const v = useTick(stat.value, stat.decimals)
  const display = stat.decimals
    ? v.toFixed(stat.decimals)
    : Math.round(v).toLocaleString("en-US")
  return (
    <div className="rounded-md border bg-background/40 px-3 py-3">
      <div className="font-mono text-xl font-semibold tabular-nums text-primary">
        {display}
        <span className="text-xs text-muted-foreground">{stat.suffix}</span>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{stat.label}</div>
    </div>
  )
}

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {baseStats.map((s) => (
        <StatItem key={s.label} stat={s} />
      ))}
    </div>
  )
}
