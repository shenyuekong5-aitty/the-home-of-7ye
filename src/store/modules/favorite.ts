import { defineStore } from 'pinia'
import {
  reqToggleFavorite,
  reqCheckFavorite,
  reqGetFavoriteList,
  reqAddFavorite,
  reqRemoveFavorite
} from '@/api/favorite/index'
import type { ToggleFavoriteResponse, CheckFavoriteResponse, FavoriteListResponse } from '@/api/favorite/type.ts'
import { ElMessage } from 'element-plus'

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favoriteCache: {} as Record<string, boolean>
  }),
  actions: {
    async toggleFavorite(targetType: string, targetId: number): Promise<boolean> {
      const res: ToggleFavoriteResponse = await reqToggleFavorite({ targetType, targetId })
      if (res.code === 200) {
        const isFavorited = res.data.isFavorited
        this.favoriteCache[`${targetType}_${targetId}`] = isFavorited
        ElMessage.success(isFavorited ? '收藏成功' : '已取消收藏')
        return isFavorited
      } else {
        ElMessage.error(res.message || '操作失败')
        throw new Error(res.message || '操作失败')
      }
    },

    async checkFavorite(targetType: string, targetId: number): Promise<boolean> {
      const cacheKey = `${targetType}_${targetId}`
      const res: CheckFavoriteResponse = await reqCheckFavorite(targetType, targetId)
      if (res.code === 200) {
        const isFavorited = res.data.isFavorited
        this.favoriteCache[cacheKey] = isFavorited
        return isFavorited
      } else {
        console.error('检查收藏状态失败:', res.message)
        return false
      }
    },

    async batchCheckFavorite(targetType: string, targetIds: number[]): Promise<Record<number, boolean>> {
      const results: Record<number, boolean> = {}
      await Promise.all(
        targetIds.map(async id => {
          results[id] = await this.checkFavorite(targetType, id)
        })
      )
      return results
    },

    async getFavoriteList(pageNo: number = 1, pageSize: number = 10) {
      const res: FavoriteListResponse = await reqGetFavoriteList(pageNo, pageSize)
      if (res.code === 200) return res.data
      else throw new Error(res.message || '获取收藏列表失败')
    },

    async addFavorite(targetType: string, targetId: number) {
      const res = await reqAddFavorite(targetType, targetId)
      if (res.code === 200) {
        this.favoriteCache[`${targetType}_${targetId}`] = true
        return true
      } else {
        throw new Error(res.message || '添加收藏失败')
      }
    },

    async removeFavorite(targetType: string, targetId: number) {
      const res = await reqRemoveFavorite(targetType, targetId)
      if (res.code === 200) {
        this.favoriteCache[`${targetType}_${targetId}`] = false
        return true
      } else {
        throw new Error(res.message || '取消收藏失败')
      }
    },

    clearCache() {
      this.favoriteCache = {}
    }
  }
})
