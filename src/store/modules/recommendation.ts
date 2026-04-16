import { defineStore } from 'pinia'
import { reqRecommendationList } from '@/api/recommendation'
import type { RecommendationItem } from '@/api/recommendation/type'

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    recommendationList: [] as RecommendationItem[] // 改为通用列表
  }),
  actions: {
    async fetchList(status?: string) {
      const res = await reqRecommendationList(status || '')
      if (res.code === 200) {
        this.recommendationList = res.data
        return res.data
      } else {
        throw new Error(res.message || '获取推荐列表失败')
      }
    }
  }
})
