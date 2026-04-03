import { defineStore } from 'pinia'
import { reqGetCreedList } from '@/api/creed/index.ts'
import type { CreedItem, CreedResponse } from '@/api/creed/type.ts'
export const useCreedStore = defineStore('creed', {
  state: () => ({
    creedList: [] as CreedItem[]
  }),
  actions: {
    async getCreeds() {
      const res: CreedResponse = await reqGetCreedList()
      if (res.code === 200) {
        this.creedList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
