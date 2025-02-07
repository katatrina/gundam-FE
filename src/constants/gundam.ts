import type { GundamCondition } from "@/types/models";

export const GUNDAM_CONDITION_MAPPING = {
  'mint': {
    label: 'Mới nguyên seal',
    description: [
      'Sản phẩm còn nguyên seal, chưa mở hộp',
      'Hộp không có dấu hiệu móp méo, hư hại',
      'Hoàn toàn mới 100%'
    ]
  },
  'near mint': {
    label: 'Gần như mới',
    description: [
      'Đã mở hộp nhưng chưa lắp ráp',
      'Runner còn nguyên, không có dấu hiệu cắt hoặc tháo gỡ',
      'Tình trạng như mới 95-99%'
    ]
  },
  'good': {
    label: 'Tốt',
    description: [
      'Đã lắp ráp, được bảo quản cẩn thận',
      'Các khớp và điểm nối còn chắc chắn, không bị lỏng',
      'Không có trầy xước hoặc tổn hại đáng kể'
    ]
  },
  'moderate wear': {
    label: 'Đã qua sử dụng',
    description: [
      'Có dấu hiệu sử dụng như bụi bẩn hoặc trầy xước nhẹ',
      'Một số khớp có thể bị lỏng nhưng vẫn tạo dáng được',
      'Tình trạng còn khoảng 70-80%'
    ]
  },
  'heavily damaged': {
    label: 'Hư hỏng nặng',
    description: [
      'Có nhiều bộ phận bị gãy, nứt hoặc biến dạng',
      'Khớp nối bị lỏng hoặc hỏng, khó tạo dáng',
      'Tình trạng dưới 50%, cần sửa chữa nhiều'
    ]
  }
} as const satisfies Record<GundamCondition, { label: string; description: string[] }>;
