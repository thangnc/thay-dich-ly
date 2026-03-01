import { Hexagon } from 'lucide-react'
import type { Message, CastResult, LineValue } from '../../types'
import { lineIsYang, isChanging } from '../../types'
import { formatRelative } from '../../utils/casting'

// ─── Sub-components ────────────────────────────────────────────────────────────

function AssistantAvatar() {
  return (
    <div className="msg__avatar">
      <Hexagon size={16} strokeWidth={1.5} />
    </div>
  )
}

/** Renders 6 lines of a hexagram (bottom→top displayed as top→bottom) */
function HexLines({ lines, changingIndices }: { lines: LineValue[]; changingIndices: number[] }) {
  const reversed = [...lines].map((v, i) => ({ v, i })).reverse() // display top first
  return (
    <div className="hex-card__lines">
      {reversed.map(({ v, i }) => {
        const yang = lineIsYang(v)
        const changing = changingIndices.includes(i)
        return (
          <div
            key={i}
            className={[
              'hex-card__line',
              yang ? '' : 'hex-card__line--yin',
              changing ? 'hex-card__line--changing' : ''
            ].join(' ')}
          >
            {yang ? (
              <>
                <div className="hex-card__line-bar" style={{ flex: 1 }} />
                <span className="hex-card__changing-mark">{changing ? '○' : ''}</span>
              </>
            ) : (
              <>
                <div className="hex-card__line-bar" style={{ maxWidth: '44%', flex: 1 }} />
                <span className="hex-card__changing-mark">{changing ? '×' : ''}</span>
                <div className="hex-card__line-bar" style={{ maxWidth: '44%', flex: 1 }} />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Message types ─────────────────────────────────────────────────────────────

function WelcomeBubble({ msg }: { msg: Message }) {
  return (
    <div className="msg">
      <AssistantAvatar />
      <div className="msg__body">
        <div className="msg__bubble" style={{ maxWidth: 480 }}>
          {msg.content}
        </div>
        <span className="msg__time">{formatRelative(msg.createdAt)}</span>
      </div>
    </div>
  )
}

function TextBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`msg${isUser ? ' msg--user' : ''}`}>
      {!isUser && <AssistantAvatar />}
      <div className="msg__body">
        <div className="msg__bubble" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
        <span className="msg__time">{formatRelative(msg.createdAt)}</span>
      </div>
    </div>
  )
}

interface MethodSelectProps {
  msg: Message
  onChoose: (method: 'auto' | 'coin') => void
  disabled: boolean
}

function MethodSelectBubble({ msg, onChoose, disabled }: MethodSelectProps) {
  return (
    <div className="msg">
      <AssistantAvatar />
      <div className="msg__body" style={{ maxWidth: '100%' }}>
        <div className="method-card">
          <div className="method-card__title">{msg.content}</div>
          <div className="method-card__options">
            <button
              className="method-card__option"
              onClick={() => onChoose('auto')}
              disabled={disabled}
            >
              <div className="method-card__option-name">⚡ Tự Động</div>
              <div className="method-card__option-desc">
                Hệ thống tự gieo ngẫu nhiên 6 hào — nhanh chóng, tức thì.
              </div>
            </button>
            <button
              className="method-card__option"
              onClick={() => onChoose('coin')}
              disabled={disabled}
            >
              <div className="method-card__option-name">🪙 Gieo Tiền</div>
              <div className="method-card__option-desc">
                Tự tay gieo từng hào một — tâm thành ý chí.
              </div>
            </button>
          </div>
        </div>
        <span className="msg__time">{formatRelative(msg.createdAt)}</span>
      </div>
    </div>
  )
}

interface CastingStepProps {
  msg: Message
  onToss: () => void
  isCurrent: boolean
}

function CastingStepBubble({ msg, onToss, isCurrent }: CastingStepProps) {
  const step = msg.metadata?.step as number ?? 0
  const lineValue = msg.metadata?.lineValue as LineValue | undefined
  const lineNames = ['Sơ Hào', 'Nhị Hào', 'Tam Hào', 'Tứ Hào', 'Ngũ Hào', 'Thượng Hào']
  const lineValueNames: Record<number, string> = {
    6: 'Lão Âm ×', 7: 'Thiếu Dương —', 8: 'Thiếu Âm - -', 9: 'Lão Dương ○'
  }

  return (
    <div className="msg">
      <AssistantAvatar />
      <div className="msg__body">
        <div className="coin-step">
          <div className="coin-step__label">
            Hào {step + 1} — {lineNames[step]}
          </div>
          {lineValue !== undefined ? (
            <div className="coin-step__result">
              Kết quả: <strong>{lineValueNames[lineValue]}</strong>
            </div>
          ) : isCurrent ? (
            <button className="coin-step__btn" onClick={onToss}>
              🪙 Tung tiền
            </button>
          ) : null}
        </div>
        <span className="msg__time">{formatRelative(msg.createdAt)}</span>
      </div>
    </div>
  )
}

function HexagramResultBubble({ msg }: { msg: Message }) {
  const result = msg.metadata?.castResult as CastResult | undefined
  if (!result) return <TextBubble msg={msg} />

  const { primaryHex, changedHex, lines, changingLineIndices } = result

  return (
    <div className="msg">
      <AssistantAvatar />
      <div className="msg__body" style={{ maxWidth: '100%' }}>
        <div className="hex-card">
          <div className="hex-card__header">
            <HexLines lines={lines} changingIndices={changingLineIndices} />
            <div className="hex-card__info">
              <div className="hex-card__number">Quẻ số {primaryHex.number}</div>
              <div className="hex-card__name">{primaryHex.fullName}</div>
              <div className="hex-card__char">{primaryHex.character}</div>
            </div>
          </div>
          <div className="hex-card__judgment">{primaryHex.judgment}</div>
          {changedHex && (
            <div className="hex-card__changed">
              Quẻ biến → <strong>{changedHex.fullName}</strong> ({changedHex.character})
            </div>
          )}
        </div>
        <span className="msg__time">{formatRelative(msg.createdAt)}</span>
      </div>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

interface Props {
  msg: Message
  onChooseMethod: (method: 'auto' | 'coin') => void
  onTossCoin: () => void
  isCastingActive: boolean
  isCurrentCoinStep: boolean
}

export function MessageBubble({ msg, onChooseMethod, onTossCoin, isCastingActive, isCurrentCoinStep }: Props) {
  switch (msg.type) {
    case 'welcome':
      return <WelcomeBubble msg={msg} />
    case 'method_select':
      return (
        <MethodSelectBubble
          msg={msg}
          onChoose={onChooseMethod}
          disabled={isCastingActive}
        />
      )
    case 'casting_step':
      return (
        <CastingStepBubble
          msg={msg}
          onToss={onTossCoin}
          isCurrent={isCurrentCoinStep}
        />
      )
    case 'hexagram_result':
      return <HexagramResultBubble msg={msg} />
    default:
      return <TextBubble msg={msg} />
  }
}
