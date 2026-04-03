import type { ResponseData } from '../common/type'

export interface CognitionItem {
  id: number
  title: string
  content: string
  cognize_time: string
  favorite: number
  remarks: string[]
}

export type CognitionResponse = ResponseData & {
  data: { items: CognitionItem[] }
}
