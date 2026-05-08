import { defineStore } from 'pinia'
import { reqGetEmotionList, reqAddEmotion, reqUpdateEmotion, reqDeleteEmotion, reqReplyEmotion } from '@/api/emotion'
import type { EmotionItem } from '@/api/emotion/type'
import { ElMessage } from 'element-plus'

export const useEmotionStore = defineStore('emotion', {
  state: () => ({
    emotionList: [] as EmotionItem[]
  }),
  actions: {
    async getEmotions() {
      const res = await reqGetEmotionList()
      if (res.code === 200) {
        this.emotionList = res.data.items
      } else {
        throw new Error(res.message || '获取失败')
      }
    },
    async addEmotion(content: string, time?: string) {
      const res = await reqAddEmotion({ content, time })
      if (res.code === 200) {
        ElMessage.success('发表成功')
        await this.getEmotions() // 刷新列表
      } else {
        ElMessage.error(res.message || '发表失败')
      }
    },
    async updateEmotion(id: number, content: string) {
      const res = await reqUpdateEmotion(id, { content })
      if (res.code === 200) {
        ElMessage.success('修改成功')
        await this.getEmotions()
      } else {
        ElMessage.error(res.message || '修改失败')
      }
    },
    async deleteEmotion(id: number) {
      const res = await reqDeleteEmotion(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await this.getEmotions()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    },
    async replyEmotion(emotionId: number, content: string) {
      const res = await reqReplyEmotion(emotionId, { content })
      if (res.code === 200) {
        ElMessage.success('回复成功')
        await this.getEmotions()
      } else {
        ElMessage.error(res.message || '回复失败')
      }
    }
  }
})
