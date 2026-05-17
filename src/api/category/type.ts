export interface CategoryItem {
  id: number
  name: string
  parentId: number | null
}

export interface CategoryListResponse {
  code: number
  data: CategoryItem[]
  message?: string
}
