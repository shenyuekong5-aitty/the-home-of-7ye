import { defineStore } from 'pinia'
import {
  reqGetTagList,
  reqAddTag,
  reqUpdateTag,
  reqDeleteTag,
  reqExportTags,
  reqImportTags,
  reqDownloadTemplate
} from '@/api/tag'
import type { TagItem } from '@/api/tag/type'
import { ElMessage } from 'element-plus'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tagList: [] as TagItem[]
  }),
  actions: {
    // 获取标签列表
    async getTags() {
      const res = await reqGetTagList()
      if (res.code === 200) {
        this.tagList = res.data.items
      } else {
        throw new Error(res.message)
      }
    },

    // 新增标签
    async addTag(content: string) {
      const res = await reqAddTag({ content })
      if (res.code === 200) {
        ElMessage.success('添加成功')
        await this.getTags()
      } else {
        ElMessage.error(res.message)
      }
    },

    // 修改标签
    async updateTag(id: number, content: string) {
      const res = await reqUpdateTag(id, { content })
      if (res.code === 200) {
        ElMessage.success('修改成功')
        await this.getTags()
      } else {
        ElMessage.error(res.message)
      }
    },

    // 删除标签
    async deleteTag(id: number) {
      const res = await reqDeleteTag(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await this.getTags()
      } else {
        ElMessage.error(res.message)
      }
    },

    // ========== Excel 导出 ==========
    async exportExcel() {
      try {
        const res = await reqExportTags()
        // 响应拦截器对 blob 返回完整 response 对象，res.data 才是 Blob
        const blob = res.data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = '标签列表.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        ElMessage.success('导出成功')
      } catch {
        ElMessage.error('导出失败')
      }
    },

    // ========== Excel 导入 ==========
    async importExcel(file: File) {
      try {
        const res = await reqImportTags(file)
        if (res.code === 200) {
          await this.getTags()
          return res.data // 返回处理结果（total, successCount, failCount, failDetails）
        } else {
          ElMessage.error(res.message || '导入失败')
          return null
        }
      } catch {
        ElMessage.error('导入请求失败')
        return null
      }
    },

    // ========== 下载导入模板 ==========
    async downloadTemplate() {
      try {
        const res = await reqDownloadTemplate()
        const blob = res.data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = '标签导入模板.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        ElMessage.success('模板下载成功')
      } catch {
        ElMessage.error('模板下载失败')
      }
    }
  }
})
