import type { CastResult } from '../../types'
import { TRIGRAMS } from '../../data/trigrams'
import { LINE_LABELS } from '../../data/hexagrams'
import { lineIsYang } from '../../types'

interface Props {
  castResult: CastResult | null
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ fontSize: 36 }}>
        📖
      </div>
      <div className="empty-state__text">Gieo quẻ để xem Thoán Từ và Đại Tượng.</div>
    </div>
  )
}

export function ThamKhao({ castResult }: Props) {
  if (!castResult) return <EmptyState />

  const { primaryHex, changedHex, lines, changingLineIndices } = castResult

  const upperTrigram = TRIGRAMS[primaryHex.upperTrigram]
  const lowerTrigram = TRIGRAMS[primaryHex.lowerTrigram]

  return (
    <>
      {/* Thoán từ */}
      <div className="panel-section">
        <div className="panel-section__title">Thoán Từ (Lời Phán)</div>
        <div className="tham-khao__card">
          <div className="tham-khao__card-title">
            {primaryHex.fullName} · {primaryHex.character}
          </div>
          <div className="tham-khao__card-text">{primaryHex.judgment}</div>
        </div>
      </div>

      {/* Đại tượng */}
      <div className="panel-section">
        <div className="panel-section__title">Đại Tượng (Biểu Tượng)</div>
        <div className="tham-khao__card">
          <div className="tham-khao__card-text">{primaryHex.image}</div>
        </div>
      </div>

      {/* Trigram meanings */}
      <div className="panel-section">
        <div className="panel-section__title">Ý Nghĩa Quái</div>
        {[
          { label: 'Thượng quái', trigram: upperTrigram },
          { label: 'Hạ quái', trigram: lowerTrigram }
        ].map(({ label, trigram }) =>
          trigram ? (
            <div key={label} className="tham-khao__card" style={{ marginBottom: 8 }}>
              <div className="tham-khao__card-title">
                {label} — {trigram.name} ({trigram.chinese})
              </div>
              <div className="tham-khao__card-text">
                Tượng <strong>{trigram.nature}</strong> · Ngũ hành{' '}
                <strong>{trigram.element}</strong> · Hướng <strong>{trigram.direction}</strong>.
                <br />
                Tính chất: {trigram.attribute}.
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Changing lines */}
      {changingLineIndices.length > 0 && (
        <div className="panel-section">
          <div className="panel-section__title">Hào Động</div>
          {changingLineIndices.map(idx => {
            const value = lines[idx]
            const yang = lineIsYang(value)
            return (
              <div key={idx} className="tham-khao__card" style={{ marginBottom: 8 }}>
                <div className="tham-khao__card-title">
                  {LINE_LABELS[idx]} — {yang ? '老阳 ○ (Lão Dương)' : '老阴 × (Lão Âm)'}
                </div>
                <div className="tham-khao__card-text" style={{ color: 'var(--accent-cinnabar)' }}>
                  Hào {idx + 1} đang biến đổi.{' '}
                  {yang
                    ? 'Hào dương cực đến mức biến thành âm — cần thay đổi, chuyển hóa.'
                    : 'Hào âm cực đến mức biến thành dương — đang có sự khởi đầu mới.'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Changed hexagram reference */}
      {changedHex && (
        <div className="panel-section">
          <div className="panel-section__title">Quẻ Biến</div>
          <div className="tham-khao__card">
            <div className="tham-khao__card-title">
              {changedHex.fullName} ({changedHex.character}) — Quẻ số {changedHex.number}
            </div>
            <div className="tham-khao__card-text">
              <strong>Thoán từ:</strong> {changedHex.judgment}
            </div>
            <div className="tham-khao__card-text" style={{ marginTop: 8 }}>
              <strong>Đại tượng:</strong> {changedHex.image}
            </div>
          </div>
        </div>
      )}

      {/* Quick reference: How to read */}
      <div className="panel-section">
        <div className="panel-section__title">Hướng Dẫn Đọc Quẻ</div>
        <div className="tham-khao__card">
          <div className="tham-khao__card-text" style={{ fontSize: 12, lineHeight: 1.7 }}>
            <p>
              • <strong>Hào dương (—)</strong>: 少阳/老阳 — hào đặc (giá trị 7 hoặc 9)
            </p>
            <p>
              • <strong>Hào âm (- -)</strong>: 少阴/老阴 — hào đứt (giá trị 6 hoặc 8)
            </p>
            <p>
              • <strong>Hào động (○/×)</strong>: Lão dương (9) hoặc Lão âm (6) — hào biến đổi
            </p>
            <p>
              • <strong>Quẻ gốc</strong>: Từ hào hiện tại đọc tình trạng hiện tại
            </p>
            <p>
              • <strong>Quẻ biến</strong>: Sau khi hào động chuyển, cho thấy kết quả/tương lai
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
