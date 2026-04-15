import request from '@/utils/request'
import type { BookListResponse, BookOperationResponse, AddBookParams, UpdateBookParams } from './type'

const API = {
  LIST: '/book/list',
  ADD: '/book/add',
  UPDATE: '/book/update',
  DELETE: '/book/delete',
  RECOMMEND: '/book/recommend' // 朋友推荐专用接口（可选）
} as const

/**
 * 获取书籍列表
 */
export const reqGetBookList = () => request.get<BookListResponse>(API.LIST)

/**
 * 新增书籍（管理员专用）
 */
export const reqAddBook = (data: AddBookParams) => request.post<BookOperationResponse>(API.ADD, data)

/**
 * 编辑书籍（管理员专用）
 */
export const reqUpdateBook = (data: UpdateBookParams) => request.put<BookOperationResponse>(API.UPDATE, data)

/**
 * 删除书籍（管理员专用）
 */
export const reqDeleteBook = (id: number) => request.delete<BookOperationResponse>(`${API.DELETE}/${id}`)

/**
 * 推荐书籍（朋友专用）
 * 如果后端有单独的推荐接口则使用，否则可复用新增接口并添加状态字段
 */
export const reqRecommendBook = (data: AddBookParams) => request.post<BookOperationResponse>(API.RECOMMEND, data)
