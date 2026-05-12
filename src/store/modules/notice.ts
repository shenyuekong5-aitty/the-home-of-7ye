import { defineStore } from 'pinia'
import { reqNoticeList, reqAddNotice, reqUpdateNotice, reqDeleteNotice } from '@/api/notice'
import type { NoticeItem, NoticeFormParams } from '@/api/notice/type'
import { ElMessage } from 'element-plus'

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    list: [] as NoticeItem[],
    loading: false
  }),
  actions: {
    /**
     * 获取公告列表
     */
    async getNoticeList() {
      this.loading = true
      try {
        const res = await reqNoticeList()
        if (res.code === 200) {
          this.list = res.data.items
          return this.list
        } else {
          throw new Error(res.message || '获取公告列表失败')
        }
      } catch (e: any) {
        ElMessage.error(e.message || '获取公告列表失败')
        throw e
      } finally {
        this.loading = false
      }
    },

    /**
     * 新增公告
     */
    async addNotice(data: NoticeFormParams) {
      const res = await reqAddNotice(data)
      if (res.code === 200) {
        ElMessage.success('公告发布成功')
        await this.getNoticeList()
      } else {
        ElMessage.error(res.message || '发布失败')
        throw new Error(res.message)
      }
    },

    /**
     * 编辑公告
     */
    async updateNotice(id: number, data: NoticeFormParams) {
      const res = await reqUpdateNotice(id, data)
      if (res.code === 200) {
        ElMessage.success('公告修改成功')
        await this.getNoticeList()
      } else {
        ElMessage.error(res.message || '修改失败')
        throw new Error(res.message)
      }
    },

    /**
     * 删除公告
     */
    async deleteNotice(id: number) {
      const res = await reqDeleteNotice(id)
      if (res.code === 200) {
        ElMessage.success('公告已删除')
        await this.getNoticeList()
      } else {
        ElMessage.error(res.message || '删除失败')
        throw new Error(res.message)
      }
    }
  }
})
