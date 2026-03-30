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

export interface PublishNoticeParams {
  title: string
  content: string
  isImportant: boolean
}

export type PublishNoticeResponse = ResponseData
