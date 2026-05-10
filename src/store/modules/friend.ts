import { defineStore } from 'pinia'
import { reqGetFriendUsers, reqGetMemories, reqAddMemory, reqDeleteMemory } from '@/api/friend'
import type { FriendUser, FriendMemoryItem } from '@/api/friend/type'
import { ElMessage } from 'element-plus'

// 辅助函数：尝试解析 memoryTime 为 Date 对象
// 放在 import 之后、useFriendStore 之前（或 store 文件内部，与 fetchMemories 同级）
function parseMemoryTime(str: string): Date | null {
  if (!str) return null
  if (!str) return null
  // 尝试匹配 YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD, YYYY年MM月DD日, YYYYMMDD
  const patterns = [
    /(\d{4})-(\d{1,2})-(\d{1,2})/, // 2023-05-12
    /(\d{4})\/(\d{1,2})\/(\d{1,2})/, // 2023/05/12
    /(\d{4})\.(\d{1,2})\.(\d{1,2})/, // 2023.05.12
    /(\d{4})年(\d{1,2})月(\d{1,2})日/, // 2023年5月12日
    /(\d{4})(\d{2})(\d{2})/ // 20230512
  ]
  for (const pattern of patterns) {
    const match = str.match(pattern)
    if (match) {
      const year = parseInt(match[1])
      const month = parseInt(match[2]) - 1 // JS Month 0-based
      const day = parseInt(match[3])
      return new Date(year, month, day)
    }
  }
  // 如果只有年份，返回该年1月1日
  const yearMatch = str.match(/(\d{4})/)
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 0, 1)
  }
  return null
}

export const useFriendStore = defineStore('friend', {
  state: () => ({
    friendUsers: [] as FriendUser[],
    memories: [] as FriendMemoryItem[],
    loading: false
  }),
  actions: {
    async fetchFriendUsers() {
      const res = await reqGetFriendUsers()
      if (res.code === 200) {
        this.friendUsers = res.data.items
      } else {
        ElMessage.error(res.message || '获取朋友列表失败')
      }
    },

    async fetchMemories(partnerId?: number | null) {
      this.loading = true
      try {
        const res = await reqGetMemories(partnerId)
        if (res.code === 200) {
          // 获取原始数据
          const list = res.data.items
          // 按 memoryTime 降序排列（新回忆在上），提取年份比较
          list.sort((a, b) => {
            const timeA = a.memoryTime || ''
            const timeB = b.memoryTime || ''

            // 尝试解析为完整日期（支持 YYYY-MM-DD、YYYY/MM/DD、YYYY.MM.DD 等）
            const dateA = parseMemoryTime(timeA)
            const dateB = parseMemoryTime(timeB)

            // 如果都能解析成日期，按日期降序；否则按年份降序
            if (dateA && dateB) {
              return dateB.getTime() - dateA.getTime() // 降序：晚的在前
            } else {
              const yearA = parseInt(timeA.match(/\d{4}/)?.[0] || '0')
              const yearB = parseInt(timeB.match(/\d{4}/)?.[0] || '0')
              return yearB - yearA
            }
          })
          this.memories = list
        } else {
          ElMessage.error(res.message || '获取回忆失败')
        }
      } finally {
        this.loading = false
      }
    },

    async addMemory(data: { friendId: number; title: string; photo: string; description: string; memoryTime: string }) {
      const res = await reqAddMemory(data)
      if (res.code === 200) {
        ElMessage.success('回忆珍藏成功')
        await this.fetchMemories(data.friendId)
      } else {
        ElMessage.error(res.message || '添加失败')
      }
    },

    async deleteMemory(memoryId: number) {
      const res = await reqDeleteMemory(memoryId)
      if (res.code === 200) {
        ElMessage.success('回忆已删除')
        this.memories = this.memories.filter(m => m.id !== memoryId)
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    }
  }
})
