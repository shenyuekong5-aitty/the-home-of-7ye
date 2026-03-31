import { defineStore } from 'pinia'
import { reqGetAnimeList } from '@/api/anime/index.ts'
import type { AnimeItem, AnimeResponse } from '@/api/anime/type.ts'
export const useAnimeStore = defineStore('anime', {
  state: () => ({
    animeList: [] as AnimeItem[]
  }),
  actions: {
    async getAnimes() {
      const res: AnimeResponse = await reqGetAnimeList()
      if (res.code === 200) {
        this.animeList = res.data.items
        return 'ok'
      } else {
        throw new Error()
      }
    }
  }
})
