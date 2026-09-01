import { Badge, Card, Icon, LevelDots, PageHead } from '../components/ui'
import { competencyAreas } from '../data/mock'

const areaAbbrev: Record<string, string> = {
  Sales: 'S',
  Delivery: 'D',
  Manage: 'M',
  Entrepreneurship: 'E',
  Develop: 'D',
}

const areaColor: Record<string, string> = {
  Sales: '#2f6df0',
  Delivery: '#7c3aed',
  Manage: '#0d9488',
  Entrepreneurship: '#d97706',
  Develop: '#16a34a',
}

const radarPoints = competencyAreas.map((c) => ({
  area: c.label,
  current: c.current,
  target: c.target,
}))

function RadarChart() {
  const size = 340
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 50
  const n = radarPoints.length

  const point = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  const toPoints = (getVal: (p: (typeof radarPoints)[number]) => number) =>
    radarPoints
      .map((p, i) => {
        const { x, y } = point(i, (r * getVal(p)) / 5)
        return `${x},${y}`
      })
      .join(' ')

  const rings = [1, 2, 3, 4, 5]

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="auto"
      role="img"
      aria-label="Competency radar chart"
    >
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={toPoints(() => ring)}
          fill="none"
          stroke="var(--gray-200)"
          strokeWidth="1"
        />
      ))}
      {radarPoints.map((_, i) => {
        const { x, y } = point(i, r)
        const { x: cX, y: cY } = point(i, 0)
        return (
          <line
            key={i}
            x1={cX}
            y1={cY}
            x2={x}
            y2={y}
            stroke="var(--gray-200)"
            strokeWidth="1"
          />
        )
      })}
      <polygon
        points={toPoints((p) => p.target)}
        fill="rgba(124, 58, 237, 0.12)"
        stroke="var(--violet)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <polygon
        points={toPoints((p) => p.current)}
        fill="rgba(47, 109, 240, 0.15)"
        stroke="var(--brand-600)"
        strokeWidth="2"
      />
      {radarPoints.map((p, i) => {
        const { x, y } = point(i, (r * p.current) / 5)
        return (
          <g key={p.area}>
            <circle cx={x} cy={y} r="4" fill="var(--brand-600)">
              <title>{p.area}: level {p.current}</title>
            </circle>
            <text
              x={point(i, r + 30).x}
              y={point(i, r + 30).y + 4}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--text-secondary)"
            >
              {p.area}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Competencies() {
  const avgCurrent =
    Math.round(
      (competencyAreas.reduce((s, c) => s + c.current, 0) /
        competencyAreas.length) *
        10,
    ) / 10
  const avgTarget =
    Math.round(
      (competencyAreas.reduce((s, c) => s + c.target, 0) /
        competencyAreas.length) *
        10,
    ) / 10

  return (
    <div>
      <PageHead
        title="Competency Development"
        subtitle="Self-assess your level across Sopra Steria’s five competency areas and track your growth over time."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => alert('Self-assessment form opened (mock)')}
          >
            <Icon name="comp" size={16} />
            Update self-assessment
          </button>
        }
      />

      <div className="grid grid-main-13 mb-16">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {competencyAreas.map((c) => {
            const growth = c.current - c.previous
            return (
              <div className="comp-card" key={c.area}>
                <div className="comp-card-head">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--brand-50)',
                      color: areaColor[c.area],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                      fontSize: 15,
                    }}
                  >
                    {areaAbbrev[c.area]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-strong)' }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                      {c.description}
                    </div>
                  </div>
                  {growth > 0 ? (
                    <span className="growth-badge">
                      <Icon name="trendUp" size={13} />+{growth} this review
                    </span>
                  ) : (
                    <Badge tone="gray">No change</Badge>
                  )}
                </div>
                <div className="comp-scale">
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--brand-600)',
                      minWidth: 22,
                    }}
                  >
                    {c.current}
                  </span>
                  <span className="track">
                    <span
                      className="fill"
                      style={{ width: `${(c.current / 5) * 100}%` }}
                    />
                    <span
                      className="current-marker"
                      style={{ left: `${(c.current / 5) * 100}%` }}
                    />
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--violet)',
                      minWidth: 22,
                      textAlign: 'right',
                    }}
                  >
                    {c.target}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 10,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>target level</span>
                  <LevelDots current={c.current} target={c.target} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card pad>
            <div className="radar-wrap">
              <RadarChart />
            </div>
          </Card>
          <Card>
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Icon name="trendUp" size={18} style={{ color: 'var(--brand-600)' }} />
                <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>
                  Overall self-assessment
                </span>
                <Badge tone="blue">
                  {avgCurrent} / {avgTarget}
                </Badge>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                You are meeting your target in Delivery and Develop. Focus your
                development on <strong>Sales</strong> and{' '}
                <strong>Entrepreneurship</strong> to reach Principal Consultant
                readiness for the next review cycle.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
