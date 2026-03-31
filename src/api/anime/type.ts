import type { ResponseData } from '../common/type'

export interface AnimeItem {
  id: number
  name: string
  author: string
  brief: string
  coverImg: string
  imgWidth?: number // 动态添加
  imgHeight?: number // 动态添加
}

export type AnimeResponse = ResponseData & {
  data: { items: AnimeItem[] }
}
