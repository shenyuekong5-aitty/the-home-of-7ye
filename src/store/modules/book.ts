import { defineStore } from 'pinia'
import { reqGetBookList, reqAddBook, reqUpdateBook, reqDeleteBook, reqRecommendBook } from '@/api/book/index.ts'
import type {
  BookItem,
  BookListResponse,
  BookOperationResponse,
  AddBookParams,
  UpdateBookParams
} from '@/api/book/type.ts'

export const useBookStore = defineStore('book', {
  state: () => ({
    bookList: [] as BookItem[],
    totalPages: 0,
    currentPage: 0,
    totalElements: 0,
    pageSize: 10
  }),

  actions: {
    /**
     * 获取书籍列表
     */
    async getBooks(page = 0, size = 10) {
      const res: BookListResponse = await reqGetBookList(page, size)
      if (res.code === 200) {
        this.bookList = res.data.items
        this.totalPages = res.data.totalPages
        this.currentPage = res.data.currentPage
        this.totalElements = res.data.totalElements
        this.pageSize = res.data.size
        return 'ok'
      } else {
        throw new Error(res.message || '获取书籍列表失败')
      }
    },

    /**
     * 新增书籍（管理员专用）
     */
    async addBook(data: AddBookParams) {
      const res: BookOperationResponse = await reqAddBook(data)
      if (res.code === 200) {
        // 新增成功后刷新列表
        await this.getBooks()
        return 'ok'
      } else {
        throw new Error(res.message || '新增书籍失败')
      }
    },

    /**
     * 编辑书籍（管理员专用）
     */
    async updateBook(data: UpdateBookParams) {
      const res: BookOperationResponse = await reqUpdateBook(data)
      if (res.code === 200) {
        // 更新成功后刷新列表
        await this.getBooks()
        return 'ok'
      } else {
        throw new Error(res.message || '编辑书籍失败')
      }
    },

    /**
     * 删除书籍（管理员专用）
     */
    async deleteBook(id: number) {
      const res: BookOperationResponse = await reqDeleteBook(id)
      if (res.code === 200) {
        // 删除成功后刷新列表
        await this.getBooks()
        return 'ok'
      } else {
        throw new Error(res.message || '删除书籍失败')
      }
    },

    /**
     * 推荐书籍（朋友专用）
     * 注意：推荐成功后无需刷新本地列表，因为推荐是待审核状态，不直接展示
     */
    async recommendBook(data: AddBookParams) {
      const res: BookOperationResponse = await reqRecommendBook(data)
      if (res.code === 200) {
        return 'ok'
      } else {
        throw new Error(res.message || '推荐失败')
      }
    }
  }
})
