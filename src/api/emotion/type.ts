import type { ResponseData } from '../common/type'

export interface EmotionItem {
  id: number
  userid: number
  author: string // 由后端注入的昵称
  avatar: string
  content: string
  time: string
  remarks: string[] // 解析后的回复数组
}

// 获取列表的响应
export type EmotionListResponse = ResponseData & {
  data: {
    items: EmotionItem[]
  }
}

// 新增 / 编辑 / 回复 的请求体
export interface EmotionFormData {
  content: string
  time?: string // 新增时可选
}

// 通用的单条情绪操作响应（新增、编辑、回复）
export type EmotionOpResponse = ResponseData & {
  data?: EmotionItem
}

// 删除操作响应（无 data）
export type EmotionDeleteResponse = ResponseData
