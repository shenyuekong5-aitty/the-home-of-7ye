import type { ResponseData } from '../common/type'

// 增加浏览量响应
export type ViewIncrementResponse = ResponseData & {
  data: { viewCount: number } | null
}
