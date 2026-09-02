import { useMemo, useState } from 'react'
import { Icon } from './Icon'
import type { CalendarEvent, CalendarEventType } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

const typeColor: Record<CalendarEventType, string> = {
  study: 'var(--brand-500)',
  exam: 'var(--danger)',
  practice: 'var(--warning)',
  milestone: 'var(--violet)',
}

const typeLabelKey: Record<CalendarEventType, string> = {
  study: 'Study session',
  exam: 'Exam',
  practice: 'Practice exam',
  milestone: 'Milestone',
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function Calendar({ events }: { events: CalendarEvent[] }) {
  const { t } = useLanguage()
  // Anchor the demo calendar on the month containing the earliest upcoming event
  // so the mock data is visible without extra navigation.
  const initial = useMemo(() => {
    const dates = events.map((e) => new Date(e.date)).sort((a, b) => a.getTime() - b.getTime())
    return dates[0] ?? new Date()
  }, [events])

  const [monthCursor, setMonthCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(toKey(initial))

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const key = e.date
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    }
    return map
  }, [events])

  const days = useMemo(() => {
    const year = monthCursor.getFullYear()
    const month = monthCursor.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    // Monday-first grid
    const startOffset = (firstOfMonth.getDay() + 6) % 7
    const gridStart = new Date(year, month, 1 - startOffset)
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      return d
    })
  }, [monthCursor])

  const monthLabel = monthCursor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const todayKey = toKey(new Date())
  const selectedEvents = selected ? eventsByDay.get(selected) ?? [] : []

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          aria-label="Previous month"
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
        >
          <Icon name="chevronDown" size={16} style={{ transform: 'rotate(90deg)' }} />
        </button>
        <span className="calendar-month">{monthLabel}</span>
        <button
          type="button"
          className="calendar-nav"
          aria-label="Next month"
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
        >
          <Icon name="chevronDown" size={16} style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {weekdayLabels.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((d) => {
          const key = toKey(d)
          const inMonth = d.getMonth() === monthCursor.getMonth()
          const dayEvents = eventsByDay.get(key) ?? []
          return (
            <button
              type="button"
              key={key}
              className={`calendar-day ${inMonth ? '' : 'other-month'} ${key === todayKey ? 'today' : ''} ${key === selected ? 'selected' : ''}`}
              onClick={() => setSelected(key)}
            >
              <span className="calendar-day-num">{d.getDate()}</span>
              {dayEvents.length > 0 && (
                <span className="calendar-dots">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span key={e.id} className="calendar-dot" style={{ background: typeColor[e.type] }} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="calendar-legend">
        {(Object.keys(typeColor) as CalendarEventType[]).map((type) => (
          <span key={type} className="calendar-legend-item">
            <span className="calendar-dot" style={{ background: typeColor[type] }} />
            {typeLabelKey[type]}
          </span>
        ))}
      </div>

      <div className="calendar-day-events">
        <div className="calendar-day-events-head">
          {selected
            ? new Date(selected).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
            : t('learning.calendar.upcoming')}
        </div>
        {selectedEvents.length === 0 ? (
          <p className="calendar-empty">{t('learning.calendar.noEvents')}</p>
        ) : (
          selectedEvents.map((e) => (
            <div className="calendar-event-item" key={e.id}>
              <span className="calendar-dot" style={{ background: typeColor[e.type] }} />
              <span>{e.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
