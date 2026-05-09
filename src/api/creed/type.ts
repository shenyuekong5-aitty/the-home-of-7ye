import type { ResponseData } from '../common/type'

export interface CreedItem {
  id: number
  content: string
}

export type CreedResponse = ResponseData & {
  data: { items: CreedItem[] }
}

export type CreedOpResponse = ResponseData & {
  data?: CreedItem
}
