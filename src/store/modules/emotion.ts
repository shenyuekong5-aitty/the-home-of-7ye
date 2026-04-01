import { defineStore } from 'pinia'
import { reqGetEmotionList } from '@/api/emotion/index.ts'
import type { EmotionItem, EmotionResponse } from '@/api/emotion/type.ts'
export const useEmotionStore = defineStore('emotion', {
  state: () => ({
    emotionList: [] as EmotionItem[]
  }),
  actions: {
    async getEmotions() {
      const res: EmotionResponse = await reqGetEmotionList()
      if (res.code === 200) {
        this.emotionList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
