import { defineStore } from 'pinia'
import { reqGetAnimeList, reqAddAnime, reqUpdateAnime, reqDeleteAnime, reqRecommendAnime } from '@/api/anime'
import type { AnimeItem, AddAnimeParams, UpdateAnimeParams } from '@/api/anime/type'

export const useAnimeStore = defineStore('anime', {
  state: () => ({
    animeList: [] as AnimeItem[],
    // 分页状态
    totalPages: 0,
    currentPage: 0, // 后端 Page 从 0 开始
    pageSize: 10,
    totalElements: 0
  }),
  actions: {
    async getAnimes(page = 0, size = 10) {
      const res = await reqGetAnimeList(page, size)
      if (res.code === 200) {
        this.animeList = res.data.items
        this.totalPages = res.data.totalPages
        this.currentPage = res.data.currentPage
        this.pageSize = res.data.size
        this.totalElements = res.data.totalElements
        return 'ok'
      } else {
        throw new Error(res.message || '获取番剧列表失败')
      }
    },

    async addAnime(data: AddAnimeParams) {
      const res = await reqAddAnime(data)
      if (res.code === 200) {
        // 新增后回到第一页
        await this.getAnimes(0, this.pageSize)
        return 'ok'
      } else {
        throw new Error(res.message || '新增失败')
      }
    },

    async updateAnime(data: UpdateAnimeParams) {
      const res = await reqUpdateAnime(data)
      if (res.code === 200) {
        // 更新后保持当前页
        await this.getAnimes(this.currentPage, this.pageSize)
        return 'ok'
      } else {
        throw new Error(res.message || '编辑失败')
      }
    },

    async deleteAnime(id: number) {
      const res = await reqDeleteAnime(id)
      if (res.code === 200) {
        // 删除后保持当前页（如果当前页空了会自动显示前一页）
        await this.getAnimes(this.currentPage, this.pageSize)
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
