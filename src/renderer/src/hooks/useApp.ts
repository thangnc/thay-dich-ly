import { useState, useEffect, useCallback } from 'react'
import type { Session, Message, MessageType, SessionState, LineValue } from '../types'
import { autoCast, deriveHexagrams, tossThreeCoins, uid } from '../utils/casting'

// ─── Window API type ──────────────────────────────────────────────────────────

declare global {
  interface Window {
    api: {
      createSession: (id: string, title: string, question: string) => Promise<unknown>
      updateSession: (id: string, patch: object) => Promise<void>
      listSessions: () => Promise<unknown[]>
      getSession: (id: string) => Promise<unknown>
      deleteSession: (id: string) => Promise<void>
      addMessage: (row: object) => Promise<unknown>
      listMessages: (sessionId: string) => Promise<unknown[]>
      updateMessage: (id: string, content: string) => Promise<void>
      getSetting: (key: string) => Promise<string | null>
      setSetting: (key: string, value: string) => Promise<void>
    }
  }
}

// ─── Helper: build a message ──────────────────────────────────────────────────

function makeMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  type: MessageType,
  content: string,
  metadata?: Record<string, unknown>
): Message {
  return { id: uid(), sessionId, role, type, content, metadata, createdAt: Date.now() }
}

// ─── Helper: serialize session to DB patch ────────────────────────────────────

function sessionToPatch(s: Session): object {
  return {
    title: s.title,
    question: s.question,
    hex_lines: s.castResult ? JSON.stringify(s.castResult.lines) : null,
    hex_number: s.castResult?.primaryHex.number ?? null,
    hex_changed: s.castResult?.changedHex?.number ?? null,
    tags: JSON.stringify(s.tags)
  }
}

// ─── useApp hook ──────────────────────────────────────────────────────────────

export interface AppState {
  sessions: Session[]
  activeSession: Session | null
  coinStepIndex: number // current coin step (0-5 during coin casting)
  pendingCoinLines: import('../types').LineValue[] // accumulated coin line results
}

export interface AppActions {
  createNewSession: () => void
  setActiveSession: (id: string) => void
  deleteSession: (id: string) => void
  sendQuestion: (question: string) => void
  chooseMethod: (method: 'auto' | 'coin') => void
  tossCoinStep: (lineValue: LineValue) => void
  cancelCoinToss: () => void
  autoCompleteCoinToss: () => void
}

export function useApp(): AppState & AppActions {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [coinStepIndex, setCoinStepIndex] = useState(0)
  const [pendingCoinLines, setPendingCoinLines] = useState<import('../types').LineValue[]>([])

  const activeSession = sessions.find(s => s.id === activeId) ?? null

  async function loadSessionMessages(sessionId: string): Promise<void> {
    try {
      const rows = (await window.api.listMessages(sessionId)) as Array<Record<string, unknown>>
      const messages: Message[] = rows.map(r => ({
        id: r.id as string,
        sessionId: r.session_id as string,
        role: r.role as 'user' | 'assistant',
        type: (r.msg_type as MessageType) || 'text',
        content: r.content as string,
        metadata: r.metadata ? JSON.parse(r.metadata as string) : undefined,
        createdAt: r.created_at as number
      }))
      setSessions(prev => prev.map(s => (s.id === sessionId ? { ...s, messages } : s)))
    } catch (err) {
      console.error('loadSessionMessages:', err)
    }
  }

  // ── Load sessions on mount ───────────────────────────────────────────────

  useEffect(() => {
    window.api
      .listSessions()
      .then(async rows => {
        const rawRows = rows as Array<Record<string, unknown>>
        const loaded: Session[] = rawRows.map(r => ({
          id: r.id as string,
          title: r.title as string,
          question: (r.question as string) || '',
          state: (r.hex_number ? 'cast_done' : 'idle') as SessionState,
          castResult: null,
          messages: [],
          tags: r.tags ? JSON.parse(r.tags as string) : [],
          createdAt: r.created_at as number
        }))
        setSessions(loaded)
        if (loaded.length > 0) {
          await loadSessionMessages(loaded[0].id)
          setActiveId(loaded[0].id)
        }
      })
      .catch(err => console.error('loadSessions:', err))
  }, [])

  // ── Mutate helpers ───────────────────────────────────────────────────────

  function updateSession(id: string, updater: (s: Session) => Session): void {
    setSessions(prev => prev.map(s => (s.id === id ? updater(s) : s)))
  }

  async function persistMessage(msg: Message): Promise<void> {
    await window.api.addMessage({
      id: msg.id,
      session_id: msg.sessionId,
      role: msg.role,
      content: msg.content,
      msg_type: msg.type,
      metadata: msg.metadata ? JSON.stringify(msg.metadata) : null
    })
  }

  function addMessageToSession(sessionId: string, msg: Message): void {
    updateSession(sessionId, s => ({ ...s, messages: [...s.messages, msg] }))
    persistMessage(msg).catch(console.error)
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  const createNewSession = useCallback(async () => {
    const id = uid()
    const newSession: Session = {
      id,
      title: 'Quẻ mới',
      question: '',
      state: 'idle',
      castResult: null,
      messages: [],
      tags: [],
      createdAt: Date.now()
    }
    setSessions(prev => [newSession, ...prev])
    setActiveId(id)
    setCoinStepIndex(0)
    setPendingCoinLines([])

    await window.api.createSession(id, 'Quẻ mới', '')

    // Add welcome message
    const welcome = makeMessage(
      id,
      'assistant',
      'welcome',
      'Chào mừng bạn đến với Lục Hào Bát Quái. Hãy đặt câu hỏi của bạn vào ô phía dưới — tâm thành ý chí, quẻ sẽ hiển linh.'
    )
    addMessageToSession(id, welcome)
  }, [])

  const setActiveSession = useCallback(
    async (id: string) => {
      setActiveId(id)
      setCoinStepIndex(0)
      setPendingCoinLines([])
      const session = sessions.find(s => s.id === id)
      if (session && session.messages.length === 0) {
        await loadSessionMessages(id)
      }
    },
    [sessions]
  )

  const deleteSession = useCallback(
    async (id: string) => {
      await window.api.deleteSession(id)
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== id)
        if (activeId === id && filtered.length > 0) setActiveId(filtered[0].id)
        else if (filtered.length === 0) setActiveId(null)
        return filtered
      })
    },
    [activeId]
  )

  const sendQuestion = useCallback(
    async (question: string) => {
      if (!activeId || !question.trim()) return
      const trimmed = question.trim()

      // Add user message
      const userMsg = makeMessage(activeId, 'user', 'text', trimmed)
      addMessageToSession(activeId, userMsg)

      // Update session title and question
      updateSession(activeId, s => ({
        ...s,
        title: trimmed.slice(0, 40),
        question: trimmed,
        state: 'asked'
      }))
      await window.api.updateSession(activeId, { title: trimmed.slice(0, 40), question: trimmed })

      // Show method selection
      const methodMsg = makeMessage(
        activeId,
        'assistant',
        'method_select',
        'Hãy chọn phương pháp gieo quẻ:',
        { question: trimmed }
      )
      addMessageToSession(activeId, methodMsg)
    },
    [activeId]
  )

  const chooseMethod = useCallback(
    async (method: 'auto' | 'coin') => {
      if (!activeId) return
      const session = sessions.find(s => s.id === activeId)
      if (!session) return

      if (method === 'auto') {
        // Auto-cast: instantly generate all 6 lines
        const lineValues = autoCast()
        const result = deriveHexagrams(lineValues)
        if (!result) return

        const resultMsg = makeMessage(
          activeId,
          'assistant',
          'hexagram_result',
          `Quẻ: ${result.primaryHex.fullName}`,
          { castResult: result }
        )
        addMessageToSession(activeId, resultMsg)

        updateSession(activeId, s => ({ ...s, state: 'cast_done', castResult: result }))
        await window.api.updateSession(
          activeId,
          sessionToPatch({ ...session, castResult: result, state: 'cast_done' })
        )
      } else {
        // Coin step-by-step mode
        setCoinStepIndex(0)
        setPendingCoinLines([])
        updateSession(activeId, s => ({ ...s, state: 'casting' }))
        const stepMsg = makeMessage(
          activeId,
          'assistant',
          'casting_step',
          'Hào 1 (Sơ Hào) — Nhấn "Tung tiền" để gieo.',
          { step: 0 }
        )
        addMessageToSession(activeId, stepMsg)
      }
    },
    [activeId, sessions]
  )

  const tossCoinStep = useCallback(
    async (lineValue: LineValue) => {
      if (!activeId) return
      const stepIdx = coinStepIndex
      const newLines = [...pendingCoinLines, lineValue] as LineValue[]

      // Record this step as a chat message
      const lineLabels = ['Sơ Hào', 'Nhị Hào', 'Tam Hào', 'Tứ Hào', 'Ngũ Hào', 'Thượng Hào']
      const stepMsg = makeMessage(activeId, 'assistant', 'casting_step', `Hào ${stepIdx + 1} — ${lineLabels[stepIdx]}`, {
        step: stepIdx,
        lineValue
      })
      addMessageToSession(activeId, stepMsg)

      setPendingCoinLines(newLines)
      const nextStep = stepIdx + 1
      setCoinStepIndex(nextStep)

      if (nextStep >= 6) {
        // All 6 lines done — compute hexagram
        const session = sessions.find(s => s.id === activeId)
        if (!session) return
        const result = deriveHexagrams(newLines)
        if (!result) return

        const resultMsg = makeMessage(activeId, 'assistant', 'hexagram_result', `Quẻ: ${result.primaryHex.fullName}`, {
          castResult: result
        })
        addMessageToSession(activeId, resultMsg)

        updateSession(activeId, s => ({ ...s, state: 'cast_done', castResult: result }))
        await window.api.updateSession(activeId, sessionToPatch({ ...session, castResult: result, state: 'cast_done' }))
        setCoinStepIndex(0)
        setPendingCoinLines([])
      }
    },
    [activeId, coinStepIndex, pendingCoinLines, sessions]
  )

  const cancelCoinToss = useCallback(() => {
    if (!activeId) return
    setCoinStepIndex(0)
    setPendingCoinLines([])
    updateSession(activeId, s => ({
      ...s,
      state: 'asked',
      messages: s.messages.filter(m => m.type !== 'casting_step')
    }))
  }, [activeId])

  const autoCompleteCoinToss = useCallback(async () => {
    if (!activeId) return
    const session = sessions.find(s => s.id === activeId)
    if (!session) return

    const allLines = [...pendingCoinLines] as LineValue[]
    while (allLines.length < 6) allLines.push(tossThreeCoins())

    const result = deriveHexagrams(allLines)
    if (!result) return

    const resultMsg = makeMessage(activeId, 'assistant', 'hexagram_result', `Quẻ: ${result.primaryHex.fullName}`, {
      castResult: result
    })
    addMessageToSession(activeId, resultMsg)

    updateSession(activeId, s => ({ ...s, state: 'cast_done', castResult: result }))
    await window.api.updateSession(activeId, sessionToPatch({ ...session, castResult: result, state: 'cast_done' }))
    setCoinStepIndex(0)
    setPendingCoinLines([])
  }, [activeId, pendingCoinLines, sessions])

  return {
    sessions,
    activeSession,
    coinStepIndex,
    pendingCoinLines,
    createNewSession,
    setActiveSession,
    deleteSession,
    sendQuestion,
    chooseMethod,
    tossCoinStep,
    cancelCoinToss,
    autoCompleteCoinToss
  }
}
