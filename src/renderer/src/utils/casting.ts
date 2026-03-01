import type { CastResult, LineValue, LineDetail, LucThan, LucThu, WuXing } from '../types'
import { lineIsYang, isChanging, LUC_THU_ORDER } from '../types'
import { getHexagramByLines, getEarthBranch, BRANCH_ELEMENT, LINE_LABELS } from '../data/hexagrams'

// ─── Coin toss simulation ─────────────────────────────────────────────────────

/**
 * Simulate tossing 3 coins (heads=3, tails=2).
 * Returns one of 6 | 7 | 8 | 9.
 */
export function tossThreeCoins(): LineValue {
  let sum = 0
  for (let i = 0; i < 3; i++) {
    sum += Math.random() < 0.5 ? 3 : 2 // heads=3, tails=2
  }
  return sum as LineValue // 6, 7, 8, or 9
}

/**
 * Auto-cast: instantly generate all 6 lines.
 * Returns values from bottom (index 0) to top (index 5).
 */
export function autoCast(): LineValue[] {
  return Array.from({ length: 6 }, tossThreeCoins)
}

// ─── Hexagram derivation ──────────────────────────────────────────────────────

/**
 * Derive primary & changed hexagrams from 6 line values.
 * lineValues: index 0 = line 1 (bottom/sơ hào), 5 = line 6 (top/thượng hào)
 */
export function deriveHexagrams(lineValues: LineValue[]): CastResult | null {
  const primaryBits = lineValues.map(v => (lineIsYang(v) ? 1 : 0)) as (0 | 1)[]
  const primaryHex = getHexagramByLines(primaryBits)
  if (!primaryHex) return null

  const changingIndices = lineValues.reduce<number[]>((acc, v, i) => {
    if (isChanging(v)) acc.push(i)
    return acc
  }, [])

  let changedHex = null
  if (changingIndices.length > 0) {
    // Flip changing lines to get changed hexagram
    const changedBits = primaryBits.map((b, i) =>
      changingIndices.includes(i) ? ((b === 1 ? 0 : 1) as 0 | 1) : b
    )
    changedHex = getHexagramByLines(changedBits) ?? null
  }

  return {
    lines: lineValues,
    primaryHex,
    changedHex,
    changingLineIndices: changingIndices
  }
}

// ─── Lục Thân computation (simplified) ───────────────────────────────────────

const SHENG: Record<string, string> = {
  Mộc: 'Hỏa',
  Hỏa: 'Thổ',
  Thổ: 'Kim',
  Kim: 'Thủy',
  Thủy: 'Mộc'
}
const KE: Record<string, string> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' }

// ─── Build line details for right panel ───────────────────────────────────────

/**
 * Build the full LineDetail array from a CastResult.
 * Index 0 = bottom line (Sơ Hào), index 5 = top line (Thượng Hào).
 */
export function buildLineDetails(result: CastResult): LineDetail[] {
  const { lines, primaryHex, changingLineIndices } = result

  return lines.map((value, i): LineDetail => {
    const earthBranch = getEarthBranch(primaryHex, i)
    const element = BRANCH_ELEMENT[earthBranch] ?? 'Thổ'
    const lucThu = LUC_THU_ORDER[i % 6] as LucThu

    // Simplified 六親: based on branch element vs hexagram element
    const lucThan = computeLucThan(element, primaryHex.element)

    return {
      index: i,
      label: LINE_LABELS[i],
      value,
      isYang: lineIsYang(value),
      isChanging: changingLineIndices.includes(i),
      earthBranch,
      element,
      lucThan,
      lucThu
    }
  })
}

function computeLucThan(lineEl: WuXing, hexEl: WuXing): LucThan {
  if (lineEl === hexEl) return 'Huynh Đệ'
  if (SHENG[hexEl] === lineEl) return 'Tử Tôn'
  if (SHENG[lineEl] === hexEl) return 'Phụ Mẫu'
  if (KE[hexEl] === lineEl) return 'Quan Quỷ'
  if (KE[lineEl] === hexEl) return 'Thê Tài'
  return 'Bản Thân'
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

/** Generate a unique ID */
export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Format a timestamp to Vietnamese date string */
export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(ts))
}

/** Format a timestamp to relative time (e.g. "2 giờ trước") */
export function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  return `${days} ngày trước`
}

/** Get Vietnamese lunar date string (static display for now) */
export function getLunarDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  // Simplified: show current year in can-chi
  const canChi = getChinaYear(year)
  return `Năm ${canChi} · ${now.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}`
}

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

function getChinaYear(year: number): string {
  return `${CAN[(year - 4) % 10]} ${CHI[(year - 4) % 12]}`
}
