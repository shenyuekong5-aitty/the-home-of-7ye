import type { ResponseData } from '../common/type'

export interface TagItem {
  id: number
  content: string
}

export type TagResponse = ResponseData & {
  data: { items: TagItem[] }
}
