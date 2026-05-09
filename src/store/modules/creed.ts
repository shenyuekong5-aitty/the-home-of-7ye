import { defineStore } from 'pinia'
import { reqGetCreedList, reqAddCreed, reqUpdateCreed, reqDeleteCreed } from '@/api/creed'
import type { CreedItem } from '@/api/creed/type'
import { ElMessage } from 'element-plus'

export const useCreedStore = defineStore('creed', {
  state: () => ({
    creedList: [] as CreedItem[]
  }),
  actions: {
    async getCreeds() {
      const res = await reqGetCreedList()
      if (res.code === 200) {
        this.creedList = res.data.items
      } else {
        throw new Error(res.message)
      }
    },
    async addCreed(content: string) {
      const res = await reqAddCreed({ content })
      if (res.code === 200) {
        ElMessage.success('添加成功')
        await this.getCreeds()
      } else {
        ElMessage.error(res.message)
      }
    },
    async updateCreed(id: number, content: string) {
      const res = await reqUpdateCreed(id, { content })
      if (res.code === 200) {
        ElMessage.success('修改成功')
        await this.getCreeds()
      } else {
        ElMessage.error(res.message)
      }
    },
    async deleteCreed(id: number) {
      const res = await reqDeleteCreed(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await this.getCreeds()
      } else {
        ElMessage.error(res.message)
      }
    }
  }
})
