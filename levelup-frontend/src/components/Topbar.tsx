import { Icon } from './Icon'

export function Topbar({
  title,
  onMenu,
}: {
  title: string
  onMenu?: () => void
}) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="mobile-menu-btn"
        aria-label="Open menu"
        onClick={onMenu}
      >
        <Icon name="menu" size={20} />
      </button>
      <span className="topbar-title">{title}</span>
      <div className="topbar-spacer" />
      <button type="button" className="topbar-icon-btn" aria-label="Search">
        <Icon name="search" size={19} />
      </button>
      <button type="button" className="topbar-icon-btn" aria-label="Notifications">
        <Icon name="bell" size={19} />
        <span className="badge-dot" />
      </button>
      <button type="button" className="topbar-icon-btn" aria-label="Account">
        <Icon name="user" size={19} />
      </button>
    </header>
  )
}
