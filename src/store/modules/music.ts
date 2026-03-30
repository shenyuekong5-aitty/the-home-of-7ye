import { defineStore } from 'pinia'
import { reqGetMusicList } from '@/api/music/index'
import type { musicItem, MusicResponse } from '@/api/music/type'

export const useMusicStore = defineStore('music', {
  state: () => ({
    musicList: [] as musicItem[]
  }),
  actions: {
    async getMusics() {
      const res: MusicResponse = await reqGetMusicList()
      if (res.code === 200) {
        this.musicList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
