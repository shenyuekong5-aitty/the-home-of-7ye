import type { ResponseData } from '../common/type'

export interface CognizeItem {
  id: number
  title: string
  content: string
  authorId: number
  authorName: string
  createTime: string
  updateTime: string
}

export type CognizeListResponse = ResponseData & {
  data: {
    items: CognizeItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export type CognizeDetailResponse = ResponseData & {
  data: CognizeItem
}

// 新增/编辑请求体
export interface AddCognizeParams {
  title: string
  content: string
}

export interface UpdateCognizeParams extends AddCognizeParams {
  id: number
}

// 操作通用响应
export type CognizeOperationResponse = ResponseData & {
  data: CognizeItem | null
}
