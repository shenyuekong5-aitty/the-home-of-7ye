import type { ResponseData } from '../common/type'

export interface GameItem {
  id: number
  name: string
  author: string
  brief: string
  coverImg: string
  imgWidth?: number // 动态添加
  imgHeight?: number // 动态添加
}

export type GameResponse = ResponseData & {
  data: { items: GameItem[] }
}
