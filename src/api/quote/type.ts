import type { ResponseData } from '../common/type'

export interface QuoteItem {
  id: number
  content: string
}

export type QuoteResponse = ResponseData & {
  data: { items: QuoteItem[] }
}

// 单条操作响应
export type QuoteOpResponse = ResponseData & {
  data?: QuoteItem
}
