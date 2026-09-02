import { useState } from 'react'
import { Card, CardHead, Icon, PageHead, ProgressBar, ProgressLabel, Badge } from '../components/ui'
import { Calendar } from '../components/Calendar'
import { ApiState } from '../components/ApiState'
import { fetchLearningPlan } from '../api/learningPlan'
import { useApiResource } from '../api/useApiResource'
import { useLanguage } from '../i18n/LanguageContext'
import type { CalendarEvent, DevelopmentGoal, StudyPlanItem, WeeklyPlanDay } from '../types'

const goalTone: Record<string, string> = {
  completed: 'success',
  'in-progress': 'blue',
  active: 'info',
}

const goalStatusKey = {
  completed: 'common.status.completed',
  'in-progress': 'common.status.in-progress',
  active: 'common.status.active',
} as const

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

function recomputeGoalProgress(goal: DevelopmentGoal): DevelopmentGoal {
  if (goal.milestones.length === 0) return goal
  const done = goal.milestones.filter((m) => m.done).length
  const progress = Math.round((done / goal.milestones.length) * 100)
  return {
    ...goal,
    progress,
    status: progress === 100 ? 'completed' : goal.status === 'completed' ? 'active' : goal.status,
  }
}

export default function LearningPlan() {
  const { t } = useLanguage()
  const learningPlanRes = useApiResource(fetchLearningPlan)

  return (
    <div>
      <PageHead
        title={t('title.learning')}
        subtitle={t('learning.subtitle')}
        actions={
          <button type="button" className="btn btn-primary">
            <Icon name="plus" size={16} />
            {t('common.newGoal')}
          </button>
        }
      />

      <ApiState loading={learningPlanRes.loading} error={learningPlanRes.error} onRetry={learningPlanRes.retry}>
        {learningPlanRes.data && (
          <LearningPlanContent
            initialGoals={learningPlanRes.data.goals}
            initialTasks={learningPlanRes.data.tasks}
            weeklyStudyPlan={learningPlanRes.data.weeklyPlan}
            calendarEvents={learningPlanRes.data.calendar}
          />
        )}
      </ApiState>
    </div>
  )
}

function LearningPlanContent({
  initialGoals,
  initialTasks,
  weeklyStudyPlan,
  calendarEvents,
}: {
  initialGoals: DevelopmentGoal[]
  initialTasks: StudyPlanItem[]
  weeklyStudyPlan: WeeklyPlanDay[]
  calendarEvents: CalendarEvent[]
}) {
  const { t } = useLanguage()
  // Goal milestones and study-plan tasks are frontend-only interactions (no
  // backend write endpoint exists for progress — see docs/CHANGELOG.md): seed
  // local state from the fetched data, then mutate it locally. No sync
  // effect is needed to pick up a later refetch — this component is only
  // ever mounted (by the parent's `ApiState`) once fresh data has loaded, so
  // a retry naturally unmounts/remounts it with the new `initial*` props.
  const [goals, setGoals] = useState<DevelopmentGoal[]>(initialGoals)
  const [plan, setPlan] = useState<StudyPlanItem[]>(initialTasks)

  const active = goals.filter((g) => g.status !== 'completed').length
  const completed = goals.filter((g) => g.status === 'completed').length
  const avgProgress =
    Math.round((goals.reduce((s, g) => s + g.progress, 0) / goals.length) * 10) / 10

  const planDone = plan.filter((s) => s.completed).length
  const planPct = Math.round((planDone / plan.length) * 100)

  function toggleMilestone(goalId: string, milestoneId: string) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m,
        )
        return recomputeGoalProgress({ ...g, milestones })
      }),
    )
  }

  function togglePlanItem(id: string) {
    setPlan((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    )
  }

  return (
    <>
      {/* Overview cards */}
      <div className="grid grid-4 mb-16">
        <div className="stat-card">
          <div className="stat-icon tone-brand"><Icon name="goal" size={20} /></div>
          <div><div className="stat-value">{active}</div><div className="stat-label">{t('learning.stat.activeGoals')}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tone-success"><Icon name="checkCircle" size={20} /></div>
          <div><div className="stat-value">{completed}</div><div className="stat-label">{t('learning.stat.completed')}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tone-violet"><Icon name="chart" size={20} /></div>
          <div><div className="stat-value">{avgProgress}%</div><div className="stat-label">{t('learning.stat.avgProgress')}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tone-info"><Icon name="book" size={20} /></div>
          <div><div className="stat-value">{planPct}%</div><div className="stat-label">{t('learning.stat.studyPlan')}</div></div>
        </div>
      </div>

      {/* Calendar */}
      <Card className="mb-16">
        <CardHead title={t('learning.calendar.title')} icon="calendar" />
        <p style={{ padding: '0 20px', margin: '-6px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
          {t('learning.calendar.subtitle')}
        </p>
        <Calendar events={calendarEvents} />
      </Card>

      {/* Weekly plan */}
      <Card className="mb-16">
        <CardHead title={t('learning.weekly.title')} icon="calendar" />
        <p style={{ padding: '0 20px', margin: '-6px 0 12px', fontSize: 13, color: 'var(--text-secondary)' }}>
          {t('learning.weekly.subtitle')}
        </p>
        <div style={{ padding: '0 20px 20px' }}>
          <div className="weekly-plan">
            {weeklyStudyPlan.map((d) => (
              <div className="weekly-day" key={d.day}>
                <div className="weekly-day-name">{d.day}</div>
                {d.items.map((item) => (
                  <div className="weekly-day-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-main-2">
        {/* Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>{t('learning.goals.title')}</h3>
          {goals.map((g) => (
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
                        {t(goalStatusKey[g.status as keyof typeof goalStatusKey])}
                      </Badge>
                      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                        {g.category} · {t('learning.due', { date: formatDate(g.dueDate) })}
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
                    <button
                      type="button"
                      className="milestone milestone-btn"
                      key={m.id}
                      onClick={() => toggleMilestone(g.id, m.id)}
                    >
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
                    </button>
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
              title={t('learning.plan.title')}
              icon="grad"
              action={
                <button className="card-link" style={{ border: 'none', background: 'none' }}>
                  {t('common.editPlan')} <Icon name="arrowRight" size={14} />
                </button>
              }
            />
            <div style={{ padding: '4px 20px 8px' }}>
              <ProgressLabel label={t('learning.plan.progress')} value={planPct} />
              <ProgressBar value={planPct} />
            </div>
            <div>
              {plan.map((s) => (
                <button
                  type="button"
                  className="study-item study-item-btn"
                  key={s.id}
                  onClick={() => togglePlanItem(s.id)}
                >
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
                </button>
              ))}
            </div>
          </Card>

          <Card className="mt-16">
            <CardHead title={t('learning.tips.title')} icon="sparkle" />
            <div style={{ padding: '4px 20px 16px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {t('learning.tips.body')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
