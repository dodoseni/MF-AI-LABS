import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { languageNames, type Lang } from '../i18n/translations'

export function Topbar({
  title,
  onMenu,
}: {
  title: string
  onMenu?: () => void
}) {
  const { lang, setLang, t } = useLanguage()

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

      <label className="lang-select" aria-label={t('topbar.language')}>
        <Icon name="globe" size={16} />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
        >
          {(Object.keys(languageNames) as Lang[]).map((code) => (
            <option key={code} value={code}>
              {languageNames[code]}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="topbar-icon-btn" aria-label={t('topbar.search')}>
        <Icon name="search" size={19} />
      </button>
      <button type="button" className="topbar-icon-btn" aria-label={t('topbar.notifications')}>
        <Icon name="bell" size={19} />
        <span className="badge-dot" />
      </button>
      <Link to="/profile" className="topbar-icon-btn" aria-label={t('topbar.account')}>
        <Icon name="user" size={19} />
      </Link>
    </header>
  )
}
