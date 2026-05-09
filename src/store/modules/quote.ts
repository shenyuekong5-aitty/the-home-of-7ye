import { defineStore } from 'pinia'
import { reqGetQuoteList, reqAddQuote, reqUpdateQuote, reqDeleteQuote } from '@/api/quote'
import type { QuoteItem } from '@/api/quote/type'
import { ElMessage } from 'element-plus'

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    quoteList: [] as QuoteItem[]
  }),
  actions: {
    async getQuotes() {
      const res = await reqGetQuoteList()
      if (res.code === 200) {
        this.quoteList = res.data.items
        return 'ok'
      } else {
        throw new Error(res.message)
      }
    },
    async addQuote(content: string) {
      const res = await reqAddQuote({ content })
      if (res.code === 200) {
        ElMessage.success('添加成功')
        await this.getQuotes()
      } else {
        ElMessage.error(res.message)
      }
    },
    async updateQuote(id: number, content: string) {
      const res = await reqUpdateQuote(id, { content })
      if (res.code === 200) {
        ElMessage.success('修改成功')
        await this.getQuotes()
      } else {
        ElMessage.error(res.message)
      }
    },
    async deleteQuote(id: number) {
      const res = await reqDeleteQuote(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await this.getQuotes()
      } else {
        ElMessage.error(res.message)
      }
    }
  }
})
