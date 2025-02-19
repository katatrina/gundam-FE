import type { GundamCondition } from "@/types/models";

export const GUNDAM_CONDITION_MAPPING = {
  'new': {
    label: 'Mới 100%',
    description: [
      'Chưa mở hộp, chưa lắp ráp',
      'Đầy đủ các phụ kiện và decal',
      'Tình trạng mới 100%'
    ]
  },
  'open box': {
    label: 'Gần như mới',
    description: [
      'Đã mở hộp nhưng chưa lắp ráp',
      'Đầy đủ các phụ kiện và decal',
      'Tình trạng mới 100%'
    ]
  },
  'second hand': {
    label: 'Đã qua sử dụng',
    description: [
      'Có dấu hiệu sử dụng như bụi bẩn hoặc trầy xước nhẹ',
      'Một số khớp có thể bị lỏng nhưng vẫn tạo dáng được',
      'Tình trạng còn khoảng 70-80%'
    ]
  },
} as const satisfies Record<GundamCondition, { label: string; description: string[] }>;
