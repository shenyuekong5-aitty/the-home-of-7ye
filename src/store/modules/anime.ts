import { defineStore } from 'pinia'
import { reqGetAnimeList, reqAddAnime, reqUpdateAnime, reqDeleteAnime, reqRecommendAnime } from '@/api/anime'
import type { AnimeItem, AddAnimeParams, UpdateAnimeParams } from '@/api/anime/type'

export const useAnimeStore = defineStore('anime', {
  state: () => ({
    animeList: [] as AnimeItem[]
  }),
  actions: {
    async getAnimes() {
      const res = await reqGetAnimeList()
      if (res.code === 200) {
        this.animeList = res.data.items
        return 'ok'
      } else {
        throw new Error(res.message || '获取番剧列表失败')
      }
    },

    async addAnime(data: AddAnimeParams) {
      const res = await reqAddAnime(data)
      if (res.code === 200) {
        await this.getAnimes()
        return 'ok'
      } else {
        throw new Error(res.message || '新增失败')
      }
    },

    async updateAnime(data: UpdateAnimeParams) {
      const res = await reqUpdateAnime(data)
      if (res.code === 200) {
        await this.getAnimes()
        return 'ok'
      } else {
        throw new Error(res.message || '编辑失败')
      }
    },

    async deleteAnime(id: number) {
      const res = await reqDeleteAnime(id)
      if (res.code === 200) {
        await this.getAnimes()
        return 'ok'
      } else {
        throw new Error(res.message || '删除失败')
      }
    },

    async recommendAnime(data: AddAnimeParams) {
      const res = await reqRecommendAnime(data)
      if (res.code === 200) {
        return 'ok'
      } else {
        throw new Error(res.message || '推荐失败')
      }
    }
  }
})
