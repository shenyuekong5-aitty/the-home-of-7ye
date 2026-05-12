import type { ResponseData } from '../common/type'

export interface NoticeItem {
  id: number
  title: string
  content: string
  publishTime: string
  isImportant: boolean
  publisher: string
}

export interface NoticeListResponse {
  code: number
  data: {
    items: NoticeItem[]
    total: number
    pageSize: number
    pageNo: number
  }
}

// 新增 / 编辑 参数
export interface NoticeFormParams {
  title: string
  content: string
  isImportant?: boolean
}

// 新增 / 编辑 / 删除 响应
export type NoticeOpResponse = ResponseData & {
  data?: NoticeItem
}
