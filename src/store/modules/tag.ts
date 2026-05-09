import { defineStore } from 'pinia'
import { reqGetTagList, reqAddTag, reqUpdateTag, reqDeleteTag } from '@/api/tag'
import type { TagItem } from '@/api/tag/type'
import { ElMessage } from 'element-plus'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tagList: [] as TagItem[]
  }),
  actions: {
    async getTags() {
      const res = await reqGetTagList()
      if (res.code === 200) {
        this.tagList = res.data.items
      } else {
        throw new Error(res.message)
      }
    },
    async addTag(content: string) {
      const res = await reqAddTag({ content })
      if (res.code === 200) {
        ElMessage.success('添加成功')
        await this.getTags()
      } else {
        ElMessage.error(res.message)
      }
    },
    async updateTag(id: number, content: string) {
      const res = await reqUpdateTag(id, { content })
      if (res.code === 200) {
        ElMessage.success('修改成功')
        await this.getTags()
      } else {
        ElMessage.error(res.message)
      }
    },
    async deleteTag(id: number) {
      const res = await reqDeleteTag(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await this.getTags()
      } else {
        ElMessage.error(res.message)
      }
    }
  }
})
