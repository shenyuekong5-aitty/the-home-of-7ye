import { defineStore } from 'pinia'
import { reqGetCategories } from '@/api/category'
import type { CategoryItem } from '@/api/category/type'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    parentCategories: [] as CategoryItem[], // 一级分类
    allCategories: [] as CategoryItem[] // 所有分类（含二级）
  }),
  actions: {
    async fetchAllCategories() {
      try {
        const parentRes = await reqGetCategories()
        this.parentCategories = parentRes.data
        // 获取所有二级分类
        const childPromises = this.parentCategories.map(p => reqGetCategories(p.id))
        const childResults = await Promise.all(childPromises)
        this.allCategories = []
        childResults.forEach(res => {
          if (res.data) this.allCategories.push(...res.data)
        })
      } catch {
        // 静默失败，可加 ElMessage 提示
      }
    }
  }
})
