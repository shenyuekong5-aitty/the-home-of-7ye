import { defineStore } from 'pinia'
import { reqIncrementView } from '@/api/view'
import type { ViewIncrementResponse } from '@/api/view/type'

export const useViewStore = defineStore('view', {
  state: () => ({}),
  actions: {
    async incrementView(targetType: string, targetId: number) {
      const res: ViewIncrementResponse = await reqIncrementView(targetType, targetId)
      if (res.code === 200) {
        return res.data?.viewCount ?? null
      } else {
        console.error('增加浏览量失败:', res.message)
        return null
      }
    }
  }
})
