import { defineStore } from 'pinia'
import { reqGetCognitionList } from '@/api/cognition/index.ts'
import type { CognitionItem, CognitionResponse } from '@/api/cognition/type.ts'
export const useCognitionStore = defineStore('cognition', {
  state: () => ({
    cognitionList: [] as CognitionItem[]
  }),
  actions: {
    async getCognitions() {
      const res: CognitionResponse = await reqGetCognitionList()
      if (res.code === 200) {
        this.cognitionList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
