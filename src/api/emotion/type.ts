import type { ResponseData } from '../common/type'

export interface EmotionItem {
  id: number
  author: string
  content: string
  time: string
  like: number
  remarks?: string[]
}

export type EmotionResponse = ResponseData & {
  data: { items: EmotionItem[] }
}
