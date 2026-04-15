import type { ResponseData } from '../common/type'

// 评论项（与后端实体对应）
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
  children?: CommentItem[] // 子回复（树形结构）
  replyCount?: number // 回复数量
}

// 获取评论列表的响应
export type CommentListResponse = ResponseData & {
  data: {
    items: CommentItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}

// 发表/修改评论的请求参数
export interface AddCommentParams {
  content: string
  parentId?: number // 回复时传入，顶级评论不传
}

export interface UpdateCommentParams {
  content: string
}

// 发表/修改评论的响应
export type CommentOperationResponse = ResponseData & {
  data: CommentItem
}

// 删除/点赞的响应（无具体数据）
export type CommentActionResponse = ResponseData
