import request from '@/utils/request'
import type {
  CommentListResponse,
  CommentOperationResponse,
  CommentActionResponse,
  AddCommentParams,
  UpdateCommentParams
} from './type'

const API = {
  LIST: '/comment/list',
  ADD: '/comment/add',
  UPDATE: '/comment/update',
  DELETE: '/comment/delete',
  LIKE: '/comment/like'
} as const

export const reqGetCommentList = (params: {
  pageNo: number
  pageSize: number
  targetType?: string | null
  targetId?: number | null
  allComments?: boolean
}) => request.get('/comment/list', { params })

// 发表评论
export const reqAddComment = (params: AddCommentParams & { targetType?: string; targetId?: number }) =>
  request.post<CommentOperationResponse>(API.ADD, params)

export const reqUpdateComment = (id: number, params: UpdateCommentParams) =>
  request.put<CommentOperationResponse>(`${API.UPDATE}/${id}`, params)

export const reqDeleteComment = (id: number) => request.delete<CommentActionResponse>(`${API.DELETE}/${id}`)

export const reqLikeComment = (id: number) => request.post<CommentActionResponse>(`${API.LIKE}/${id}`)
