import request from '@/utils/request'
import type { BookResponse } from './type'

const API = {
  LIST: '/book/list'
} as const

export const reqGetBookList = () => request.get<BookResponse>(API.LIST)
