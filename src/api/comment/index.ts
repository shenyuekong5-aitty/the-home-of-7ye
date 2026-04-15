import request from '@/utils/request'
import type {
  CommentListResponse,
  CommentOperationResponse,
  CommentActionResponse,
  AddCommentParams,
  UpdateCommentParams
} from './type'

// API 路径常量（注意 baseURL 已设置为 /api，所以这里不要重复 /api 前缀）
const API = {
  LIST: '/comment/list',
  ADD: '/comment/add',
  UPDATE: '/comment/update', // 需要拼接 id，如 /comment/update/1
  DELETE: '/comment/delete', // 同上
  LIKE: '/comment/like' // 同上
} as const

/**
 * 获取评论列表（树形结构）
 * @param pageNo 页码，默认1
 * @param pageSize 每页条数，默认10
 */
export const reqGetCommentList = (pageNo: number = 1, pageSize: number = 10) =>
  request.get<CommentListResponse>(API.LIST, { params: { pageNo, pageSize } })

/**
 * 发表评论或回复
 * @param params 包含 content 和可选的 parentId
 */
export const reqAddComment = (params: AddCommentParams) => request.post<CommentOperationResponse>(API.ADD, params)

/**
 * 修改评论
 * @param id 评论ID
 * @param params 包含 content
 */
export const reqUpdateComment = (id: number, params: UpdateCommentParams) =>
  request.put<CommentOperationResponse>(`${API.UPDATE}/${id}`, params)

/**
 * 删除评论（级联删除子回复）
 * @param id 评论ID
 */
export const reqDeleteComment = (id: number) => request.delete<CommentActionResponse>(`${API.DELETE}/${id}`)

/**
 * 点赞评论
 * @param id 评论ID
 */
export const reqLikeComment = (id: number) => request.post<CommentActionResponse>(`${API.LIKE}/${id}`)
