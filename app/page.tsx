import { DashboardHeader } from "@/components/dashboard-header"
import { Panel } from "@/components/panel"
import { StatCards } from "@/components/stat-cards"
import { RouteList } from "@/components/route-list"
import { ActivityFeed } from "@/components/activity-feed"
import WorldMap from "@/components/world-map"
import { hubs, countries } from "@/lib/geo-data"

export default function Page() {
  return (
    <main className="bg-grid relative flex h-dvh flex-col overflow-hidden">
      {/* 顶部光晕 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(60,140,180,0.18), transparent 70%)",
        }}
      />

      <DashboardHeader />

      <div className="grid min-h-0 flex-1 grid-cols-12 grid-rows-1 gap-3 overflow-hidden p-3">
        {/* 左侧 */}
        <div className="col-span-3 flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel title="运营总览" subtitle="LIVE" className="shrink-0">
            <StatCards />
          </Panel>
          <Panel title="热门航线 TOP" subtitle="VOLUME" className="min-h-0 flex-1">
            <RouteList />
          </Panel>
        </div>

        {/* 中央地图 */}
        <div className="col-span-6 flex min-h-0 min-w-0 flex-col overflow-hidden">
          <Panel title="全球物流网络" subtitle="GEOJSON · CANVAS" className="min-h-0 flex-1">
            <div className="h-full w-full">
              <WorldMap />
            </div>
          </Panel>
        </div>

        {/* 右侧 */}
        <div className="col-span-3 flex min-h-0 flex-col gap-3 overflow-hidden">
          <Panel title="枢纽与国家" subtitle="NODES" className="shrink-0">
            <CoverageGrid />
          </Panel>
          <Panel title="实时运单动态" subtitle="STREAM" className="min-h-0 flex-1">
            <ActivityFeed />
          </Panel>
        </div>
      </div>
    </main>
  )
}

function CoverageGrid() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
          中国枢纽 · {hubs.length}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {hubs.map((h) => (
            <span
              key={h.id}
              className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {h.name}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
          覆盖国家 · {countries.length}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {countries.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 rounded-md border bg-background/40 px-2 py-1 text-[11px] text-foreground"
            >
              <span className={`fi fi-${c.flag} h-3 w-4 rounded-[1px]`} />
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
