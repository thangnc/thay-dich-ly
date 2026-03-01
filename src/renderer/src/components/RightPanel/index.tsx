import { useState } from 'react'
import type { CastResult } from '../../types'
import { QueDo } from './QueDo'
import { NguHanh } from './NguHanh'
import { BatQuat } from './BatQuat'
import { ThamKhao } from './ThamKhao'

interface Props {
  castResult: CastResult | null
}

type TabId = 'que-do' | 'ngu-hanh' | 'bat-quai' | 'tham-khao'

const TABS: { id: TabId; label: string }[] = [
  { id: 'que-do', label: 'Quẻ Đồ' },
  { id: 'ngu-hanh', label: 'Ngũ Hành' },
  { id: 'bat-quai', label: 'Bát Quái' },
  { id: 'tham-khao', label: 'Tham Khảo' }
]

export function RightPanel({ castResult }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('que-do')

  // Auto-switch to QueDo when a cast result arrives
  // (done via useEffect in parent or we can detect castResult change here)

  return (
    <aside className="right-panel">
      {/* Tab bar */}
      <div className="right-panel__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`right-panel__tab${activeTab === tab.id ? ' right-panel__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="right-panel__content">
        {activeTab === 'que-do' && <QueDo castResult={castResult} />}
        {activeTab === 'ngu-hanh' && <NguHanh castResult={castResult} />}
        {activeTab === 'bat-quai' && <BatQuat castResult={castResult} />}
        {activeTab === 'tham-khao' && <ThamKhao castResult={castResult} />}
      </div>
    </aside>
  )
}
