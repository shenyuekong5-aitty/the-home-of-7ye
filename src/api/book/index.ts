import request from '@/utils/request'
import type { BookListResponse, BookOperationResponse, AddBookParams, UpdateBookParams } from './type'

const API = {
  LIST: '/book/list',
  ADD: '/book/add',
  UPDATE: '/book/update',
  DELETE: '/book/delete',
  RECOMMEND: '/recommendation/submit'
} as const

export const reqGetBookList = (page = 0, size = 10) =>
  request.get<BookListResponse>(API.LIST, { params: { page, size }, timeout: 25000 })

export const reqAddBook = (data: AddBookParams) => request.post<BookOperationResponse>(API.ADD, data)

export const reqUpdateBook = (data: UpdateBookParams) => request.put<BookOperationResponse>(API.UPDATE, data)

export const reqDeleteBook = (id: number) => request.delete<BookOperationResponse>(`${API.DELETE}/${id}`)

export const reqRecommendBook = (data: AddBookParams) => {
  const payload = {
    type: 'book',
    content: data
  }
  return request.post<BookOperationResponse>(API.RECOMMEND, payload)
}
