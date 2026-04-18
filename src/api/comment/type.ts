import type { ResponseData } from '../common/type'

export interface CommentItem {
  id: number
  parentId: number | null
  content: string
  userId: number
  username: string
  avatar: string
  likeCount: number
  createTime: string
  updateTime: string
  children?: CommentItem[]
  replyCount?: number
}

export type CommentListResponse = ResponseData & {
  data: {
    items: CommentItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}

export interface AddCommentParams {
  content: string
  parentId?: number
}

export interface UpdateCommentParams {
  content: string
}

export type CommentOperationResponse = ResponseData & {
  data: CommentItem
}

export type CommentActionResponse = ResponseData
