import { NavLink, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { currentUser } from '../data/mock'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const mainNav: { to: string; labelKey: TranslationKey; icon: string; end?: boolean }[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: 'dashboard', end: true },
  { to: '/certifications', labelKey: 'nav.certifications', icon: 'cert' },
  { to: '/career', labelKey: 'nav.career', icon: 'level' },
  { to: '/learning', labelKey: 'nav.learning', icon: 'grad' },
]

const utilityNav: { to: string; labelKey: TranslationKey; icon: string }[] = [
  { to: '/assistant', labelKey: 'nav.assistant', icon: 'brain' },
  { to: '/profile', labelKey: 'nav.profile', icon: 'user' },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  return (
    <>
      <div
        className={`mobile-overlay ${open ? 'show' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">LU</div>
          <div>
            <div className="brand-name">LevelUP</div>
            <div className="brand-sub">{t('app.brand.sub')}</div>
          </div>
        </div>

        <div className="sidebar-section">{t('nav.section.workspace')}</div>
        <nav className="sidebar-nav">
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <Icon name={item.icon} size={19} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section">{t('nav.section.support')}</div>
        <nav className="sidebar-nav">
          {utilityNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <Icon name={item.icon} size={19} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
          <button
            type="button"
            className="sidebar-link"
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none' }}
          >
            <Icon name="bell" size={19} />
            <span>{t('nav.notifications')}</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <NavLink to="/profile" className="avatar" onClick={onClose} style={{ textDecoration: 'none' }}>
            {currentUser.avatarInitials}
          </NavLink>
          <div>
            <div className="profile-name">{currentUser.name}</div>
            <div className="profile-role">{currentUser.role}</div>
          </div>
          <button
            type="button"
            className="sidebar-logout"
            aria-label={t('nav.signOut')}
            onClick={() => navigate('/')}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
    </>
  )
}
