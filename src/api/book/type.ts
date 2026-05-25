import type { ResponseData } from '../common/type'

export interface BookItem {
  id: number
  bookName: string
  author: string
  brief: string
  cover: string
  imgWidth?: number
  imgHeight?: number
}
// 获取书籍列表响应
export type BookListResponse = ResponseData & {
  data: {
    items: BookItem[]
    totalPages: number
    totalElements: number
    currentPage: number
    size: number
  }
}

// 新增书籍请求参数
export interface AddBookParams {
  bookName: string
  author: string
  brief: string
  cover: string
}

// 编辑书籍请求参数
export interface UpdateBookParams {
  id: number
  bookName: string
  author: string
  brief: string
  cover: string
}

// 新增/编辑/删除/推荐操作的通用响应
export type BookOperationResponse = ResponseData & {
  data: BookItem | null
}
