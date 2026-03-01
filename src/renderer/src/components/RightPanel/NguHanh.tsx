import type { CastResult, WuXing } from '../../types'
import { ELEMENT_COLORS, ELEMENT_LABELS, SHENG_CYCLE, KE_CYCLE } from '../../data/trigrams'
import { buildLineDetails } from '../../utils/casting'

interface Props {
  castResult: CastResult | null
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ fontSize: 36 }}>
        ☯
      </div>
      <div className="empty-state__text">Gieo quẻ để xem biểu đồ Ngũ Hành.</div>
    </div>
  )
}

/** Count how many lines belong to each element */
function countElements(castResult: CastResult): Record<WuXing, number> {
  const details = buildLineDetails(castResult)
  const counts: Record<WuXing, number> = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 }
  details.forEach(d => {
    counts[d.element]++
  })
  return counts
}

/** Five-element wheel positioned using absolute coordinates */
const WHEEL_POSITIONS: Record<WuXing, { top: string; left: string }> = {
  Hỏa: { top: '0%', left: '50%' }, // top (fire=south)
  Mộc: { top: '28%', left: '5%' }, // top-left (wood=east)
  Thủy: { top: '68%', left: '12%' }, // bottom-left (water=north)
  Kim: { top: '28%', left: '80%' }, // top-right (metal=west)
  Thổ: { top: '68%', left: '72%' } // bottom-right (earth=center-ish)
}

const ELEMENT_ORDER: WuXing[] = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ']

export function NguHanh({ castResult }: Props) {
  if (!castResult) return <EmptyState />

  const hexElement = castResult.primaryHex.element
  const counts = countElements(castResult)

  const _generatedBy = Object.entries(SHENG_CYCLE).find(([_k, v]) => v === hexElement)?.[0] as
    | WuXing
    | undefined
  const _controlledBy = Object.entries(KE_CYCLE).find(([_k, v]) => v === hexElement)?.[0] as
    | WuXing
    | undefined

  return (
    <>
      {/* Wheel */}
      <div className="panel-section">
        <div className="panel-section__title">Biểu Đồ Ngũ Hành</div>
        <div style={{ position: 'relative', height: 200, marginBottom: 8 }}>
          <div
            className="ngu-hanh__wheel"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            {ELEMENT_ORDER.map(el => {
              const pos = WHEEL_POSITIONS[el]
              const isActive = el === hexElement
              const count = counts[el]
              return (
                <div
                  key={el}
                  className={`ngu-hanh__element${isActive ? ' ngu-hanh__element--active' : ''}`}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: ELEMENT_COLORS[el],
                    opacity: count === 0 ? 0.45 : 1
                  }}
                  title={`${el}: ${count} hào`}
                >
                  <span className="ngu-hanh__element-zh">{ELEMENT_LABELS[el].zh}</span>
                  <span className="ngu-hanh__element-vi">{ELEMENT_LABELS[el].vi}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Element distribution */}
      <div className="panel-section">
        <div className="panel-section__title">Phân Bổ Ngũ Hành</div>
        <div className="ngu-hanh__legend">
          {ELEMENT_ORDER.map(el => {
            const count = counts[el]
            const total = Object.values(counts).reduce((a, b) => a + b, 0)
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={el} className="ngu-hanh__legend-row">
                <div
                  className="ngu-hanh__legend-dot"
                  style={{ backgroundColor: ELEMENT_COLORS[el] }}
                />
                <span className="ngu-hanh__legend-label">
                  {el} {el === hexElement ? '★' : ''}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 4,
                    background: 'var(--border-light)',
                    borderRadius: 2,
                    margin: '0 8px'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: ELEMENT_COLORS[el],
                      borderRadius: 2,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
                <span className="ngu-hanh__legend-val">{count} hào</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Relationships */}
      <div className="panel-section">
        <div className="panel-section__title">Quan Hệ Tương Sinh Tương Khắc</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <RelRow
            label="Nguyên thần (sinh mình)"
            from={_generatedBy ?? 'Mộc'}
            toEl={hexElement}
            type="sheng"
          />
          <RelRow
            label="Tử thần (mình sinh)"
            from={hexElement}
            toEl={SHENG_CYCLE[hexElement]}
            type="sheng"
          />
          <RelRow
            label="Quan quỷ (khắc mình)"
            from={_controlledBy ?? 'Kim'}
            toEl={hexElement}
            type="ke"
          />
          <RelRow
            label="Thê tài (mình khắc)"
            from={hexElement}
            toEl={KE_CYCLE[hexElement]}
            type="ke"
          />
        </div>
      </div>
    </>
  )
}

function RelRow({
  label,
  from,
  toEl,
  type
}: {
  label: string
  from: WuXing
  toEl: WuXing
  type: 'sheng' | 'ke'
}) {
  const color = type === 'sheng' ? '#2d6a4f' : '#c0392b'
  const arrow = type === 'sheng' ? '→' : '→'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
      <span style={{ color: 'var(--text-muted)', width: 140, flexShrink: 0 }}>{label}</span>
      <span style={{ color: ELEMENT_COLORS[from], fontWeight: 600 }}>{from}</span>
      <span style={{ color, fontSize: 14 }}>{arrow}</span>
      <span style={{ color: ELEMENT_COLORS[toEl], fontWeight: 600 }}>{toEl}</span>
    </div>
  )
}
