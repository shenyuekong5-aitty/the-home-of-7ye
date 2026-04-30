import { defineStore } from 'pinia'
import { reqGetStudyList, reqGetStudyDetail, reqAddStudy, reqUpdateStudy, reqDeleteStudy } from '@/api/study/index'
import type { StudyItem, AddStudyParams, UpdateStudyParams } from '@/api/study/type'

export const useStudyStore = defineStore('study', {
  state: () => ({
    studyList: [] as StudyItem[],
    total: 0,
    pageNo: 1,
    pageSize: 10,
    currentDetail: null as StudyItem | null,
    templateType: ''
  }),
  actions: {
    /**
     * 获取学习列表
     */

    async getStudyList(pageNo: number = 1, pageSize: number = 10, categoryIds?: number[], parentCategoryId?: number) {
      const res = await reqGetStudyList(pageNo, pageSize, categoryIds, parentCategoryId)
      if (res.code === 200) {
        this.studyList = res.data.items
        this.total = res.data.total
        this.pageNo = res.data.pageNo
        this.pageSize = res.data.pageSize
        this.templateType = res.data.templateType
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
    }
  }
})
