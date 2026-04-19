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
}

// 获取学习列表响应
export type StudyListResponse = ResponseData & {
  data: {
    items: StudyItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}

// 获取学习详情响应
export type StudyDetailResponse = ResponseData & {
  data: StudyItem
}

// 新增学习条目请求参数
export interface AddStudyParams {
  title: string
  description: string
  advantage: string
  disadvantage: string
}

// 编辑学习条目请求参数
export interface UpdateStudyParams extends AddStudyParams {
  id: number
}

// 新增/编辑/删除/点赞操作的通用响应
export type StudyOperationResponse = ResponseData & {
  data: StudyItem | null
}

// 收藏状态响应
export type FavoriteStatusResponse = ResponseData & {
  data: {
    isFavorited: boolean
  }
}
