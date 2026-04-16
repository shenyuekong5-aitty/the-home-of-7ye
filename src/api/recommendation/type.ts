export interface RecommendationItem {
  id: number
  type: string
  proposerName: string
  status: string
  createTime: string
  reviewComment?: string
  content: {
    bookName?: string
    author?: string
    brief?: string
    cover?: string
    [key: string]: any
  }
}

// 修正：响应结构应与统一 ResponseData 一致
export type RecommendationListResponse = {
  code: number
  message: string
  data: RecommendationItem[]
}
