// 物流大屏配色主题集合
// 每个主题包含：UI 的 CSS 变量覆盖 + Canvas 地图专用颜色

export interface MapColors {
  ocean0: string
  ocean1: string
  countryFill0: string
  countryFill1: string
  countryStroke: string
  graticule: string
  routeLine: string
  routeDot: string // rgb 三元组，不含 alpha
  routeGlow: string
  routeHead: string
  hubCore: string
  hubGlow: string
  hubRing: string
  countryRing: string
  hubLabel: string
  countryLabel: string
  labelBg: string
}

export interface ThemeVars {
  background: string
  foreground: string
  card: string
  cardForeground: string
  border: string
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  muted: string
  mutedForeground: string
  gridLine: string
  topGlow: string
}

export interface DashboardTheme {
  id: string
  name: string
  nameEn: string
  swatch: string // 主题代表色，用于切换器圆点
  vars: ThemeVars
  map: MapColors
}

export const themes: DashboardTheme[] = [
  {
    id: "command-blue",
    name: "深蓝指挥中心",
    nameEn: "COMMAND BLUE",
    swatch: "#3fbfe0",
    vars: {
      background: "oklch(0.16 0.03 250)",
      foreground: "oklch(0.93 0.02 230)",
      card: "oklch(0.21 0.035 250 / 0.6)",
      cardForeground: "oklch(0.93 0.02 230)",
      border: "oklch(0.55 0.08 220 / 0.25)",
      primary: "oklch(0.78 0.14 200)",
      primaryForeground: "oklch(0.16 0.03 250)",
      accent: "oklch(0.8 0.15 75)",
      accentForeground: "oklch(0.16 0.03 250)",
      muted: "oklch(0.3 0.03 250)",
      mutedForeground: "oklch(0.68 0.04 230)",
      gridLine: "oklch(0.55 0.08 220 / 0.06)",
      topGlow: "rgba(60,140,180,0.18)",
    },
    map: {
      ocean0: "rgba(20, 42, 66, 0.55)",
      ocean1: "rgba(10, 18, 36, 0.0)",
      countryFill0: "rgba(45, 78, 110, 0.85)",
      countryFill1: "rgba(30, 55, 82, 0.85)",
      countryStroke: "rgba(120, 200, 230, 0.45)",
      graticule: "rgba(96, 165, 200, 0.18)",
      routeLine: "rgba(120, 190, 220, 0.18)",
      routeDot: "245, 200, 110",
      routeGlow: "rgba(245, 200, 110, 0.22)",
      routeHead: "rgba(255, 235, 185, 1)",
      hubCore: "150, 230, 245",
      hubGlow: "rgba(120,220,235,0.9)",
      hubRing: "rgba(120, 220, 235, 0.5)",
      countryRing: "rgba(245, 200, 110, 0.5)",
      hubLabel: "rgb(160, 235, 245)",
      countryLabel: "rgb(245, 215, 160)",
      labelBg: "rgba(8, 14, 28, 0.7)",
    },
  },
  {
    id: "logistics-orange",
    name: "科技黑·物流橙",
    nameEn: "CARGO ORANGE",
    swatch: "#ff7a2f",
    vars: {
      background: "oklch(0.17 0.012 60)",
      foreground: "oklch(0.95 0.015 70)",
      card: "oklch(0.22 0.014 60 / 0.6)",
      cardForeground: "oklch(0.95 0.015 70)",
      border: "oklch(0.6 0.06 60 / 0.22)",
      primary: "oklch(0.72 0.18 50)",
      primaryForeground: "oklch(0.17 0.012 60)",
      accent: "oklch(0.85 0.12 90)",
      accentForeground: "oklch(0.17 0.012 60)",
      muted: "oklch(0.3 0.012 60)",
      mutedForeground: "oklch(0.7 0.025 65)",
      gridLine: "oklch(0.7 0.06 60 / 0.05)",
      topGlow: "rgba(255,122,47,0.16)",
    },
    map: {
      ocean0: "rgba(38, 30, 22, 0.55)",
      ocean1: "rgba(18, 14, 10, 0.0)",
      countryFill0: "rgba(70, 56, 40, 0.85)",
      countryFill1: "rgba(48, 38, 28, 0.85)",
      countryStroke: "rgba(255, 170, 100, 0.4)",
      graticule: "rgba(200, 150, 100, 0.16)",
      routeLine: "rgba(230, 160, 90, 0.18)",
      routeDot: "255, 138, 60",
      routeGlow: "rgba(255, 138, 60, 0.24)",
      routeHead: "rgba(255, 220, 170, 1)",
      hubCore: "255, 190, 120",
      hubGlow: "rgba(255,150,70,0.9)",
      hubRing: "rgba(255, 150, 70, 0.5)",
      countryRing: "rgba(255, 210, 150, 0.5)",
      hubLabel: "rgb(255, 200, 140)",
      countryLabel: "rgb(255, 220, 180)",
      labelBg: "rgba(26, 18, 10, 0.72)",
    },
  },
  {
    id: "signal-green",
    name: "午夜蓝·信号绿",
    nameEn: "SIGNAL GREEN",
    swatch: "#39e08a",
    vars: {
      background: "oklch(0.16 0.025 240)",
      foreground: "oklch(0.93 0.02 180)",
      card: "oklch(0.2 0.03 240 / 0.6)",
      cardForeground: "oklch(0.93 0.02 180)",
      border: "oklch(0.55 0.07 200 / 0.24)",
      primary: "oklch(0.8 0.16 160)",
      primaryForeground: "oklch(0.16 0.025 240)",
      accent: "oklch(0.82 0.13 195)",
      accentForeground: "oklch(0.16 0.025 240)",
      muted: "oklch(0.3 0.025 240)",
      mutedForeground: "oklch(0.68 0.04 200)",
      gridLine: "oklch(0.6 0.1 170 / 0.06)",
      topGlow: "rgba(57,224,138,0.15)",
    },
    map: {
      ocean0: "rgba(18, 40, 52, 0.55)",
      ocean1: "rgba(8, 18, 30, 0.0)",
      countryFill0: "rgba(34, 70, 72, 0.85)",
      countryFill1: "rgba(22, 50, 56, 0.85)",
      countryStroke: "rgba(90, 230, 170, 0.42)",
      graticule: "rgba(90, 200, 170, 0.16)",
      routeLine: "rgba(110, 220, 180, 0.18)",
      routeDot: "70, 235, 150",
      routeGlow: "rgba(70, 235, 150, 0.22)",
      routeHead: "rgba(190, 255, 220, 1)",
      hubCore: "120, 245, 195",
      hubGlow: "rgba(60,230,150,0.9)",
      hubRing: "rgba(60, 230, 150, 0.5)",
      countryRing: "rgba(120, 230, 210, 0.5)",
      hubLabel: "rgb(150, 245, 200)",
      countryLabel: "rgb(170, 240, 220)",
      labelBg: "rgba(8, 22, 26, 0.72)",
    },
  },
]

export const defaultTheme = themes[0]
