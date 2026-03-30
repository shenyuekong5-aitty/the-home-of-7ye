import { defineStore } from 'pinia'
import { reqGetHistoryNicknames, reqAddNickname, reqUpdateNickname, reqDeleteNickname } from '@/api/nickname'
import type { NicknameResponse } from '@/api/nickname/type'
import type { ResponseData } from '@/api/common/type' // 统一从 common 导入基础响应类型

export const useNicknameStore = defineStore('nickname', {
  state: () => ({
    list: [] as string[],
    loading: false
  }),
  actions: {
    async getHistoryNicknames(keyword?: string) {
      this.loading = true
      try {
        const res: NicknameResponse = await reqGetHistoryNicknames(keyword)
        if (res.code === 200) {
          this.list = res.data.nicknames
          return this.list
        } else {
          throw new Error('获取昵称列表失败')
        }
      } finally {
        this.loading = false
      }
    },
    async addNickname(newName: string) {
      const res: ResponseData = await reqAddNickname(newName)
      if (res.code === 200) {
        await this.getHistoryNicknames()
        return 'ok'
      } else {
        throw new Error(res.data?.message || '添加失败')
      }
    },
    async updateNickname(oldName: string, newName: string) {
      const res: ResponseData = await reqUpdateNickname(oldName, newName)
      if (res.code === 200) {
        await this.getHistoryNicknames()
        return 'ok'
      } else {
        throw new Error(res.data?.message || '修改失败')
      }
    },
    async removeNickname(name: string) {
      const res: ResponseData = await reqDeleteNickname(name)
      if (res.code === 200) {
        await this.getHistoryNicknames()
        return 'ok'
      } else {
        throw new Error(res.data?.message || '删除失败')
      }
    }
  }
})
