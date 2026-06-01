// [经度 lon, 纬度 lat]
export type Coord = [number, number]

export interface MapNode {
  id: string
  name: string
  type: "country" | "hub"
  flag?: string // ISO 3166-1 alpha-2 for flag-icons
  coord: Coord
}

// 全球主要目的地国家
export const countries: MapNode[] = [
  { id: "us", name: "美国", type: "country", flag: "us", coord: [-95.7, 39.5] },
  { id: "gb", name: "英国", type: "country", flag: "gb", coord: [-1.5, 52.5] },
  { id: "de", name: "德国", type: "country", flag: "de", coord: [10.4, 51.1] },
  { id: "fr", name: "法国", type: "country", flag: "fr", coord: [2.3, 47.0] },
  { id: "nl", name: "荷兰", type: "country", flag: "nl", coord: [5.3, 52.2] },
  { id: "vn", name: "越南", type: "country", flag: "vn", coord: [106.0, 16.0] },
  { id: "sg", name: "新加坡", type: "country", flag: "sg", coord: [103.8, 1.35] },
  { id: "mx", name: "墨西哥", type: "country", flag: "mx", coord: [-102.5, 23.6] },
  { id: "ca", name: "加拿大", type: "country", flag: "ca", coord: [-96.0, 56.1] },
  { id: "pl", name: "波兰", type: "country", flag: "pl", coord: [19.1, 52.0] },
]

// 中国发运枢纽城市
export const hubs: MapNode[] = [
  { id: "shenzhen", name: "深圳", type: "hub", coord: [114.06, 22.54] },
  { id: "hongkong", name: "香港", type: "hub", coord: [114.17, 22.32] },
  { id: "hangzhou", name: "杭州", type: "hub", coord: [120.15, 30.27] },
  { id: "changsha", name: "长沙", type: "hub", coord: [112.94, 28.23] },
]

export const allNodes: MapNode[] = [...hubs, ...countries]

export interface Route {
  from: string // hub id
  to: string // country id
  volume: number // 当前在途包裹量
}

// 航线：从中国枢纽到全球国家
export const routes: Route[] = [
  { from: "shenzhen", to: "us", volume: 18420 },
  { from: "shenzhen", to: "de", volume: 9210 },
  { from: "shenzhen", to: "gb", volume: 7640 },
  { from: "shenzhen", to: "mx", volume: 5130 },
  { from: "hongkong", to: "us", volume: 12300 },
  { from: "hongkong", to: "sg", volume: 6680 },
  { from: "hongkong", to: "nl", volume: 4920 },
  { from: "hangzhou", to: "fr", volume: 5870 },
  { from: "hangzhou", to: "pl", volume: 4310 },
  { from: "hangzhou", to: "ca", volume: 3980 },
  { from: "changsha", to: "vn", volume: 7250 },
  { from: "changsha", to: "gb", volume: 3420 },
  { from: "changsha", to: "de", volume: 2980 },
]

export function nodeById(id: string): MapNode | undefined {
  return allNodes.find((n) => n.id === id)
}
