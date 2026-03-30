import type { ResponseData } from '../common/type'

export interface BookItem {
  id: number
  bookName: string
  author: string
  brief: string
  cover: string
  imgWidth?: number // 动态添加
  imgHeight?: number // 动态添加
}

export type BookResponse = ResponseData & {
  data: { items: BookItem[] }
}
