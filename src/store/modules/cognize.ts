import { defineStore } from 'pinia'
import { reqGetCognizeList, reqGetCognizeDetail } from '@/api/cognize'
import type { CognizeItem } from '@/api/cognize/type'

export const useCognizeStore = defineStore('cognize', {
  state: () => ({
    list: [] as CognizeItem[],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    currentDetail: null as CognizeItem | null
  }),
  actions: {
    async fetchList(pageNo: number = 1, pageSize: number = 10) {
      const res = await reqGetCognizeList(pageNo, pageSize)
      if (res.code === 200) {
        this.list = res.data.items
        this.total = res.data.total
        this.pageNo = res.data.pageNo
        this.pageSize = res.data.pageSize
        return 'ok'
      }
      throw new Error(res.message || '获取认知列表失败')
    },
    async fetchDetail(id: number) {
      const res = await reqGetCognizeDetail(id)
      if (res.code === 200) {
        this.currentDetail = res.data
        return res.data
      }
      throw new Error(res.message || '获取认知详情失败')
    }
  }
})
