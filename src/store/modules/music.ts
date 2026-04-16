import { defineStore } from 'pinia'
import { reqGetMusicList, reqAddMusic, reqUpdateMusic, reqDeleteMusic, reqRecommendMusic } from '@/api/music/index'
import type { MusicItem, AddMusicParams, UpdateMusicParams } from '@/api/music/type'

export const useMusicStore = defineStore('music', {
  state: () => ({
    musicList: [] as MusicItem[]
  }),
  actions: {
    async getMusics() {
      const res = await reqGetMusicList()
      if (res.code === 200) {
        this.musicList = res.data.items
        return 'ok'
      } else {
        throw new Error(res.message || '获取列表失败')
      }
    },

    async addMusic(data: AddMusicParams) {
      const res = await reqAddMusic(data)
      if (res.code === 200) {
        await this.getMusics()
        return 'ok'
      } else {
        throw new Error(res.message || '新增失败')
      }
    },

    async updateMusic(data: UpdateMusicParams) {
      const res = await reqUpdateMusic(data)
      if (res.code === 200) {
        await this.getMusics()
        return 'ok'
      } else {
        throw new Error(res.message || '编辑失败')
      }
    },

    async deleteMusic(id: number) {
      const res = await reqDeleteMusic(id)
      if (res.code === 200) {
        await this.getMusics()
        return 'ok'
      } else {
        throw new Error(res.message || '删除失败')
      }
    },

    async recommendMusic(data: AddMusicParams) {
      const res = await reqRecommendMusic(data)
      if (res.code === 200) {
        return 'ok'
      } else {
        throw new Error(res.message || '推荐失败')
      }
    }
  }
})
