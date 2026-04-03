import { defineStore } from 'pinia'
import { reqGetTagList } from '@/api/tag/index.ts'
import type { TagItem, TagResponse } from '@/api/tag/type.ts'
export const useTagStore = defineStore('tag', {
  state: () => ({
    tagList: [] as TagItem[]
  }),
  actions: {
    async getTags() {
      const res: TagResponse = await reqGetTagList()
      if (res.code === 200) {
        this.tagList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
