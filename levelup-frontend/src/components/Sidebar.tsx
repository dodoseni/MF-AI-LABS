import { NavLink, useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { currentUser } from '../data/mock'

const mainNav = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/certifications', label: 'Certifications', icon: 'cert' },
  { to: '/competencies', label: 'Competency', icon: 'comp' },
  { to: '/career', label: 'Career Path', icon: 'level' },
  { to: '/learning', label: 'Learning Plan', icon: 'grad' },
]

const utilityNav = [
  { to: '/assistant', label: 'AI Assistant', icon: 'brain' },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
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
            <div className="brand-sub">Sopra Steria</div>
          </div>
        </div>

        <div className="sidebar-section">Workspace</div>
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
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section">Support</div>
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
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            className="sidebar-link"
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none' }}
          >
            <Icon name="bell" size={19} />
            <span>Notifications</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <div className="avatar">{currentUser.avatarInitials}</div>
          <div>
            <div className="profile-name">{currentUser.name}</div>
            <div className="profile-role">{currentUser.role}</div>
          </div>
          <button
            type="button"
            className="sidebar-logout"
            aria-label="Sign out"
            onClick={() => navigate('/')}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
    </>
  )
}
