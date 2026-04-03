import { defineStore } from 'pinia'
import { reqGetQuoteList } from '@/api/quote/index.ts'
import type { QuoteItem, QuoteResponse } from '@/api/quote/type.ts'
export const useQuoteStore = defineStore('quote', {
  state: () => ({
    quoteList: [] as QuoteItem[]
  }),
  actions: {
    async getQuotes() {
      const res: QuoteResponse = await reqGetQuoteList()
      if (res.code === 200) {
        this.quoteList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
