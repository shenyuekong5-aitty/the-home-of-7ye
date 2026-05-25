import { defineStore } from 'pinia'
import {
  reqGetCognizeList,
  reqGetCognizeDetail,
  reqAddCognize,
  reqUpdateCognize,
  reqDeleteCognize
} from '@/api/cognize'
import type { CognizeItem, AddCognizeParams, UpdateCognizeParams } from '@/api/cognize/type'

export const useCognizeStore = defineStore('cognize', {
  state: () => ({
    list: [] as CognizeItem[],
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    currentDetail: null as CognizeItem | null
  }),
  actions: {
    async fetchList(pageNo: number = 1, pageSize: number = 10) {
      const res = await reqGetCognizeList(pageNo, pageSize)
      if (res.code === 200) {
        this.list = res.data.items
        this.totalPages = res.data.totalPages
        this.currentPage = res.data.currentPage
        this.pageSize = res.data.size
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
    },

    async add(data: AddCognizeParams) {
      const res = await reqAddCognize(data)
      if (res.code === 200) {
        await this.fetchList(1, this.pageSize)
        return 'ok'
      }
      throw new Error(res.message || '新增认知失败')
    },

    async update(data: UpdateCognizeParams) {
      const res = await reqUpdateCognize(data)
      if (res.code === 200) {
        await this.fetchList(this.currentPage, this.pageSize)
        if (this.currentDetail?.id === data.id) {
          this.currentDetail = res.data
        }
        return 'ok'
      }
      throw new Error(res.message || '修改认知失败')
    },

    async delete(id: number) {
      const res = await reqDeleteCognize(id)
      if (res.code === 200) {
        await this.fetchList(this.currentPage, this.pageSize)
        if (this.currentDetail?.id === id) {
          this.currentDetail = null
        }
        return 'ok'
      }
      throw new Error(res.message || '删除认知失败')
    }
  }
})
