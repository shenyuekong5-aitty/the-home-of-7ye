import { defineStore } from 'pinia'
import { reqGetBookList } from '@/api/book/index.ts'
import type { BookItem, BookResponse } from '@/api/book/type.ts'
export const useBookStore = defineStore('book', {
  state: () => ({
    bookList: [] as BookItem[]
  }),
  actions: {
    async getBooks() {
      const res: BookResponse = await reqGetBookList()
      if (res.code === 200) {
        this.bookList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
