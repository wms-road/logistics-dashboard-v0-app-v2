"use client"

import { useEffect, useState } from "react"

export function DashboardHeader() {
  const [now, setNow] = useState<string>("")

  useEffect(() => {
    const update = () =>
      setNow(
        new Date().toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="relative flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">CROSS-BORDER</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1 className="text-balance text-xl font-semibold tracking-[0.2em] text-foreground md:text-2xl">
          全球跨境物流数据大屏
        </h1>
        <p className="mt-0.5 font-mono text-[10px] tracking-[0.3em] text-primary/80">
          GLOBAL CROSS-BORDER LOGISTICS NETWORK
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-primary" />
          实时在线
        </span>
        <span className="font-mono text-xs tabular-nums text-foreground">{now}</span>
      </div>
    </header>
  )
}
