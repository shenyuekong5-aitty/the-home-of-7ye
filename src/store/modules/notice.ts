import { defineStore } from 'pinia'
import { reqNoticeList } from '@/api/notice'
import type { NoticeListResponse } from '@/api/notice/type'

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    list: [] as any[], // 可替换为 NoticeItem[]
    loading: false
  }),
  actions: {
    async getNoticeList() {
      this.loading = true
      try {
        const res: NoticeListResponse = await reqNoticeList()
        if (res.code === 200) {
          this.list = res.data.items
          return this.list
        } else {
          throw new Error('获取公告列表失败')
        }
      } finally {
        this.loading = false
      }
    }
  }
})
