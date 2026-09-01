import { Card, CardHead, Icon, PageHead, ProgressBar, ProgressLabel, Badge } from '../components/ui'
import { developmentGoals, studyPlan } from '../data/mock'

const goalTone: Record<string, string> = {
  completed: 'success',
  'in-progress': 'blue',
  active: 'info',
}

const typeIcon: Record<string, string> = {
  course: 'grad',
  certification: 'cert',
  reading: 'book',
  practice: 'target',
}

const typeColor: Record<string, string> = {
  course: 'var(--brand-600)',
  certification: 'var(--violet)',
  reading: 'var(--teal)',
  practice: 'var(--warning)',
}

export default function LearningPlan() {
  const active = developmentGoals.filter(
    (g) => g.status !== 'completed',
  ).length
  const completed = developmentGoals.filter(
    (g) => g.status === 'completed',
  ).length
  const avgProgress =
    Math.round(
      (developmentGoals.reduce((s, g) => s + g.progress, 0) /
        developmentGoals.length) *
        10,
    ) / 10

  const planDone = studyPlan.filter((s) => s.completed).length
  const planPct = Math.round((planDone / studyPlan.length) * 100)

  return (
    <div>
      <PageHead
        title="Learning Plan"
        subtitle="Set development goals, track milestones and follow study plans to grow your competencies and progress your career."
        actions={
          <button type="button" className="btn btn-primary">
            <Icon name="plus" size={16} />
            New goal
          </button>
        }
      />

      {/* Overview cards */}
      <div className="grid grid-4 mb-16">
        <div className="stat-card">
          <div className="stat-icon tone-brand"><Icon name="goal" size={20} /></div>
          <div><div className="stat-value">{active}</div><div className="stat-label">Active goals</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tone-success"><Icon name="checkCircle" size={20} /></div>
          <div><div className="stat-value">{completed}</div><div className="stat-label">Completed</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tone-violet"><Icon name="chart" size={20} /></div>
          <div><div className="stat-value">{avgProgress}%</div><div className="stat-label">Avg progress</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tone-info"><Icon name="book" size={20} /></div>
          <div><div className="stat-value">{planPct}%</div><div className="stat-label">Study plan</div></div>
        </div>
      </div>

      <div className="grid grid-main-2">
        {/* Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Development goals</h3>
          {developmentGoals.map((g) => (
            <Card key={g.id}>
              <div style={{ padding: 18 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'var(--brand-50)',
                      color: 'var(--brand-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={g.category === 'Certification' ? 'cert' : 'goal'} size={18} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 650, color: 'var(--text-strong)' }}>
                      {g.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <Badge tone={goalTone[g.status]} dot>
                        {g.status}
                      </Badge>
                      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                        {g.category} · due {formatDate(g.dueDate)}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: 'var(--text-strong)',
                    }}
                  >
                    {g.progress}%
                  </span>
                </div>

                <ProgressBar value={g.progress} tone={g.status === 'completed' ? 'success' : 'violet'} />

                <div style={{ marginTop: 14 }}>
                  {g.milestones.map((m) => (
                    <div className="milestone" key={m.id}>
                      <div className={`milestone-check ${m.done ? 'done' : ''}`}>
                        {m.done && <Icon name="check" size={14} />}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 500,
                            color: m.done ? 'var(--text-secondary)' : 'var(--text-strong)',
                            textDecoration: m.done ? 'line-through' : 'none',
                          }}
                        >
                          {m.label}
                        </div>
                        <div className="milestone-date">{formatDate(m.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Study plan */}
        <div>
          <Card>
            <CardHead
              title="Active study plan — AZ-305"
              icon="grad"
              action={
                <button className="card-link" style={{ border: 'none', background: 'none' }}>
                  Edit plan <Icon name="arrowRight" size={14} />
                </button>
              }
            />
            <div style={{ padding: '4px 20px 8px' }}>
              <ProgressLabel label="Plan progress" value={planPct} />
              <ProgressBar value={planPct} />
            </div>
            <div>
              {studyPlan.map((s) => (
                <div className="study-item" key={s.id}>
                  <span className={`study-check ${s.completed ? 'done' : ''}`}>
                    {s.completed && <Icon name="check" size={14} />}
                  </span>
                  <span className="study-type" style={{ color: typeColor[s.type] }}>
                    <Icon name={typeIcon[s.type]} size={17} />
                  </span>
                  <div className="study-info">
                    <div className="t" style={{ textDecoration: s.completed ? 'line-through' : 'none', color: s.completed ? 'var(--text-secondary)' : undefined }}>
                      {s.title}
                    </div>
                    <div className="s">
                      {s.source} · {s.duration}
                    </div>
                  </div>
                  <Badge tone="gray">{s.type}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-16">
            <CardHead title="Learning tips" icon="sparkle" />
            <div style={{ padding: '4px 20px 16px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                <strong>Space out your study.</strong> For AZ-305, studies show
                ~45 minutes of focused practice daily outperforms long weekend
                sessions. Pair each module with at least one practice exam.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
