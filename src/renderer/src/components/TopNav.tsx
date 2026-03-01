import { Hexagon } from 'lucide-react'
import { getLunarDateString } from '../utils/casting'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = [
  { id: 'cast', label: 'Gieo Quẻ' },
  { id: 'history', label: 'Lịch Sử' },
  { id: 'settings', label: 'Cài Đặt' }
]

export function TopNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="topnav">
      {/* Logo */}
      <div className="topnav__logo">
        <Hexagon size={22} className="topnav__logo-icon" strokeWidth={1.5} />
        <span className="topnav__app-name">Lục Hào Bát Quái</span>
      </div>

      {/* Center tabs */}
      <div className="topnav__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`topnav__tab${activeTab === tab.id ? ' topnav__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right area */}
      <div className="topnav__right">
        <span className="topnav__date">{getLunarDateString()}</span>
        <div className="topnav__avatar" title="Lục Hào">六</div>
      </div>
    </nav>
  )
}
