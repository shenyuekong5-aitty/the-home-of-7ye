import { defineStore } from 'pinia'
import { reqGetGameList } from '@/api/game/index.ts'
import type { GameItem, GameResponse } from '@/api/game/type.ts'
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
        throw new Error()
      }
    }
  }
})
