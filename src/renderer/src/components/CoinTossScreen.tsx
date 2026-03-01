import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCw } from 'lucide-react'
import type { LineValue } from '../types'
import { lineIsYang, isChanging } from '../types'
import { tossThreeCoins } from '../utils/casting'

// ─── Constants ──────────────────────────────────────────────────────────────

const LINE_NAMES = ['Sơ Hào', 'Nhị Hào', 'Tam Hào', 'Tứ Hào', 'Ngũ Hào', 'Thượng Hào']

const LINE_VALUE_NAMES: Record<number, string> = {
  6: 'Lão Âm',
  7: 'Thiếu Dương',
  8: 'Thiếu Âm',
  9: 'Lão Dương'
}

/**
 * Given a LineValue, generate 3 coin faces (true=heads/正, false=tails/反)
 * that sum to the value. heads=3, tails=2 → sum range 6-9.
 */
function generateCoinFaces(lineValue: LineValue): boolean[] {
  const headsCount = lineValue - 6 // 6→0, 7→1, 8→2, 9→3
  const faces = [false, false, false]
  // Pick `headsCount` random positions to be heads
  const positions = [0, 1, 2]
  for (let i = 0; i < headsCount; i++) {
    const j = i + Math.floor(Math.random() * (3 - i))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
    faces[positions[i]] = true
  }
  return faces
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  question: string
  stepIndex: number // 0-5 (current step being cast)
  completedLines: LineValue[] // results of steps 0..stepIndex-1
  onToss: (lineValue: LineValue) => void
  onCancel: () => void
  onAutoComplete: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CoinTossScreen({ question, stepIndex, completedLines, onToss, onCancel, onAutoComplete }: Props) {
  const [coinFaces, setCoinFaces] = useState<boolean[] | null>(null)
  const [lineValue, setLineValue] = useState<LineValue | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Reset local state when the step changes (next line starts fresh)
  useEffect(() => {
    setCoinFaces(null)
    setLineValue(null)
    setIsAnimating(false)
  }, [stepIndex])

  const handleToss = useCallback(() => {
    if (isAnimating || lineValue !== null) return
    setIsAnimating(true)
    setTimeout(() => {
      const lv = tossThreeCoins()
      setCoinFaces(generateCoinFaces(lv))
      setLineValue(lv)
      setIsAnimating(false)
    }, 700)
  }, [isAnimating, lineValue])

  const handleNext = useCallback(() => {
    if (lineValue === null) return
    onToss(lineValue)
  }, [lineValue, onToss])

  // Space key shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      if (lineValue !== null) handleNext()
      else handleToss()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleToss, handleNext, lineValue])

  const isLastStep = stepIndex === 5

  return (
    <div className="coin-screen">
      {/* ── Header ── */}
      <div className="coin-screen__header">
        <button className="coin-screen__back" onClick={onCancel} title="Quay lại">
          <ArrowLeft size={18} />
        </button>
        <div className="coin-screen__title">
          Gieo Xu — Lần {stepIndex + 1}/6
        </div>
        <button className="coin-screen__skip" onClick={onAutoComplete}>
          Bỏ qua
        </button>
      </div>

      {/* ── Progress dots ── */}
      <div className="coin-screen__progress">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={[
              'coin-dot',
              i < stepIndex ? 'coin-dot--done' : '',
              i === stepIndex ? 'coin-dot--active' : ''
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>

      {/* ── Question ── */}
      <div className="coin-screen__question">
        <em>"{question}"</em>
      </div>

      {/* ── Coins ── */}
      <div className="coin-screen__coins">
        {[0, 1, 2].map(ci => {
          const isHeads = coinFaces ? coinFaces[ci] : null
          return (
            <div
              key={ci}
              className={[
                'coin',
                isAnimating ? 'coin--spinning' : '',
                coinFaces === null ? 'coin--neutral' : isHeads ? 'coin--heads' : 'coin--tails'
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="coin__inner">
                <div className="coin__front">正</div>
                <div className="coin__back">反</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Result ── */}
      <div className={`coin-screen__result${lineValue !== null ? ' coin-screen__result--visible' : ''}`}>
        {lineValue !== null && (
          <>
            <div className="coin-screen__result-line">
              {lineIsYang(lineValue) ? (
                <div className="result-line result-line--yang" />
              ) : (
                <div className="result-line result-line--yin">
                  <div className="result-line__half" />
                  <div className="result-line__half" />
                </div>
              )}
              {isChanging(lineValue) && (
                <span className="result-line__mark">{lineValue === 9 ? '○' : '×'}</span>
              )}
            </div>
            <div className="coin-screen__result-name">
              {LINE_VALUE_NAMES[lineValue]}{' '}
              <span className="coin-screen__result-val">({lineValue})</span>
            </div>
            <div className="coin-screen__result-pattern">
              {coinFaces?.map((h, i) => (
                <span key={i} className={`coin-pip ${h ? 'coin-pip--heads' : 'coin-pip--tails'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Action button ── */}
      <div className="coin-screen__action">
        {lineValue === null ? (
          <button className="coin-screen__toss-btn" onClick={handleToss} disabled={isAnimating}>
            <RotateCw size={15} className={isAnimating ? 'spin' : ''} />
            {isAnimating ? 'Đang gieo...' : 'Gieo Xu'}
          </button>
        ) : (
          <button className="coin-screen__next-btn" onClick={handleNext}>
            {isLastStep ? 'Hoàn thành ✓' : 'Tiếp theo →'}
          </button>
        )}
        <p className="coin-screen__hint">
          Nhấn <kbd>Space</kbd> để {lineValue !== null ? 'tiếp tục' : 'gieo xu'}
        </p>
      </div>

      {/* ── Line tracker ── */}
      <div className="coin-screen__tracker">
        {Array.from({ length: 6 }, (_, i) => {
          const done = completedLines[i]
          const active = i === stepIndex
          return (
            <div
              key={i}
              className={[
                'tracker-card',
                done !== undefined ? 'tracker-card--done' : '',
                active ? 'tracker-card--active' : ''
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="tracker-card__label">Hào {i + 1}</div>
              <div className="tracker-card__sub">
                {done !== undefined
                  ? LINE_VALUE_NAMES[done]
                  : active
                    ? 'Đang gieo'
                    : 'Chờ gieo'}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Footer ── */}
      <div className="coin-screen__footer">
        <button className="coin-screen__cancel" onClick={onCancel}>
          Hủy bỏ
        </button>
        <button className="coin-screen__auto" onClick={onAutoComplete}>
          Gieo tự động
        </button>
      </div>
    </div>
  )
}
