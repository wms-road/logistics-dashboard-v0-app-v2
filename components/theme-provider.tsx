"use client"

import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react"
import { themes, defaultTheme, type DashboardTheme } from "@/lib/themes"

interface ThemeContextValue {
  theme: DashboardTheme
  index: number
  autoplay: boolean
  setIndex: (i: number) => void
  next: () => void
  toggleAutoplay: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

const ROTATE_MS = 7000

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndexState] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const theme = themes[index] ?? defaultTheme

  // 将主题的 CSS 变量写入文档根节点，覆盖 :root
  useEffect(() => {
    const root = document.documentElement
    const v = theme.vars
    root.style.setProperty("--background", v.background)
    root.style.setProperty("--foreground", v.foreground)
    root.style.setProperty("--card", v.card)
    root.style.setProperty("--card-foreground", v.cardForeground)
    root.style.setProperty("--border", v.border)
    root.style.setProperty("--primary", v.primary)
    root.style.setProperty("--primary-foreground", v.primaryForeground)
    root.style.setProperty("--accent", v.accent)
    root.style.setProperty("--accent-foreground", v.accentForeground)
    root.style.setProperty("--muted", v.muted)
    root.style.setProperty("--muted-foreground", v.mutedForeground)
    root.style.setProperty("--grid-line", v.gridLine)
    root.style.setProperty("--top-glow", v.topGlow)
  }, [theme])

  const setIndex = useCallback((i: number) => {
    setIndexState(((i % themes.length) + themes.length) % themes.length)
  }, [])

  const next = useCallback(() => {
    setIndexState((p) => (p + 1) % themes.length)
  }, [])

  const toggleAutoplay = useCallback(() => setAutoplay((p) => !p), [])

  // 自动轮播
  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    if (!autoplay) return
    const id = setInterval(() => nextRef.current(), ROTATE_MS)
    return () => clearInterval(id)
  }, [autoplay, index])

  return (
    <ThemeContext.Provider value={{ theme, index, autoplay, setIndex, next, toggleAutoplay }}>
      {children}
    </ThemeContext.Provider>
  )
}
