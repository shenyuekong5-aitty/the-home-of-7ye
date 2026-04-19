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

// 获取评论列表（支持模块过滤，兼容旧调用）
export const reqGetCommentList = (
  pageNo: number = 1,
  pageSize: number = 10,
  targetType?: string,
  targetId?: number
) => {
  const params: any = { pageNo, pageSize }
  if (targetType && targetId) {
    params.targetType = targetType
    params.targetId = targetId
  }
  return request.get<CommentListResponse>(API.LIST, { params })
}

// 新增：获取指定目标下的评论树（路径变量方式，供 getCommentsByTarget 使用）
export const reqGetTargetCommentList = (
  targetType: string,
  targetId: number,
  pageNo: number = 1,
  pageSize: number = 10
) =>
  request.get<CommentListResponse>(`${API.LIST}/${targetType}/${targetId}`, {
    params: { pageNo, pageSize }
  })

// 发表评论（支持模块）
export const reqAddComment = (params: AddCommentParams & { targetType?: string; targetId?: number }) =>
  request.post<CommentOperationResponse>(API.ADD, params)

export const reqUpdateComment = (id: number, params: UpdateCommentParams) =>
  request.put<CommentOperationResponse>(`${API.UPDATE}/${id}`, params)

export const reqDeleteComment = (id: number) => request.delete<CommentActionResponse>(`${API.DELETE}/${id}`)

export const reqLikeComment = (id: number) => request.post<CommentActionResponse>(`${API.LIKE}/${id}`)
