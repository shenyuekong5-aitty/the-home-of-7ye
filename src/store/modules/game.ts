import { defineStore } from 'pinia'
import { reqGetGameList, reqAddGame, reqUpdateGame, reqDeleteGame } from '@/api/game/index.ts'
import type { GameItem, GameResponse, GameFormData, GameOpResponse } from '@/api/game/type.ts'
import { ElMessage } from 'element-plus'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameList: [] as GameItem[]
  }),
  actions: {
    async getGames() {
      const res: GameResponse = await reqGetGameList()
      if (res.code === 200) {
        this.gameList = res.data.items
        return 'ok'
      } else {
        throw new Error(res.message || '获取游戏列表失败')
      }
    },

    async addGame(data: GameFormData) {
      const res: GameOpResponse = await reqAddGame(data)
      if (res.code === 200) {
        ElMessage.success('添加成功')
        await this.getGames() // 刷新列表
        return 'ok'
      } else {
        ElMessage.error(res.message || '添加失败')
        throw new Error(res.message)
      }
    },

    async updateGame(id: number, data: GameFormData) {
      const res: GameOpResponse = await reqUpdateGame(id, data)
      if (res.code === 200) {
        ElMessage.success('修改成功')
        await this.getGames()
        return 'ok'
      } else {
        ElMessage.error(res.message || '修改失败')
        throw new Error(res.message)
      }
    },

    async deleteGame(id: number) {
      const res: GameOpResponse = await reqDeleteGame(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await this.getGames()
        return 'ok'
      } else {
        ElMessage.error(res.message || '删除失败')
        throw new Error(res.message)
      }
    }
  }
})
