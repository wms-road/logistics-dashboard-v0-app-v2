import type { ReactNode } from "react"

export function Panel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`relative flex flex-col rounded-lg border bg-card/60 backdrop-blur-sm ${className}`}
    >
      <header className="flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-1 rounded-full bg-primary" />
          <h2 className="text-sm font-medium tracking-wide text-foreground">{title}</h2>
        </div>
        {subtitle && <span className="font-mono text-[10px] text-muted-foreground">{subtitle}</span>}
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
      {/* 装饰角 */}
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-primary/60" />
      <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-primary/60" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-primary/60" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-primary/60" />
    </section>
  )
}
