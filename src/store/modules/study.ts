import { defineStore } from 'pinia'
import {
  reqGetStudyList,
  reqGetStudyDetail,
  reqAddStudy,
  reqUpdateStudy,
  reqDeleteStudy,
  reqLikeStudy,
  reqCheckFavorite,
  reqToggleFavorite
} from '@/api/study/index'
import type { StudyItem, AddStudyParams, UpdateStudyParams } from '@/api/study/type'

export const useStudyStore = defineStore('study', {
  state: () => ({
    studyList: [] as StudyItem[],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    currentDetail: null as StudyItem | null
  }),
  actions: {
    /**
     * 获取学习列表
     */
    async getStudyList(pageNo: number = 1, pageSize: number = 10) {
      const res = await reqGetStudyList(pageNo, pageSize)
      if (res.code === 200) {
        this.studyList = res.data.items
        this.total = res.data.total
        this.pageNo = res.data.pageNo
        this.pageSize = res.data.pageSize
        return 'ok'
      } else {
        throw new Error(res.message || '获取学习列表失败')
      }
    },

    /**
     * 获取学习详情
     */
    async getStudyDetail(id: number) {
      const res = await reqGetStudyDetail(id)
      if (res.code === 200) {
        this.currentDetail = res.data
        return res.data
      } else {
        throw new Error(res.message || '获取学习详情失败')
      }
    },

    /**
     * 新增学习条目
     */
    async addStudy(data: AddStudyParams) {
      const res = await reqAddStudy(data)
      if (res.code === 200) {
        await this.getStudyList(1, this.pageSize)
        return 'ok'
      } else {
        throw new Error(res.message || '新增学习条目失败')
      }
    },

    /**
     * 编辑学习条目
     */
    async updateStudy(data: UpdateStudyParams) {
      const res = await reqUpdateStudy(data)
      if (res.code === 200) {
        await this.getStudyList(this.pageNo, this.pageSize)
        if (this.currentDetail?.id === data.id) {
          this.currentDetail = res.data
        }
        return 'ok'
      } else {
        throw new Error(res.message || '编辑学习条目失败')
      }
    },

    /**
     * 删除学习条目
     */
    async deleteStudy(id: number) {
      const res = await reqDeleteStudy(id)
      if (res.code === 200) {
        await this.getStudyList(this.pageNo, this.pageSize)
        if (this.currentDetail?.id === id) {
          this.currentDetail = null
        }
        return 'ok'
      } else {
        throw new Error(res.message || '删除学习条目失败')
      }
    },

    /**
     * 点赞学习条目
     */
    async likeStudy(id: number) {
      const res = await reqLikeStudy(id)
      if (res.code === 200) {
        // 局部更新列表中的点赞数
        const updateLikeCount = (list: StudyItem[]) => {
          const item = list.find(s => s.id === id)
          if (item) {
            item.likeCount++
            return true
          }
          return false
        }
        updateLikeCount(this.studyList)
        if (this.currentDetail?.id === id) {
          this.currentDetail.likeCount++
        }
        return 'ok'
      } else {
        throw new Error(res.message || '点赞失败')
      }
    },

    /**
     * 检查是否已收藏
     */
    async checkFavorite(targetId: number) {
      const res = await reqCheckFavorite('study', targetId)
      if (res.code === 200) {
        return res.data.isFavorited
      } else {
        throw new Error(res.message || '检查收藏状态失败')
      }
    },

    /**
     * 切换收藏状态
     */
    async toggleFavorite(targetId: number) {
      const res = await reqToggleFavorite('study', targetId)
      if (res.code === 200) {
        // 局部更新列表中的收藏数
        const updateFavoriteCount = (list: StudyItem[]) => {
          const item = list.find(s => s.id === targetId)
          if (item) {
            item.favoriteCount += res.data.isFavorited ? 1 : -1
            return true
          }
          return false
        }
        updateFavoriteCount(this.studyList)
        if (this.currentDetail?.id === targetId) {
          this.currentDetail.favoriteCount += res.data.isFavorited ? 1 : -1
        }
        return res.data.isFavorited
      } else {
        throw new Error(res.message || '操作收藏失败')
      }
    }
  }
})
