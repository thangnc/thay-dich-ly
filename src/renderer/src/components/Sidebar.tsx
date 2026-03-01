import { useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import type { Session } from '../types'
import { formatRelative } from '../utils/casting'
import { lineIsYang } from '../types'

interface Props {
  sessions: Session[]
  activeSession: Session | null
  onNew: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

/** Render a mini hexagram icon from line values */
function HexIcon({ lines }: { lines: import('../types').LineValue[] }) {
  // Display from top (line 6) to bottom (line 1) — reversed
  const reversed = [...lines].reverse()
  return (
    <div className="sidebar__hex-icon">
      {reversed.map((v, i) => {
        const isYang = lineIsYang(v)
        return isYang ? (
          <div key={i} className="sidebar__hex-line" />
        ) : (
          <div key={i} className="sidebar__hex-line--yin">
            <span /><span />
          </div>
        )
      })}
    </div>
  )
}

/** Fallback icon when no cast result */
function DefaultHexIcon() {
  return (
    <div className="sidebar__hex-icon">
      {[1,0,1,0,1,0].map((isYang, i) =>
        isYang ? (
          <div key={i} className="sidebar__hex-line" />
        ) : (
          <div key={i} className="sidebar__hex-line--yin"><span /><span /></div>
        )
      )}
    </div>
  )
}

const ALL_TAGS = ['Tình Duyên', 'Sự Nghiệp', 'Tài Lộc', 'Sức Khỏe', 'Gia Đạo', 'Du Lịch']

export function Sidebar({ sessions, activeSession, onNew, onSelect, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.question.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="sidebar">
      {/* New session button */}
      <div>
        <button className="sidebar__new-btn" onClick={onNew}>
          <Plus size={16} strokeWidth={2.5} />
          Gieo quẻ mới
        </button>
      </div>

      {/* Search */}
      <div className="sidebar__search">
        <Search size={14} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm quẻ..."
        />
      </div>

      {/* History */}
      <div className="sidebar__section-label">Lịch Sử Gần Đây</div>

      <div className="sidebar__history">
        {filtered.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-sidebar-muted)', padding: '8px 4px' }}>
            {search ? 'Không tìm thấy kết quả' : 'Chưa có quẻ nào'}
          </div>
        )}
        {filtered.map(s => (
          <div
            key={s.id}
            className={`sidebar__history-item${activeSession?.id === s.id ? ' sidebar__history-item--active' : ''}`}
            onClick={() => onSelect(s.id)}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {s.castResult ? (
              <HexIcon lines={s.castResult.lines} />
            ) : (
              <DefaultHexIcon />
            )}

            <div className="sidebar__history-text">
              <div className="sidebar__history-title">
                {s.castResult?.primaryHex.name ?? s.title}
              </div>
              <div className="sidebar__history-date">{formatRelative(s.createdAt)}</div>
            </div>

            {hoveredId === s.id && (
              <button
                className="icon-btn"
                style={{ width: 24, height: 24, border: 'none', color: 'var(--accent-cinnabar)' }}
                onClick={e => { e.stopPropagation(); onDelete(s.id) }}
                title="Xoá"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="sidebar__section-label">Thẻ Phân Loại</div>
      <div className="sidebar__tags">
        {ALL_TAGS.map(tag => (
          <span key={tag} className="sidebar__tag">{tag}</span>
        ))}
      </div>
    </aside>
  )
}
