import { useEffect, useRef } from 'react'
import { BookOpen, RefreshCw } from 'lucide-react'
import type { Session } from '../../types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

interface Props {
  session: Session | null
  onSendQuestion: (q: string) => void
  onChooseMethod: (method: 'auto' | 'coin') => void
  onNewSession: () => void
}

export function ChatArea({ session, onSendQuestion, onChooseMethod, onNewSession }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages.length])

  const isCasting = session?.state === 'casting'
  const isCastDone = session?.state === 'cast_done'
  const methodChosen = isCasting || isCastDone

  // Find the index of the last casting_step message without a lineValue (the active one)
  const castingMessages = session?.messages.filter(m => m.type === 'casting_step') ?? []
  const lastCastingMsgIndex = castingMessages.length - 1

  // Determine input placeholder and disabled state
  const inputDisabled = !session || isCasting || session.state === 'asked'
  const inputPlaceholder = isCastDone
    ? 'Nhập câu hỏi tiếp theo...'
    : !session
      ? 'Tạo một quẻ mới để bắt đầu'
      : session.state === 'idle'
        ? 'Hãy nhập câu hỏi của bạn...'
        : session.state === 'asked'
          ? 'Đang chờ bạn chọn phương pháp...'
          : 'Đang gieo quẻ...'

  // No session state
  if (!session) {
    return (
      <div className="chat-area" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">
          <BookOpen size={48} className="empty-state__icon" />
          <div className="empty-state__text">
            Nhấn <strong>"Gieo quẻ mới"</strong> để bắt đầu phiên bói quẻ mới.
          </div>
          <button className="sidebar__new-btn" style={{ width: 180 }} onClick={onNewSession}>
            Gieo quẻ mới
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <div>
          <div className="chat-header__title">
            {session.castResult?.primaryHex.fullName ?? session.title}
          </div>
          {session.castResult && (
            <div className="chat-header__sub">
              Quẻ số {session.castResult.primaryHex.number} ·{' '}
              {session.castResult.primaryHex.upperTrigram} trên{' '}
              {session.castResult.primaryHex.lowerTrigram} dưới
            </div>
          )}
        </div>
        <div className="chat-header__actions">
          <button className="icon-btn" onClick={onNewSession} title="Quẻ mới">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {session.messages.map(msg => {
          // Determine if this is the currently-active casting step
          const isCoinStep = msg.type === 'casting_step'
          const thisCastingIndex = isCoinStep ? castingMessages.findIndex(m => m.id === msg.id) : -1
          const isCurrentCoinStep =
            isCoinStep && thisCastingIndex === lastCastingMsgIndex && isCasting

          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onChooseMethod={onChooseMethod}
              isCastingActive={isCasting}
              isCurrentCoinStep={isCurrentCoinStep}
              methodChosen={methodChosen}
            />
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={onSendQuestion} disabled={inputDisabled} placeholder={inputPlaceholder} />
    </div>
  )
}
