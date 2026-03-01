import type { CastResult, LineDetail } from '../../types'
import { buildLineDetails } from '../../utils/casting'
import { ELEMENT_COLORS } from '../../data/trigrams'
import { lineIsYang, isChanging } from '../../types'
import { LINE_LABELS } from '../../data/hexagrams'

interface Props {
  castResult: CastResult | null
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ fontSize: 40 }}>☰</div>
      <div className="empty-state__text">
        Gieo quẻ để xem thông tin chi tiết về quẻ và các hào.
      </div>
    </div>
  )
}

function DiagramLines({ result }: { result: CastResult }) {
  const { lines, changingLineIndices } = result
  // Display from top (line 6) to bottom (line 1)
  const display = [...lines].map((v, i) => ({ v, i })).reverse()
  return (
    <div className="que-do__diagram">
      {display.map(({ v, i }) => {
        const yang = lineIsYang(v)
        const changing = changingLineIndices.includes(i)
        return (
          <div
            key={i}
            className={[
              'que-do__diagram-line',
              yang ? 'que-do__diagram-line--yang' : 'que-do__diagram-line--yin',
              changing ? 'que-do__diagram-line--changing' : ''
            ].join(' ')}
          >
            {yang ? (
              <div className="que-do__diagram-bar" style={{ flex: 1 }} />
            ) : (
              <>
                <div className="que-do__diagram-bar" style={{ flex: 1, maxWidth: '44%' }} />
                <div className="que-do__diagram-bar" style={{ flex: 1, maxWidth: '44%' }} />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ElementDot({ element }: { element: import('../../types').WuXing }) {
  return (
    <span className="element-dot">
      <span
        className="element-dot__circle"
        style={{ backgroundColor: ELEMENT_COLORS[element] }}
      />
      {element}
    </span>
  )
}

const LINE_VALUE_LABELS: Record<number, string> = {
  6: '老阴 ×', 7: '少阳 —', 8: '少阴 --', 9: '老阳 ○'
}

export function QueDo({ castResult }: Props) {
  if (!castResult) return <EmptyState />

  const { primaryHex, changedHex, changingLineIndices } = castResult
  const details: LineDetail[] = buildLineDetails(castResult)

  return (
    <>
      {/* Hexagram header card */}
      <div className="que-do__header">
        <DiagramLines result={castResult} />
        <div className="que-do__hex-info">
          <div className="que-do__hex-number">Quẻ {primaryHex.number} · {primaryHex.chinese}</div>
          <div className="que-do__hex-name">{primaryHex.fullName}</div>
          <div className="que-do__hex-char">{primaryHex.character}</div>
          <div className="que-do__trigrams">
            {primaryHex.upperTrigram} ☰ / {primaryHex.lowerTrigram} ☰
          </div>
        </div>
      </div>

      {/* Changing lines count badge */}
      {changingLineIndices.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge--red">
            {changingLineIndices.length} hào động
          </span>
          {changedHex && (
            <span className="badge badge--gold">
              → {changedHex.fullName}
            </span>
          )}
        </div>
      )}

      {/* Line detail table */}
      <div className="panel-section">
        <div className="panel-section__title">Chi Tiết Từng Hào</div>
        <table className="line-table">
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Nạp giáp</th>
              <th>Ngũ hành</th>
              <th>Lục thân</th>
              <th>Lục thú</th>
            </tr>
          </thead>
          <tbody>
            {/* Display from top (index 5) to bottom (index 0) */}
            {[...details].reverse().map(d => (
              <tr key={d.index}>
                <td className={`label-cell${d.isChanging ? ' changing' : ''}`}>
                  {d.label} {d.isChanging ? '●' : ''}
                </td>
                <td>{d.earthBranch} {d.isYang ? '—' : '--'}</td>
                <td><ElementDot element={d.element} /></td>
                <td>{d.lucThan}</td>
                <td style={{ fontSize: 11 }}>{d.lucThu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Changed hexagram */}
      {changedHex && (
        <div className="panel-section">
          <div className="panel-section__title">Quẻ Biến Tương Ứng</div>
          <div className="tham-khao__card">
            <div className="tham-khao__card-title">
              Quẻ {changedHex.number} — {changedHex.fullName} {changedHex.character}
            </div>
            <div className="tham-khao__card-text">{changedHex.judgment}</div>
          </div>
        </div>
      )}
    </>
  )
}
