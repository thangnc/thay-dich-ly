import type { CastResult } from '../../types'
import { TRIGRAMS } from '../../data/trigrams'

interface Props {
  castResult: CastResult | null
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ fontSize: 36 }}>☱</div>
      <div className="empty-state__text">Gieo quẻ để xem thông tin Bát Quái.</div>
    </div>
  )
}

function TrigramDiagram({ binary }: { binary: string }) {
  // binary: "111", "110" etc — bit2=top, bit1=mid, bit0=bottom of trigram
  const bits = binary.split('').map(Number)  // [top, mid, bottom]
  const linesDisplayOrder = [bits[0], bits[1], bits[2]].reverse() // show bottom first, then flip for display

  return (
    <div className="trigram-box__diagram">
      {/* Display: bottom line first visually from top in column-reverse */}
      {[bits[2], bits[1], bits[0]].reverse().map((bit, i) => (
        <div key={i} className={`trigram-box__line trigram-box__line--${bit === 1 ? 'yang' : 'yin'}`}>
          {bit === 1 ? (
            <div className="trigram-box__bar" style={{ flex: 1 }} />
          ) : (
            <>
              <div className="trigram-box__bar" style={{ flex: 1, maxWidth: '44%' }} />
              <div className="trigram-box__bar" style={{ flex: 1, maxWidth: '44%' }} />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function TrigramBox({ label, trigramName }: { label: '上卦 (Thượng)' | '下卦 (Hạ)'; trigramName: string }) {
  const trigram = TRIGRAMS[trigramName]
  if (!trigram) return null

  return (
    <div className="trigram-box">
      <div className="trigram-box__label">{label}</div>
      <TrigramDiagram binary={trigram.binary} />
      <div className="trigram-box__name">{trigram.name}</div>
      <div className="trigram-box__zh">{trigram.chinese}</div>
      <div className="trigram-box__attrs">
        <div className="trigram-box__attr">
          <span className="trigram-box__attr-key">Ngũ hành</span>
          <span className="trigram-box__attr-val">{trigram.element}</span>
        </div>
        <div className="trigram-box__attr">
          <span className="trigram-box__attr-key">Tượng</span>
          <span className="trigram-box__attr-val">{trigram.nature}</span>
        </div>
        <div className="trigram-box__attr">
          <span className="trigram-box__attr-key">Hướng</span>
          <span className="trigram-box__attr-val">{trigram.direction}</span>
        </div>
        <div className="trigram-box__attr">
          <span className="trigram-box__attr-key">Tính chất</span>
          <span className="trigram-box__attr-val" style={{ fontSize: 10, textAlign: 'right', maxWidth: '60%' }}>{trigram.attribute}</span>
        </div>
      </div>
    </div>
  )
}

// All 8 trigrams reference
const TRIGRAM_ORDER = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn']

export function BatQuat({ castResult }: Props) {
  if (!castResult) return <EmptyState />

  const { primaryHex } = castResult

  return (
    <>
      {/* Upper and Lower trigram boxes */}
      <div className="panel-section">
        <div className="panel-section__title">Thượng Quái &amp; Hạ Quái</div>
        <div className="bat-quai__trigrams">
          <TrigramBox label="上卦 (Thượng)" trigramName={primaryHex.upperTrigram} />
          <TrigramBox label="下卦 (Hạ)" trigramName={primaryHex.lowerTrigram} />
        </div>
      </div>

      {/* Hexagram identity */}
      <div className="panel-section">
        <div className="panel-section__title">Thân Quái</div>
        <div className="tham-khao__card">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 36, fontFamily: 'var(--font-serif)', color: 'var(--accent-cinnabar)' }}>
              {primaryHex.character}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{primaryHex.fullName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Quẻ số {primaryHex.number} · {primaryHex.chinese}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Ngũ hành chủ: {primaryHex.element}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All 8 trigrams reference table */}
      <div className="panel-section">
        <div className="panel-section__title">Bát Quái Tham Chiếu</div>
        <table className="line-table">
          <thead>
            <tr>
              <th>Quái</th>
              <th>Tên</th>
              <th>Tượng</th>
              <th>Ngũ hành</th>
              <th>Hướng</th>
            </tr>
          </thead>
          <tbody>
            {TRIGRAM_ORDER.map(name => {
              const t = TRIGRAMS[name]
              const isActive = name === primaryHex.upperTrigram || name === primaryHex.lowerTrigram
              return (
                <tr key={name} style={isActive ? { background: 'rgba(192,57,43,0.06)' } : {}}>
                  <td style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>{t.chinese}</td>
                  <td style={{ fontWeight: isActive ? 600 : 400 }}>{t.name}</td>
                  <td>{t.nature}</td>
                  <td>{t.element}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.direction}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
