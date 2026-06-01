"use client"

import { routes, nodeById } from "@/lib/geo-data"

export function RouteList() {
  const sorted = [...routes].sort((a, b) => b.volume - a.volume)
  const max = sorted[0].volume

  return (
    <div className="flex flex-col gap-2.5">
      {sorted.slice(0, 9).map((r, i) => {
        const from = nodeById(r.from)
        const to = nodeById(r.to)
        const pct = (r.volume / max) * 100
        return (
          <div key={`${r.from}-${r.to}`} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                {from?.name}
                <span className="text-muted-foreground">→</span>
                <span className="flex items-center gap-1">
                  {to?.flag && <span className={`fi fi-${to.flag} h-2.5 w-3.5 rounded-[1px]`} />}
                  {to?.name}
                </span>
              </span>
              <span className="font-mono tabular-nums text-accent">{r.volume.toLocaleString("en-US")}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-background/60">
              <div
                className="h-full origin-left rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, rgba(120,200,230,0.7), rgba(245,200,110,0.9))",
                  animation: "count-bar 1.1s ease-out",
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
