import type { ResponseData } from '../common/type'

export interface GameItem {
  id: number
  name: string
  author: string
  brief: string
  coverImg: string
  imgWidth?: number
  imgHeight?: number
}

export type GameResponse = ResponseData & {
  data: { items: GameItem[] }
}

// 新增/编辑 表单用
export interface GameFormData {
  name: string
  author: string
  brief: string
  coverImg: string
}

// 通用操作响应 (add/update 可能返回 data 对象)
export type GameOpResponse = ResponseData & {
  data?: GameItem
}
