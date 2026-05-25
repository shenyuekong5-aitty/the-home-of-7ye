import { defineStore } from 'pinia'
import { reqGetFriendUsers, reqGetMemories, reqAddMemory, reqDeleteMemory } from '@/api/friend'
import type { FriendUser, FriendMemoryItem } from '@/api/friend/type'
import { ElMessage } from 'element-plus'

// 辅助函数：解析 memoryTime 为 Date 对象
function parseMemoryTime(str: string | undefined): Date | null {
  if (!str) return null

  // 先尝试完整的年月日
  const patterns = [
    /(\d{4})-(\d{1,2})-(\d{1,2})/, // 2024-11-05
    /(\d{4})\/(\d{1,2})\/(\d{1,2})/, // 2024/11/05
    /(\d{4})\.(\d{1,2})\.(\d{1,2})/, // 2024.11.05
    /(\d{4})年(\d{1,2})月(\d{1,2})日/, // 2024年11月5日
    /(\d{4})(\d{2})(\d{2})/ // 20241105
  ]
  for (const pattern of patterns) {
    const match = str.match(pattern)
    if (match) {
      const year = parseInt(match[1]!, 10)
      const month = parseInt(match[2]!, 10) - 1
      const day = parseInt(match[3]!, 10)
      return new Date(year, month, day)
    }
  }

  // 再尝试只有年和月的格式，日默认为1
  const monthOnlyPatterns = [
    /(\d{4})-(\d{1,2})(?!\d)/, // 2024-11 (后面不再跟数字)
    /(\d{4})\/(\d{1,2})(?!\d)/, // 2024/11
    /(\d{4})\.(\d{1,2})(?!\d)/, // 2024.11
    /(\d{4})年(\d{1,2})月(?!\d)/, // 2024年11月
    /(\d{4})(\d{2})(?!\d)/ // 202411 (6位数字)
  ]
  for (const pattern of monthOnlyPatterns) {
    const match = str.match(pattern)
    if (match) {
      const year = parseInt(match[1]!, 10)
      const month = parseInt(match[2]!, 10) - 1
      return new Date(year, month, 1) // 日设为1号
    }
  }

  // 最后只提取年份
  const yearMatch = str.match(/(\d{4})/)
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]!, 10), 0, 1) // 1月1日
  }
  return null
}

export const useFriendStore = defineStore('friend', {
  state: () => ({
    friendUsers: [] as FriendUser[],
    memories: [] as FriendMemoryItem[],
    loading: false,
    // 分页状态
    totalPages: 0,
    currentPage: 0, // 后端 Page 的 index 从 0 开始
    pageSize: 10,
    totalElements: 0
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

    async fetchMemories(partnerId?: number | null, page = 0, size = 10, append = false) {
      this.loading = true
      try {
        const res = await reqGetMemories(partnerId, page, size)
        if (res.code === 200) {
          const list = res.data.items
          // 排序逻辑不变
          list.sort((a, b) => {
            const timeA = a.memoryTime || ''
            const timeB = b.memoryTime || ''
            const dateA = parseMemoryTime(timeA)
            const dateB = parseMemoryTime(timeB)
            if (dateA && dateB) {
              return dateB.getTime() - dateA.getTime()
            } else {
              const yearA = parseInt(timeA.match(/\d{4}/)?.[0] || '0')
              const yearB = parseInt(timeB.match(/\d{4}/)?.[0] || '0')
              return yearB - yearA
            }
          })

          // 根据 append 决定替换还是追加
          if (append) {
            this.memories.push(...list)
          } else {
            this.memories = list
          }

          this.totalPages = res.data.totalPages
          this.currentPage = res.data.currentPage
          this.pageSize = res.data.size
          this.totalElements = res.data.totalElements
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
        // 添加后重新加载第一页
        await this.fetchMemories(data.friendId, 0, this.pageSize)
      } else {
        ElMessage.error(res.message || '添加失败')
      }
    },

    async deleteMemory(memoryId: number) {
      const res = await reqDeleteMemory(memoryId)
      if (res.code === 200) {
        ElMessage.success('回忆已删除')
        // 如果删除后当前页无数据，且不是第一页，回退一页
        if (this.memories.length === 1 && this.currentPage > 0) {
          await this.fetchMemories(undefined, this.currentPage - 1, this.pageSize)
        } else {
          this.memories = this.memories.filter(m => m.id !== memoryId)
        }
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    }
  }
})
