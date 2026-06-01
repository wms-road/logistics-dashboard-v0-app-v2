"use client"

import { useTheme } from "@/components/theme-provider"
import { themes } from "@/lib/themes"

export function ThemeSwitcher() {
  const { theme, index, autoplay, setIndex, toggleAutoplay } = useTheme()

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-full border bg-card px-3 py-1.5 backdrop-blur-md">
      <span className="font-mono text-[10px] tracking-wider text-muted-foreground">主题</span>

      {/* 圆点切换 */}
      <div className="flex items-center gap-2">
        {themes.map((t, i) => {
          const active = i === index
          return (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              aria-label={`切换到${t.name}主题`}
              aria-pressed={active}
              className="group relative flex items-center justify-center"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: active ? 11 : 9,
                  height: active ? 11 : 9,
                  background: t.swatch,
                  boxShadow: active ? `0 0 10px ${t.swatch}` : "none",
                  opacity: active ? 1 : 0.45,
                  outline: active ? "2px solid var(--color-background)" : "none",
                }}
              />
            </button>
          )
        })}
      </div>

      {/* 当前主题名 */}
      <div className="flex min-w-28 flex-col leading-tight">
        <span className="text-[11px] font-medium text-foreground">{theme.name}</span>
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground">{theme.nameEn}</span>
      </div>

      {/* 自动轮播开关 */}
      <button
        onClick={toggleAutoplay}
        aria-label={autoplay ? "暂停轮播" : "开始轮播"}
        className="flex h-6 w-6 items-center justify-center rounded-full border text-foreground transition-colors hover:bg-primary/15"
      >
        {autoplay ? (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="2.5" y="2" width="2.5" height="8" rx="0.6" />
            <rect x="7" y="2" width="2.5" height="8" rx="0.6" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M3 2.2v7.6a.5.5 0 0 0 .77.42l6-3.8a.5.5 0 0 0 0-.84l-6-3.8A.5.5 0 0 0 3 2.2Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
