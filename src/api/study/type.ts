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
  categoryId?: number
  categoryName?: string
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
  categoryId?: number
}

export interface UpdateStudyParams extends AddStudyParams {
  id: number
}

export type StudyOperationResponse = ResponseData & {
  data: StudyItem | null
}
