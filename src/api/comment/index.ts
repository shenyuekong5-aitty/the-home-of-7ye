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
}) => {
  const query: any = { pageNo: params.pageNo, pageSize: params.pageSize }
  if (params.targetType != null && params.targetId != null) {
    query.targetType = params.targetType
    query.targetId = params.targetId
  } else if (params.targetType != null) {
    // 只有类型：/list?targetType=music  ← 新增！
    query.targetType = params.targetType
  }
  return request.get<CommentListResponse>(API.LIST, { params: query })
}

// 发表评论
export const reqAddComment = (params: AddCommentParams & { targetType?: string; targetId?: number }) =>
  request.post<CommentOperationResponse>(API.ADD, params)

export const reqUpdateComment = (id: number, params: UpdateCommentParams) =>
  request.put<CommentOperationResponse>(`${API.UPDATE}/${id}`, params)

export const reqDeleteComment = (id: number) => request.delete<CommentActionResponse>(`${API.DELETE}/${id}`)

export const reqLikeComment = (id: number) => request.post<CommentActionResponse>(`${API.LIKE}/${id}`)
