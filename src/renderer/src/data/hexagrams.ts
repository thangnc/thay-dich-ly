import type { Hexagram, WuXing } from '../types'
import { TRIGRAMS } from './trigrams'

// ─── Binary → King Wen lookup ─────────────────────────────────────────────────
// Index = 6-bit binary (bit0=line1-bottom … bit5=line6-top), value = King Wen #
// Trigram binary: Càn=111(7), Đoài=110(6), Ly=101(5), Chấn=100(4),
//                 Tốn=011(3), Khảm=010(2), Cấn=001(1), Khôn=000(0)

const BINARY_TO_KW: number[] = [
  2,
  15,
  7,
  46,
  24,
  36,
  19,
  11, // 0x00-0x07
  23,
  52,
  4,
  18,
  27,
  22,
  41,
  26, // 0x08-0x0F
  8,
  39,
  29,
  48,
  3,
  63,
  60,
  5, // 0x10-0x17
  20,
  53,
  59,
  57,
  42,
  37,
  61,
  9, // 0x18-0x1F
  16,
  62,
  40,
  32,
  51,
  55,
  54,
  34, // 0x20-0x27
  35,
  56,
  64,
  50,
  21,
  30,
  38,
  14, // 0x28-0x2F
  45,
  31,
  47,
  28,
  17,
  49,
  58,
  43, // 0x30-0x37
  12,
  33,
  6,
  44,
  25,
  13,
  10,
  1 // 0x38-0x3F
]

// ─── Raw hexagram data ────────────────────────────────────────────────────────

interface HexRaw {
  n: number // King Wen number
  name: string // Vietnamese short name
  full: string // Vietnamese full name
  zh: string // Chinese name
  char: string // Chinese character
  up: string // upper trigram name
  lo: string // lower trigram name
  el: WuXing // dominant element
  jdg: string // Judgment (Thoán Từ) brief
  img: string // Image (Đại Tượng) brief
}

const RAW: HexRaw[] = [
  {
    n: 1,
    name: 'Càn',
    full: 'Thuần Càn',
    zh: '乾',
    char: '乾',
    up: 'Càn',
    lo: 'Càn',
    el: 'Kim',
    jdg: 'Nguyên hanh lợi trinh — Đại cát, sức mạnh thuần dương.',
    img: 'Trời vận hành mạnh mẽ, quân tử tự cường không ngừng.'
  },
  {
    n: 2,
    name: 'Khôn',
    full: 'Thuần Khôn',
    zh: '坤',
    char: '坤',
    up: 'Khôn',
    lo: 'Khôn',
    el: 'Thổ',
    jdg: 'Thuận theo trời đất, nhu thuận thì hanh thông.',
    img: 'Đất rộng lớn chở muôn vật, quân tử lấy đức dày nâng đỡ muôn loài.'
  },
  {
    n: 3,
    name: 'Truân',
    full: 'Thủy Lôi Truân',
    zh: '屯',
    char: '屯',
    up: 'Khảm',
    lo: 'Chấn',
    el: 'Thủy',
    jdg: 'Khó khăn ban đầu, lợi ở kiên trì.',
    img: 'Mây và sấm tụ hợp, quân tử lập kế hoạch chu đáo.'
  },
  {
    n: 4,
    name: 'Mông',
    full: 'Sơn Thủy Mông',
    zh: '蒙',
    char: '蒙',
    up: 'Cấn',
    lo: 'Khảm',
    el: 'Thổ',
    jdg: 'Khai sáng sự mê muội, lợi ở kiên định.',
    img: 'Suối chảy từ chân núi, quân tử kiên định hành động.'
  },
  {
    n: 5,
    name: 'Nhu',
    full: 'Thủy Thiên Nhu',
    zh: '需',
    char: '需',
    up: 'Khảm',
    lo: 'Càn',
    el: 'Thủy',
    jdg: 'Chờ đợi thời cơ, tín thành thì hanh thông.',
    img: 'Mây tụ trên trời, quân tử ăn uống an nhàn chờ thời.'
  },
  {
    n: 6,
    name: 'Tụng',
    full: 'Thiên Thủy Tụng',
    zh: '訟',
    char: '訟',
    up: 'Càn',
    lo: 'Khảm',
    el: 'Kim',
    jdg: 'Tranh tụng — kiên tín nguy hại, hòa giải tốt hơn.',
    img: 'Trời và nước ngược chiều, quân tử khởi sự thận trọng.'
  },
  {
    n: 7,
    name: 'Sư',
    full: 'Địa Thủy Sư',
    zh: '師',
    char: '師',
    up: 'Khôn',
    lo: 'Khảm',
    el: 'Thổ',
    jdg: 'Dụng binh phải chính đạo, trưởng lão cầm quyền tốt.',
    img: 'Đất chứa nước, quân tử bao dung dân chúng.'
  },
  {
    n: 8,
    name: 'Tỷ',
    full: 'Thủy Địa Tỷ',
    zh: '比',
    char: '比',
    up: 'Khảm',
    lo: 'Khôn',
    el: 'Thủy',
    jdg: 'Đoàn kết thân ái, tốt lành cho người chân thành.',
    img: 'Nước tràn trên đất, quân tử vun đắp quan hệ.'
  },
  {
    n: 9,
    name: 'Tiểu Súc',
    full: 'Phong Thiên Tiểu Súc',
    zh: '小畜',
    char: '小畜',
    up: 'Tốn',
    lo: 'Càn',
    el: 'Mộc',
    jdg: 'Tích lũy nhỏ hanh thông, mây chưa mưa chờ thời.',
    img: 'Gió cuốn trên trời, quân tử trau dồi đức độ.'
  },
  {
    n: 10,
    name: 'Lý',
    full: 'Thiên Trạch Lý',
    zh: '履',
    char: '履',
    up: 'Càn',
    lo: 'Đoài',
    el: 'Kim',
    jdg: 'Giẫm đuôi hổ mà không bị cắn — hanh thông.',
    img: 'Trời trên hồ dưới, quân tử phân biệt cao thấp giữ chí.'
  },
  {
    n: 11,
    name: 'Thái',
    full: 'Địa Thiên Thái',
    zh: '泰',
    char: '泰',
    up: 'Khôn',
    lo: 'Càn',
    el: 'Thổ',
    jdg: 'Bình an hanh thông, tiểu vãng đại lai.',
    img: 'Trời đất thông nhau, quân tử thành toàn đạo trời đất.'
  },
  {
    n: 12,
    name: 'Bĩ',
    full: 'Thiên Địa Bĩ',
    zh: '否',
    char: '否',
    up: 'Càn',
    lo: 'Khôn',
    el: 'Kim',
    jdg: 'Bế tắc — kẻ tiểu nhân thịnh, người quân tử kiên nhẫn.',
    img: 'Trời đất không thông, quân tử ẩn đức tránh nạn.'
  },
  {
    n: 13,
    name: 'Đồng Nhân',
    full: 'Thiên Hỏa Đồng Nhân',
    zh: '同人',
    char: '同人',
    up: 'Càn',
    lo: 'Ly',
    el: 'Kim',
    jdg: 'Đoàn kết người, hanh thông vượt đồng rộng.',
    img: 'Trời trên lửa dưới, quân tử phân loại sự vật.'
  },
  {
    n: 14,
    name: 'Đại Hữu',
    full: 'Hỏa Thiên Đại Hữu',
    zh: '大有',
    char: '大有',
    up: 'Ly',
    lo: 'Càn',
    el: 'Hỏa',
    jdg: 'Sở hữu lớn — cực kỳ hanh thông.',
    img: 'Lửa trên trời, quân tử ngăn điều ác chuộng điều thiện.'
  },
  {
    n: 15,
    name: 'Khiêm',
    full: 'Địa Sơn Khiêm',
    zh: '謙',
    char: '謙',
    up: 'Khôn',
    lo: 'Cấn',
    el: 'Thổ',
    jdg: 'Khiêm tốn hanh thông, quân tử có kết quả tốt.',
    img: 'Đất trên núi, quân tử dồi dào bù đắp kẻ thiếu.'
  },
  {
    n: 16,
    name: 'Dự',
    full: 'Lôi Địa Dự',
    zh: '豫',
    char: '豫',
    up: 'Chấn',
    lo: 'Khôn',
    el: 'Mộc',
    jdg: 'Vui vẻ hăng hái — lợi dựng chư hầu hành quân.',
    img: 'Sấm ra từ đất, tiên vương tấu nhạc thờ thần.'
  },
  {
    n: 17,
    name: 'Tùy',
    full: 'Trạch Lôi Tùy',
    zh: '隨',
    char: '隨',
    up: 'Đoài',
    lo: 'Chấn',
    el: 'Kim',
    jdg: 'Đi theo — đại hanh lợi trinh, không lỗi.',
    img: 'Sấm trong hồ, quân tử chiều tối vào nghỉ ngơi.'
  },
  {
    n: 18,
    name: 'Cổ',
    full: 'Sơn Phong Cổ',
    zh: '蠱',
    char: '蠱',
    up: 'Cấn',
    lo: 'Tốn',
    el: 'Thổ',
    jdg: 'Sửa chữa cái đổ nát — hanh thông, cần tiến lên.',
    img: 'Núi trên gió dưới, quân tử khuyến khích dân chúng.'
  },
  {
    n: 19,
    name: 'Lâm',
    full: 'Địa Trạch Lâm',
    zh: '臨',
    char: '臨',
    up: 'Khôn',
    lo: 'Đoài',
    el: 'Thổ',
    jdg: 'Lâm trị — đại hanh lợi trinh, tháng 8 có hung.',
    img: 'Đất trên hồ, quân tử giáo hóa dân không mệt mỏi.'
  },
  {
    n: 20,
    name: 'Quan',
    full: 'Phong Địa Quan',
    zh: '觀',
    char: '觀',
    up: 'Tốn',
    lo: 'Khôn',
    el: 'Mộc',
    jdg: 'Quan sát — tẩy tay nhưng chưa tế, tin tưởng.',
    img: 'Gió trên đất, tiên vương tuần thị tứ phương giáo hóa.'
  },
  {
    n: 21,
    name: 'Phệ Hạp',
    full: 'Hỏa Lôi Phệ Hạp',
    zh: '噬嗑',
    char: '噬嗑',
    up: 'Ly',
    lo: 'Chấn',
    el: 'Hỏa',
    jdg: 'Cắn xuyên qua — hanh thông, lợi dùng hình pháp.',
    img: 'Sấm lửa — tiên vương cẩn thận hình phạt, rõ ràng luật pháp.'
  },
  {
    n: 22,
    name: 'Bí',
    full: 'Sơn Hỏa Bí',
    zh: '賁',
    char: '賁',
    up: 'Cấn',
    lo: 'Ly',
    el: 'Thổ',
    jdg: 'Trang sức hanh thông — nhỏ lợi có chỗ đi.',
    img: 'Núi trên lửa, quân tử làm sáng chính trị không xử lớn.'
  },
  {
    n: 23,
    name: 'Bác',
    full: 'Sơn Địa Bác',
    zh: '剥',
    char: '剥',
    up: 'Cấn',
    lo: 'Khôn',
    el: 'Thổ',
    jdg: 'Bóc lột — bất lợi có chỗ đi.',
    img: 'Núi tựa đất, người trên ổn định nhà cửa bằng cách cho dân.'
  },
  {
    n: 24,
    name: 'Phục',
    full: 'Địa Lôi Phục',
    zh: '復',
    char: '復',
    up: 'Khôn',
    lo: 'Chấn',
    el: 'Thổ',
    jdg: 'Trở về — hanh thông, ra vào không bệnh.',
    img: 'Sấm trong đất, tiên vương ngày đông chí đóng cửa ải.'
  },
  {
    n: 25,
    name: 'Vô Vọng',
    full: 'Thiên Lôi Vô Vọng',
    zh: '無妄',
    char: '無妄',
    up: 'Càn',
    lo: 'Chấn',
    el: 'Kim',
    jdg: 'Không vọng tưởng — hanh thông lợi trinh.',
    img: 'Sấm dưới trời, tiên vương thuận thời nuôi muôn vật.'
  },
  {
    n: 26,
    name: 'Đại Súc',
    full: 'Sơn Thiên Đại Súc',
    zh: '大畜',
    char: '大畜',
    up: 'Cấn',
    lo: 'Càn',
    el: 'Thổ',
    jdg: 'Tích lũy lớn — lợi trinh, không ăn nhà thì cát.',
    img: 'Trời trong núi, quân tử học rộng nhiều sách xưa.'
  },
  {
    n: 27,
    name: 'Di',
    full: 'Sơn Lôi Di',
    zh: '頤',
    char: '頤',
    up: 'Cấn',
    lo: 'Chấn',
    el: 'Thổ',
    jdg: 'Quai hàm — kiên định tốt, xem nuôi dưỡng.',
    img: 'Núi trên sấm, quân tử cẩn thận lời nói, tiết chế ăn uống.'
  },
  {
    n: 28,
    name: 'Đại Quá',
    full: 'Trạch Phong Đại Quá',
    zh: '大過',
    char: '大過',
    up: 'Đoài',
    lo: 'Tốn',
    el: 'Kim',
    jdg: 'Vượt lớn — đòn nóc uốn cong, lợi có chỗ đi.',
    img: 'Hồ trên gió, quân tử đứng một mình không sợ.'
  },
  {
    n: 29,
    name: 'Khảm',
    full: 'Thuần Khảm',
    zh: '坎',
    char: '坎',
    up: 'Khảm',
    lo: 'Khảm',
    el: 'Thủy',
    jdg: 'Khảm trùng điệp — tín thành hanh thông.',
    img: 'Nước chảy liên tục, quân tử kiên trì đức hạnh dạy dỗ.'
  },
  {
    n: 30,
    name: 'Ly',
    full: 'Thuần Ly',
    zh: '離',
    char: '離',
    up: 'Ly',
    lo: 'Ly',
    el: 'Hỏa',
    jdg: 'Ly — lợi trinh hanh thông, nuôi bò thì cát.',
    img: 'Ánh sáng kép, đại nhân chiếu soi tứ phương.'
  },
  {
    n: 31,
    name: 'Hàm',
    full: 'Trạch Sơn Hàm',
    zh: '咸',
    char: '咸',
    up: 'Đoài',
    lo: 'Cấn',
    el: 'Kim',
    jdg: 'Cảm ứng — hanh thông lợi trinh, lấy vợ tốt lành.',
    img: 'Hồ trên núi, quân tử khiêm tốn tiếp nhận người.'
  },
  {
    n: 32,
    name: 'Hằng',
    full: 'Lôi Phong Hằng',
    zh: '恆',
    char: '恆',
    up: 'Chấn',
    lo: 'Tốn',
    el: 'Mộc',
    jdg: 'Bền lâu — hanh thông không lỗi, lợi có chỗ đi.',
    img: 'Sấm và gió cùng nhau, quân tử đứng vững không đổi hướng.'
  },
  {
    n: 33,
    name: 'Độn',
    full: 'Thiên Sơn Độn',
    zh: '遯',
    char: '遯',
    up: 'Càn',
    lo: 'Cấn',
    el: 'Kim',
    jdg: 'Ẩn lánh — hanh thông, tiểu lợi kiên định.',
    img: 'Trời dưới núi có trời, quân tử xa lánh tiểu nhân.'
  },
  {
    n: 34,
    name: 'Đại Tráng',
    full: 'Lôi Thiên Đại Tráng',
    zh: '大壯',
    char: '大壯',
    up: 'Chấn',
    lo: 'Càn',
    el: 'Mộc',
    jdg: 'Sức mạnh lớn — lợi trinh.',
    img: 'Sấm trên trời, quân tử không đi theo lễ tục không đúng.'
  },
  {
    n: 35,
    name: 'Tấn',
    full: 'Hỏa Địa Tấn',
    zh: '晉',
    char: '晉',
    up: 'Ly',
    lo: 'Khôn',
    el: 'Hỏa',
    jdg: 'Tiến lên — chư hầu tiến thăng, ngày ba lần yết kiến.',
    img: 'Mặt trời lên mặt đất, quân tử tự sáng đức sáng.'
  },
  {
    n: 36,
    name: 'Minh Di',
    full: 'Địa Hỏa Minh Di',
    zh: '明夷',
    char: '明夷',
    up: 'Khôn',
    lo: 'Ly',
    el: 'Thổ',
    jdg: 'Ánh sáng bị che — lợi gian nan kiên định.',
    img: 'Ánh sáng vào đất, quân tử trị dân dùng bóng tối làm sáng.'
  },
  {
    n: 37,
    name: 'Gia Nhân',
    full: 'Phong Hỏa Gia Nhân',
    zh: '家人',
    char: '家人',
    up: 'Tốn',
    lo: 'Ly',
    el: 'Mộc',
    jdg: 'Gia đình — lợi cho phụ nữ kiên định.',
    img: 'Gió từ lửa ra, quân tử lời có thực, hành vi kiên định.'
  },
  {
    n: 38,
    name: 'Khuê',
    full: 'Hỏa Trạch Khuê',
    zh: '睽',
    char: '睽',
    up: 'Ly',
    lo: 'Đoài',
    el: 'Hỏa',
    jdg: 'Trái chiều — tiểu sự tốt lành.',
    img: 'Lửa trên hồ, quân tử đồng mà dị.'
  },
  {
    n: 39,
    name: 'Kiển',
    full: 'Thủy Sơn Kiển',
    zh: '蹇',
    char: '蹇',
    up: 'Khảm',
    lo: 'Cấn',
    el: 'Thủy',
    jdg: 'Trở ngại — lợi Tây Nam, bất lợi Đông Bắc.',
    img: 'Núi trên nước, quân tử tự xét thân tu đức.'
  },
  {
    n: 40,
    name: 'Giải',
    full: 'Lôi Thủy Giải',
    zh: '解',
    char: '解',
    up: 'Chấn',
    lo: 'Khảm',
    el: 'Mộc',
    jdg: 'Giải thoát — lợi Tây Nam, không có chỗ đi thì trở về.',
    img: 'Sấm mưa giải, quân tử tha thứ tội lỗi.'
  },
  {
    n: 41,
    name: 'Tổn',
    full: 'Sơn Trạch Tổn',
    zh: '損',
    char: '損',
    up: 'Cấn',
    lo: 'Đoài',
    el: 'Thổ',
    jdg: 'Giảm bớt — tín thành hanh thông, lợi có chỗ đi.',
    img: 'Núi dưới có hồ, quân tử trừ giận muốn, chế bỏ dục vọng.'
  },
  {
    n: 42,
    name: 'Ích',
    full: 'Phong Lôi Ích',
    zh: '益',
    char: '益',
    up: 'Tốn',
    lo: 'Chấn',
    el: 'Mộc',
    jdg: 'Tăng thêm — lợi có chỗ đi, lợi vượt sông lớn.',
    img: 'Gió và sấm, quân tử thấy thiện thì theo, có lỗi thì sửa.'
  },
  {
    n: 43,
    name: 'Quải',
    full: 'Trạch Thiên Quải',
    zh: '夬',
    char: '夬',
    up: 'Đoài',
    lo: 'Càn',
    el: 'Kim',
    jdg: 'Quyết đoán — cổ vũ ở sân vua, tín thành có nguy.',
    img: 'Hồ trên trời, quân tử ban bổng lộc xuống dưới.'
  },
  {
    n: 44,
    name: 'Cấu',
    full: 'Thiên Phong Cấu',
    zh: '姤',
    char: '姤',
    up: 'Càn',
    lo: 'Tốn',
    el: 'Kim',
    jdg: 'Gặp gỡ — người phụ nữ mạnh, không lấy được.',
    img: 'Gió dưới trời, hậu thí mệnh cáo bốn phương.'
  },
  {
    n: 45,
    name: 'Tụy',
    full: 'Trạch Địa Tụy',
    zh: '萃',
    char: '萃',
    up: 'Đoài',
    lo: 'Khôn',
    el: 'Kim',
    jdg: 'Tụ họp — hanh thông, vương đến miếu.',
    img: 'Hồ trên đất, quân tử trừ vũ khí phòng bất ngờ.'
  },
  {
    n: 46,
    name: 'Thăng',
    full: 'Địa Phong Thăng',
    zh: '升',
    char: '升',
    up: 'Khôn',
    lo: 'Tốn',
    el: 'Thổ',
    jdg: 'Đi lên — đại hanh, dùng gặp đại nhân không lo.',
    img: 'Gỗ trong đất lớn lên, quân tử thuận đức tích tiểu thành cao.'
  },
  {
    n: 47,
    name: 'Khốn',
    full: 'Trạch Thủy Khốn',
    zh: '困',
    char: '困',
    up: 'Đoài',
    lo: 'Khảm',
    el: 'Kim',
    jdg: 'Khốn khổ — hanh thông, đại nhân cát, không lỗi.',
    img: 'Hồ không có nước, quân tử liều mạng theo chí.'
  },
  {
    n: 48,
    name: 'Tỉnh',
    full: 'Thủy Phong Tỉnh',
    zh: '井',
    char: '井',
    up: 'Khảm',
    lo: 'Tốn',
    el: 'Thủy',
    jdg: 'Giếng nước — làng đổi giếng không đổi, nguy nếu không đến.',
    img: 'Nước trên gỗ là giếng, quân tử khuyến khích dân giúp nhau.'
  },
  {
    n: 49,
    name: 'Cách',
    full: 'Trạch Hỏa Cách',
    zh: '革',
    char: '革',
    up: 'Đoài',
    lo: 'Ly',
    el: 'Kim',
    jdg: 'Biến đổi — ngày đã qua mới tin, đại hanh lợi trinh.',
    img: 'Hồ trên lửa, quân tử lịch hóa rõ thời tiết.'
  },
  {
    n: 50,
    name: 'Đỉnh',
    full: 'Hỏa Phong Đỉnh',
    zh: '鼎',
    char: '鼎',
    up: 'Ly',
    lo: 'Tốn',
    el: 'Hỏa',
    jdg: 'Vạc — đại cát hanh thông.',
    img: 'Gỗ trên lửa nấu, quân tử giữ chính vị nghe mệnh trời.'
  },
  {
    n: 51,
    name: 'Chấn',
    full: 'Thuần Chấn',
    zh: '震',
    char: '震',
    up: 'Chấn',
    lo: 'Chấn',
    el: 'Mộc',
    jdg: 'Sấm — hanh thông, sấm đến kinh hãi, rồi cười.',
    img: 'Sấm kép, quân tử sợ hãi tu thân xét lỗi.'
  },
  {
    n: 52,
    name: 'Cấn',
    full: 'Thuần Cấn',
    zh: '艮',
    char: '艮',
    up: 'Cấn',
    lo: 'Cấn',
    el: 'Thổ',
    jdg: 'Núi — dừng ở lưng không thấy người, không lỗi.',
    img: 'Núi kép, quân tử tư tưởng không vượt vị trí mình.'
  },
  {
    n: 53,
    name: 'Tiệm',
    full: 'Phong Sơn Tiệm',
    zh: '漸',
    char: '漸',
    up: 'Tốn',
    lo: 'Cấn',
    el: 'Mộc',
    jdg: 'Dần dần — phụ nữ lấy chồng tốt, lợi trinh.',
    img: 'Gỗ trên núi, quân tử cư xử có đức, cải thiện phong tục.'
  },
  {
    n: 54,
    name: 'Quy Muội',
    full: 'Lôi Trạch Quy Muội',
    zh: '歸妹',
    char: '歸妹',
    up: 'Chấn',
    lo: 'Đoài',
    el: 'Mộc',
    jdg: 'Gả em gái — chinh hung, không lợi có chỗ đi.',
    img: 'Sấm trên hồ, quân tử hiểu cái hư cái cứu cánh.'
  },
  {
    n: 55,
    name: 'Phong',
    full: 'Lôi Hỏa Phong',
    zh: '豐',
    char: '豐',
    up: 'Chấn',
    lo: 'Ly',
    el: 'Mộc',
    jdg: 'Phong phú — hanh thông, vương đến không lo.',
    img: 'Sấm lửa đều đến là phong, quân tử xử kiện tụng không trì hoãn.'
  },
  {
    n: 56,
    name: 'Lữ',
    full: 'Hỏa Sơn Lữ',
    zh: '旅',
    char: '旅',
    up: 'Ly',
    lo: 'Cấn',
    el: 'Hỏa',
    jdg: 'Lữ hành — tiểu hanh lợi trinh lữ.',
    img: 'Lửa trên núi, quân tử sáng suốt dùng hình không giam lâu.'
  },
  {
    n: 57,
    name: 'Tốn',
    full: 'Thuần Tốn',
    zh: '巽',
    char: '巽',
    up: 'Tốn',
    lo: 'Tốn',
    el: 'Mộc',
    jdg: 'Gió — tiểu hanh lợi có chỗ đi, lợi gặp đại nhân.',
    img: 'Gió theo gió, quân tử tuyên bá mệnh lệnh làm việc.'
  },
  {
    n: 58,
    name: 'Đoài',
    full: 'Thuần Đoài',
    zh: '兌',
    char: '兌',
    up: 'Đoài',
    lo: 'Đoài',
    el: 'Kim',
    jdg: 'Vui vẻ — hanh thông lợi trinh.',
    img: 'Hồ kép, quân tử bạn bè giảng tập.'
  },
  {
    n: 59,
    name: 'Hoán',
    full: 'Phong Thủy Hoán',
    zh: '渙',
    char: '渙',
    up: 'Tốn',
    lo: 'Khảm',
    el: 'Mộc',
    jdg: 'Phân tán — hanh thông, vương đến miếu.',
    img: 'Gió trên nước, tiên vương thờ thượng đế lập miếu.'
  },
  {
    n: 60,
    name: 'Tiết',
    full: 'Thủy Trạch Tiết',
    zh: '節',
    char: '節',
    up: 'Khảm',
    lo: 'Đoài',
    el: 'Thủy',
    jdg: 'Tiết độ — hanh thông, tiết khổ không thể kiên trì.',
    img: 'Hồ trên nước là tiết, quân tử chế độ số lượng bàn đức hạnh.'
  },
  {
    n: 61,
    name: 'Trung Phu',
    full: 'Phong Trạch Trung Phu',
    zh: '中孚',
    char: '中孚',
    up: 'Tốn',
    lo: 'Đoài',
    el: 'Mộc',
    jdg: 'Tín thành — lợi vượt sông lớn lợi trinh.',
    img: 'Gió trên hồ, quân tử bàn án xá hình tử.'
  },
  {
    n: 62,
    name: 'Tiểu Quá',
    full: 'Lôi Sơn Tiểu Quá',
    zh: '小過',
    char: '小過',
    up: 'Chấn',
    lo: 'Cấn',
    el: 'Mộc',
    jdg: 'Vượt nhỏ — hanh thông lợi trinh, tiểu sự cát đại sự hung.',
    img: 'Sấm trên núi, quân tử hành vi cung kính, tang lễ thận trọng.'
  },
  {
    n: 63,
    name: 'Ký Tế',
    full: 'Thủy Hỏa Ký Tế',
    zh: '既濟',
    char: '既濟',
    up: 'Khảm',
    lo: 'Ly',
    el: 'Thủy',
    jdg: 'Hoàn thành — hanh thông tiểu lợi trinh, đầu cát cuối loạn.',
    img: 'Nước trên lửa là ký tế, quân tử lo nghĩ tai họa đề phòng.'
  },
  {
    n: 64,
    name: 'Vị Tế',
    full: 'Hỏa Thủy Vị Tế',
    zh: '未濟',
    char: '未濟',
    up: 'Ly',
    lo: 'Khảm',
    el: 'Hỏa',
    jdg: 'Chưa hoàn thành — hanh thông, hồ nhỏ sang được bờ, ướt đuôi.',
    img: 'Lửa trên nước, quân tử thận trọng phân biệt mọi vật.'
  }
]

// ─── Build lookup tables ───────────────────────────────────────────────────────

/** King Wen number → Hexagram */
const BY_NUMBER: Map<number, Hexagram> = new Map()

/** 6-bit binary string → Hexagram */
const BY_BINARY: Map<string, Hexagram> = new Map()

function buildBinaryFromTrigrams(upper: string, lower: string): string {
  const u = TRIGRAMS[upper]?.binary ?? '000' // bits 5-3 (top 3 lines)
  const l = TRIGRAMS[lower]?.binary ?? '000' // bits 2-0 (bottom 3 lines)
  // Combine: upper trigram bits are lines 4,5,6 (bit3,4,5); lower are lines 1,2,3 (bit0,1,2)
  // Trigram binary: bit2=top, bit1=mid, bit0=bottom of trigram
  // For hexagram: bit5=line6(top), bit4=line5, bit3=line4, bit2=line3, bit1=line2, bit0=line1(bottom)
  const result = `${u}${l}` // upper trigram bits [5:3], lower trigram bits [2:0]
  return result
}

RAW.forEach(r => {
  const binary = buildBinaryFromTrigrams(r.up, r.lo)
  const hex: Hexagram = {
    number: r.n,
    name: r.name,
    fullName: r.full,
    chinese: r.zh,
    character: r.char,
    upperTrigram: r.up,
    lowerTrigram: r.lo,
    element: r.el,
    judgment: r.jdg,
    image: r.img,
    binary
  }
  BY_NUMBER.set(r.n, hex)
  BY_BINARY.set(binary, hex)
})

// ─── Public API ────────────────────────────────────────────────────────────────

export function getHexagramByNumber(n: number): Hexagram | undefined {
  return BY_NUMBER.get(n)
}

/**
 * Get hexagram from 6 line yang/yin values (index 0=bottom, 5=top).
 * 1=yang, 0=yin
 */
export function getHexagramByLines(lines: (0 | 1)[]): Hexagram | undefined {
  // Build 6-bit binary: bit0=line[0], bit5=line[5]
  const binaryIndex =
    (lines[5] << 5) |
    (lines[4] << 4) |
    (lines[3] << 3) |
    (lines[2] << 2) |
    (lines[1] << 1) |
    lines[0]
  const kwNumber = BINARY_TO_KW[binaryIndex]
  return BY_NUMBER.get(kwNumber)
}

export function getAllHexagrams(): Hexagram[] {
  return Array.from(BY_NUMBER.values()).sort((a, b) => a.number - b.number)
}

// ─── Nạp Giáp / Earth Branch assignments ─────────────────────────────────────

/** Earth branches (地支) in order for display */
export const EARTH_BRANCHES = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi'
]

/**
 * Branch-to-element mapping (地支 → 五行)
 */
export const BRANCH_ELEMENT: Record<string, import('../types').WuXing> = {
  Tý: 'Thủy',
  Sửu: 'Thổ',
  Dần: 'Mộc',
  Mão: 'Mộc',
  Thìn: 'Thổ',
  Tỵ: 'Hỏa',
  Ngọ: 'Hỏa',
  Mùi: 'Thổ',
  Thân: 'Kim',
  Dậu: 'Kim',
  Tuất: 'Thổ',
  Hợi: 'Thủy'
}

/**
 * Palace (宮) branch sequences for each of the 8 palaces.
 * Index 0 = line 1 (bottom), 5 = line 6 (top).
 * Uses global indices into EARTH_BRANCHES.
 */
const PALACE_BRANCHES: Record<string, [number, number, number, number, number, number]> = {
  Càn: [0, 2, 4, 6, 8, 10], // Tý Dần Thìn Ngọ Thân Tuất
  Khảm: [2, 4, 6, 0, 2, 4], // Dần Thìn Ngọ Tý Dần Thìn
  Cấn: [6, 8, 10, 4, 6, 8], // Ngọ Thân Tuất Thìn Ngọ Thân
  Chấn: [0, 2, 4, 4, 2, 0], // Tý Dần Thìn Thìn Dần Tý
  Tốn: [3, 1, 11, 9, 7, 5], // Mão Sửu Hợi Dậu Mùi Tỵ
  Ly: [9, 7, 5, 3, 1, 11], // Dậu Mùi Tỵ Mão Sửu Hợi
  Khôn: [9, 7, 5, 3, 1, 11], // Dậu Mùi Tỵ Mão Sửu Hợi (simplified)
  Đoài: [3, 1, 11, 9, 7, 5] // Mão Sửu Hợi Dậu Mùi Tỵ (simplified)
}

/** Get the earth branch for a specific line position in a hexagram */
export function getEarthBranch(hexagram: Hexagram, lineIndex: number): string {
  const palace = hexagram.upperTrigram // simplified: palace = upper trigram's palace
  const branches = PALACE_BRANCHES[palace] ?? PALACE_BRANCHES.Càn
  const branchIdx = branches[lineIndex]
  return EARTH_BRANCHES[branchIdx]
}

// ─── Line position labels ─────────────────────────────────────────────────────

export const LINE_LABELS = ['Sơ Hào', 'Nhị Hào', 'Tam Hào', 'Tứ Hào', 'Ngũ Hào', 'Thượng Hào']
