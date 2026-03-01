import type { Trigram, WuXing } from '../types'

/**
 * 8 trigrams (Bát Quái)
 * binary: 3-bit string, bit2=top line, bit1=mid, bit0=bottom line
 * 1=yang, 0=yin
 */
export const TRIGRAMS: Record<string, Trigram> = {
  Càn: {
    name: 'Càn', chinese: '乾', binary: '111',
    element: 'Kim', nature: 'Trời', direction: 'Tây Bắc', attribute: 'Sáng tạo, mạnh mẽ'
  },
  Đoài: {
    name: 'Đoài', chinese: '兌', binary: '110',
    element: 'Kim', nature: 'Hồ', direction: 'Tây', attribute: 'Vui vẻ, chia sẻ'
  },
  Ly: {
    name: 'Ly', chinese: '離', binary: '101',
    element: 'Hỏa', nature: 'Lửa', direction: 'Nam', attribute: 'Gắn kết, sáng rõ'
  },
  Chấn: {
    name: 'Chấn', chinese: '震', binary: '100',
    element: 'Mộc', nature: 'Sấm', direction: 'Đông', attribute: 'Khởi động, hành động'
  },
  Tốn: {
    name: 'Tốn', chinese: '巽', binary: '011',
    element: 'Mộc', nature: 'Gió', direction: 'Đông Nam', attribute: 'Thâm nhập, uyển chuyển'
  },
  Khảm: {
    name: 'Khảm', chinese: '坎', binary: '010',
    element: 'Thủy', nature: 'Nước', direction: 'Bắc', attribute: 'Hiểm nguy, kiên trì'
  },
  Cấn: {
    name: 'Cấn', chinese: '艮', binary: '001',
    element: 'Thổ', nature: 'Núi', direction: 'Đông Bắc', attribute: 'Giữ vững, dừng lại'
  },
  Khôn: {
    name: 'Khôn', chinese: '坤', binary: '000',
    element: 'Thổ', nature: 'Đất', direction: 'Tây Nam', attribute: 'Nuôi dưỡng, tiếp nhận'
  }
}

/** Lookup trigram by 3-bit binary string */
export const TRIGRAM_BY_BINARY: Record<string, Trigram> = Object.fromEntries(
  Object.values(TRIGRAMS).map(t => [t.binary, t])
)

/** Get trigram name from 3 yang(1)/yin(0) values (bottom, mid, top) */
export function getTrigramName(bottom: 0|1, mid: 0|1, top: 0|1): string {
  const bin = `${top}${mid}${bottom}`
  return TRIGRAM_BY_BINARY[bin]?.name ?? 'Càn'
}

// ─── Five Element cycles ───────────────────────────────────────────────────────

/** Generating cycle 相生: Wood → Fire → Earth → Metal → Water → Wood */
export const SHENG_CYCLE: Record<WuXing, WuXing> = {
  Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc'
}

/** Controlling cycle 相剋: Wood → Earth → Water → Fire → Metal → Wood */
export const KE_CYCLE: Record<WuXing, WuXing> = {
  Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc'
}

export const ELEMENT_COLORS: Record<WuXing, string> = {
  Mộc: '#2d6a4f',
  Hỏa: '#c0392b',
  Thổ: '#c4973b',
  Kim: '#8a88a0',
  Thủy: '#1a4d7a'
}

export const ELEMENT_LABELS: Record<WuXing, { vi: string; zh: string }> = {
  Mộc: { vi: 'Mộc', zh: '木' },
  Hỏa: { vi: 'Hỏa', zh: '火' },
  Thổ: { vi: 'Thổ', zh: '土' },
  Kim: { vi: 'Kim', zh: '金' },
  Thủy: { vi: 'Thủy', zh: '水' }
}
