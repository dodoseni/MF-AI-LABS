import { useEffect, useRef, useState } from 'react'
import { Icon, PageHead } from '../components/ui'
import type { ChatMessage } from '../types'

const initialMessages: ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    content:
      "Hi Amalie! I'm your LevelUP career assistant. I can help you understand certification requirements, discover learning activities, identify competency gaps and generate study plans. How can I help you grow today?",
    timestamp: new Date().toISOString(),
  },
]

const suggestions = [
  'What do I need for Principal Consultant?',
  'Find my competency gaps',
  'Create a study plan for AZ-305',
  'Recommend certifications for data & AI',
]

const replyBank: Record<string, string> = {
  principal:
    "Looking at your profile, moving from **Senior Consultant** to **Principal Consultant** requires: 1) **AZ-305** (in progress, 62%), 2) a security certification like **SC-300** or **AZ-500** (not started), and 3) reaching competency level 4 in **Sales** and **Entrepreneurship**. Your biggest win is completing AZ-305 and booking SC-300 — that alone gets you to ~90% readiness.",
  gap: 'Based on your self-assessments, you show the largest competency gaps in **Sales** (level 3, target 4) and **Entrepreneurship** (level 3, target 4). Recommended: co-lead a proposal submission and present at an internal sales forum. Your Delivery and Develop areas already meet target.',
  plan: 'Here is a focused 6-week study plan for **AZ-305**: Week 1–2 finish the Design identity/governance modules (2 modules), Week 3 combine the design storage + continuity modules with practice questions, Week 4 take MeasureUp practice exams and target 70%+, Week 5 revise weak areas and do a timed full exam, Week 6 book and take the exam. I’ve added this to your Learning Plan.',
  cert:
    'Given your path toward Principal Consultant and interest in **Data & AI**, I recommend: **DP-203** (Azure Data Engineer) and **AI-102** (Azure AI Engineer) to build the data/AI specialisation, alongside **SC-300** for the security requirement. Azure parter certifications align strongly with Sopra Steria delivery work.',
}

function getReply(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('principal')) return replyBank.principal
  if (lower.includes('gap')) return replyBank.gap
  if (lower.includes('study') || lower.includes('plan')) return replyBank.plan
  if (lower.includes('cert') || lower.includes('recommend')) return replyBank.cert
  return (
    "Great question! Based on your profile as a Senior Consultant progressing toward Principal, I'd focus on completing the **AZ-305** path and booking a security certification. Would you like me to generate a study plan, identify your competency gaps, or recommend certifications for a specific specialisation?"
  )
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, typing])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: getReply(trimmed),
          timestamp: new Date().toISOString(),
        },
      ])
      setTyping(false)
    }, 900)
  }

  return (
    <div>
      <PageHead
        title="AI Career Assistant"
        subtitle="Ask career questions, get certification and learning recommendations, and uncover your competency gaps."
      />

      <div className="ai-layout">
        <div className="ai-chat">
          <div className="ai-chat-head">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg,#2f6df0,#7c3aed)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="brain" size={19} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-strong)' }}>LevelUP Assistant</div>
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                ● Online
              </div>
            </div>
            <button type="button" className="card-link" style={{ border: 'none', background: 'none' }}>
              New chat <Icon name="plus" size={14} />
            </button>
          </div>

          <div className="ai-chat-body" ref={bodyRef}>
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.role}`}>
                <div className="msg-avatar">
                  <Icon name={m.role === 'assistant' ? 'brain' : 'user'} size={17} />
                </div>
                <div className="msg-bubble">{renderMarkdown(m.content)}</div>
              </div>
            ))}
            {typing && (
              <div className="msg assistant">
                <div className="msg-avatar">
                  <Icon name="brain" size={17} />
                </div>
                <div className="msg-bubble">
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="suggestions">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ai-input-row">
            <textarea
              className="ai-input"
              rows={1}
              placeholder="Ask about certifications, career levels, competencies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
            />
            <button
              type="button"
              className="ai-send"
              aria-label="Send"
              disabled={!input.trim() || typing}
              onClick={() => send(input)}
            >
              <Icon name="send" size={18} />
            </button>
          </div>
        </div>

        <div className="ai-side">
          <div className="ai-cap">
            <div className="ai-cap-head">
              <Icon name="target" size={16} style={{ color: 'var(--brand-600)' }} />
              Capabilities
            </div>
            {[
              ['cert', 'Answer career & certification questions'],
              ['sparkle', 'Recommend relevant certifications'],
              ['grad', 'Suggest learning activities'],
              ['comp', 'Identify competency gaps'],
              ['book', 'Generate study plans'],
            ].map(([ic, label]) => (
              <div className="ai-cap-item" key={label}>
                <span className="ic"><Icon name={ic} size={16} /></span>
                {label}
              </div>
            ))}
          </div>

          <div className="ai-cap">
            <div className="ai-cap-head">
              <Icon name="user" size={16} style={{ color: 'var(--brand-600)' }} />
              Assistant context
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              The assistant is preloaded with your current level{' '}
              <strong>Senior Consultant</strong>, certification progress (8/12),
              competency self-assessments, and your active learning plan. It can
              tailor every answer to your real situation.
            </p>
          </div>

          <div className="ai-cap">
            <div className="ai-cap-head">
              <Icon name="alert" size={16} style={{ color: 'var(--warning)' }} />
              Did you know?
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Associates typically unlock{' '}
              <strong>2× faster promotion</strong> when they combine self-assessment
              with an AI-guided study plan. Try asking: <em>"Give me a monthly
              development roadmap."</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}
