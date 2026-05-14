import { defineStore } from 'pinia'
import { reqRecommendationList, reqApprove, reqReject, reqGetMyRecommendations } from '@/api/recommendation'
import type { RecommendationItem } from '@/api/recommendation/type'
import { ElMessage } from 'element-plus'
import { playBeep } from '@/utils/beep'

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    recommendationList: [] as RecommendationItem[],
    unreadRecNotify: null as { status: string; message: string } | null
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
    },

    // 审核通过
    async approve(id: number) {
      try {
        const res = await reqApprove(id)
        if (res.code === 200) {
          ElMessage.success('审核通过，已收录')
          // 刷新列表
          await this.fetchList()
          return true
        } else {
          ElMessage.error(res.message || '审核失败')
          return false
        }
      } catch (err: any) {
        ElMessage.error(err.message || '请求异常')
        return false
      }
    },

    // 审核拒绝
    async reject(id: number, comment: string) {
      try {
        const res = await reqReject(id, comment)
        if (res.code === 200) {
          ElMessage.success('已拒绝该推荐')
          await this.fetchList()
          return true
        } else {
          ElMessage.error(res.message || '操作失败')
          return false
        }
      } catch (err: any) {
        ElMessage.error(err.message || '请求异常')
        return false
      }
    },

    // 获取我的推荐列表
    async fetchMyList() {
      const res = await reqGetMyRecommendations()
      if (res.code === 200) {
        return res.data // 返回列表数组
      } else {
        throw new Error(res.message || '获取推荐列表失败')
      }
    }
  }
})
