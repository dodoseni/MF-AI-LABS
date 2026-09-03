import { useMemo, useState } from 'react'
import { Icon } from './Icon'
import type { CalendarEvent, CalendarEventType } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

/** Colour + icon shown for each calendar event category (month-grid dots, legend, day panel). */
const typeColor: Record<CalendarEventType, string> = {
  module: 'var(--brand-500)',
  study: 'var(--teal)',
  practice: 'var(--warning)',
  exam: 'var(--danger)',
  milestone: 'var(--violet)',
}

const typeIcon: Record<CalendarEventType, string> = {
  module: 'book',
  study: 'brain',
  practice: 'target',
  exam: 'cert',
  milestone: 'goal',
}

const typeLabelKey: Record<CalendarEventType, TranslationKey> = {
  module: 'learning.calendar.type.module',
  study: 'learning.calendar.type.study',
  practice: 'learning.calendar.type.practice',
  exam: 'learning.calendar.type.exam',
  milestone: 'learning.calendar.type.milestone',
}

/** Priority order so the most important activities (exam, then practice/milestone) surface
 *  first in the selected-day panel when several things land on the same date. */
const typePriority: Record<CalendarEventType, number> = {
  exam: 0,
  practice: 1,
  milestone: 2,
  module: 3,
  study: 4,
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function Calendar({ events }: { events: CalendarEvent[] }) {
  const { t } = useLanguage()

  // Anchor the calendar on the month containing the earliest upcoming event so the certification
  // journey is visible on load without extra navigation.
  const initial = useMemo(() => {
    const today = new Date()
    const upcoming = events
      .map((e) => new Date(e.date))
      .filter((d) => d.getTime() >= new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime())
      .sort((a, b) => a.getTime() - b.getTime())
    return upcoming[0] ?? today
  }, [events])

  const [monthCursor, setMonthCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1))
  const [selected, setSelected] = useState<string | null>(toDateKey(initial))

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date)!.push(e)
    }
    for (const list of map.values()) {
      list.sort((a, b) => typePriority[a.type] - typePriority[b.type])
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
  const todayKey = toDateKey(new Date())
  const selectedEvents = selected ? eventsByDay.get(selected) ?? [] : []

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          aria-label={t('learning.calendar.prevMonth')}
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
        >
          <Icon name="chevronDown" size={16} style={{ transform: 'rotate(90deg)' }} />
        </button>
        <span className="calendar-month">{monthLabel}</span>
        <button
          type="button"
          className="calendar-nav"
          aria-label={t('learning.calendar.nextMonth')}
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
          const key = toDateKey(d)
          const inMonth = d.getMonth() === monthCursor.getMonth()
          const dayEvents = eventsByDay.get(key) ?? []
          return (
            <button
              type="button"
              key={key}
              className={`calendar-day ${inMonth ? '' : 'other-month'} ${key === todayKey ? 'today' : ''} ${key === selected ? 'selected' : ''}`}
              onClick={() => setSelected(key)}
              aria-pressed={key === selected}
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
            <span className="calendar-legend-icon" style={{ color: typeColor[type] }}>
              <Icon name={typeIcon[type]} size={13} />
            </span>
            {t(typeLabelKey[type])}
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
              <span className="calendar-event-icon" style={{ color: typeColor[e.type] }}>
                <Icon name={typeIcon[e.type]} size={15} />
              </span>
              <span className="calendar-event-title">{e.title}</span>
              <span className="calendar-event-type">{t(typeLabelKey[e.type])}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
