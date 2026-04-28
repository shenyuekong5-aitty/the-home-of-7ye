import type { ResponseData } from '../common/type'

export interface StudyItem {
  id: number
  title: string
  description: string
  advantage: string
  disadvantage: string
  authorId: number
  authorName: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  createTime: string
  updateTime: string
  categories?: { id: number; name: string }[] // ✅ 多分类信息
}

export type StudyListResponse = ResponseData & {
  data: {
    items: StudyItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export type StudyDetailResponse = ResponseData & {
  data: StudyItem
}

export interface AddStudyParams {
  title: string
  description: string
  advantage: string
  disadvantage: string
  categoryIds?: number[] // ✅ 改用数组
}

export interface UpdateStudyParams extends AddStudyParams {
  id: number
}

export type StudyOperationResponse = ResponseData & {
  data: StudyItem | null
}
