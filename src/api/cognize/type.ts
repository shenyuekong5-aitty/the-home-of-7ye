import type { ResponseData } from '../common/type'

/** 认知条目 */
export interface CognizeItem {
  id: number
  title: string
  content: string
  authorId: number
  authorName: string
  createTime: string
  updateTime: string
}

/** 获取认知列表响应 */
export type CognizeListResponse = ResponseData & {
  data: {
    items: CognizeItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}

/** 获取认知详情响应 */
export type CognizeDetailResponse = ResponseData & {
  data: CognizeItem
}
