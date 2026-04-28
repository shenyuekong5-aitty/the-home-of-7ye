import { defineStore } from 'pinia'
import { reqToggleLike, reqCheckLike } from '@/api/like'

/**
 * 点赞状态管理 Store
 * 负责与后端点赞接口通信，不保存本地状态，适合实时请求校验的场景
 */
export const useLikeStore = defineStore('like', {
  state: () => ({}), // 无本地状态，每次操作都直接请求后端

  actions: {
    /**
     * 切换点赞状态（点赞/取消点赞）
     * @param targetType - 目标类型，如 'comment'、'study' 等
     * @param targetId   - 目标 ID
     * @returns 最新的点赞状态 (true: 已点赞, false: 未点赞)
     */
    async toggleLike(targetType: string, targetId: number) {
      const res = await reqToggleLike(targetType, targetId)
      if (res.code === 200) {
        return res.data.liked // 后端返回最新的点赞状态
      } else {
        throw new Error(res.message || '操作失败')
      }
    },

    /**
     * 检查当前用户是否已对目标点赞
     * @param targetType - 目标类型
     * @param targetId   - 目标 ID
     * @returns 点赞状态 (true/false)
     */
    async checkLike(targetType: string, targetId: number) {
      const res = await reqCheckLike(targetType, targetId)
      if (res.code === 200) {
        return res.data.liked
      }
      return false // 请求失败或无数据时默认未点赞
    }
  }
})
