import request from '@/utils/request'
import type { CategoryListResponse } from './type'

const BASE = '/study/category'

// 获取分类列表（可选 parentId，不传返回一级分类）
export const reqGetCategories = (parentId?: number) =>
  request.get<CategoryListResponse>(`${BASE}/list`, { params: { parentId } })
