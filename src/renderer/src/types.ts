// ─── Five Elements ────────────────────────────────────────────────────────────

export type WuXing = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'

// ─── Trigrams ─────────────────────────────────────────────────────────────────

export interface Trigram {
  name: string        // e.g. "Càn"
  chinese: string     // e.g. "乾"
  binary: string      // e.g. "111" (MSB = top line)
  element: WuXing
  nature: string      // e.g. "Trời"
  direction: string
  attribute: string   // e.g. "Sáng tạo"
}

// ─── Hexagram (quẻ) ───────────────────────────────────────────────────────────

export interface Hexagram {
  number: number        // King Wen 1-64
  name: string          // Vietnamese e.g. "Càn"
  fullName: string      // e.g. "Thuần Càn"
  chinese: string       // e.g. "乾"
  character: string     // Chinese character(s) e.g. "乾"
  upperTrigram: string  // trigram name
  lowerTrigram: string  // trigram name
  element: WuXing       // dominant element
  judgment: string      // Thoán Từ (brief Vietnamese)
  image: string         // Đại Tượng (brief Vietnamese)
  binary: string        // 6-bit string (bit0=line1-bottom .. bit5=line6-top)
}

// ─── Line values & casting ────────────────────────────────────────────────────

/** 6=老阴(changing yin), 7=少阳(young yang), 8=少阴(young yin), 9=老阳(changing yang) */
export type LineValue = 6 | 7 | 8 | 9

export function isChanging(v: LineValue): boolean {
  return v === 6 || v === 9
}
export function lineIsYang(v: LineValue): boolean {
  return v === 7 || v === 9
}

export interface CastResult {
  /** Lines index 0=bottom (sơ hào), 5=top (thượng hào) */
  lines: LineValue[]
  primaryHex: Hexagram
  changedHex: Hexagram | null
  changingLineIndices: number[]  // 0-based indices of changing lines
}

// ─── Six Relations (Lục Thân) ─────────────────────────────────────────────────

export type LucThan = 'Quan Quỷ' | 'Phụ Mẫu' | 'Thê Tài' | 'Tử Tôn' | 'Huynh Đệ' | 'Bản Thân'

// ─── Six Animals (Lục Thú) ───────────────────────────────────────────────────

export type LucThu = 'Thanh Long' | 'Chu Tước' | 'Câu Trần' | 'Đằng Xà' | 'Bạch Hổ' | 'Huyền Vũ'

export const LUC_THU_ORDER: LucThu[] = [
  'Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'
]

// ─── Hexagram line detail (for right panel display) ──────────────────────────

export interface LineDetail {
  index: number        // 0-5 (0=bottom)
  label: string        // e.g. "Sơ Hào"
  value: LineValue
  isYang: boolean
  isChanging: boolean
  earthBranch: string  // Nạp Giáp 地支 e.g. "Tý"
  element: WuXing
  lucThan: LucThan
  lucThu: LucThu
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export type MessageType =
  | 'welcome'
  | 'text'
  | 'method_select'
  | 'casting_step'
  | 'hexagram_result'
  | 'ai_analysis'

export interface Message {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  type: MessageType
  content: string
  metadata?: Record<string, unknown>
  createdAt: number
}

// ─── Session ──────────────────────────────────────────────────────────────────

export type SessionState =
  | 'idle'          // no question asked yet
  | 'asked'         // question sent, waiting for method choice
  | 'casting'       // coin mode: step-by-step in progress
  | 'cast_done'     // hexagram revealed, waiting for AI analysis

export interface Session {
  id: string
  title: string
  question: string
  state: SessionState
  castResult: CastResult | null
  messages: Message[]
  tags: string[]
  createdAt: number
}
