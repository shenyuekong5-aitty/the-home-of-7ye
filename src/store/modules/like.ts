import { defineStore } from 'pinia'
import { reqToggleLike, reqCheckLike } from '@/api/like'

export const useLikeStore = defineStore('like', {
  state: () => ({}),
  actions: {
    async toggleLike(targetType: string, targetId: number) {
      const res = await reqToggleLike(targetType, targetId)
      if (res.code === 200) {
        return res.data.liked
      } else {
        throw new Error(res.message || '操作失败')
      }
    },
    async checkLike(targetType: string, targetId: number) {
      const res = await reqCheckLike(targetType, targetId)
      if (res.code === 200) {
        return res.data.liked
      }
      return false
    }
  }
})
