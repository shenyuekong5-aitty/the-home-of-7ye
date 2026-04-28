import request from '@/utils/request'

const API = '/study/category/list'

export interface CategoryItem {
  id: number
  name: string
  parentId: number | null
}

/** 获取分类列表，可选 parentId，不传返回一级分类 */
export const reqGetCategories = (parentId?: number) =>
  request.get<{ code: number; data: CategoryItem[] }>(API, { params: { parentId } })
