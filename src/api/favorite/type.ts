import type { ResponseData } from '../common/type'

export type ToggleFavoriteResponse = ResponseData & {
  data: { isFavorited: boolean }
}

export type CheckFavoriteResponse = ResponseData & {
  data: { isFavorited: boolean }
}

export interface FavoriteItem {
  id: number
  targetType: string
  targetId: number
  createTime: string
}

export type FavoriteListResponse = ResponseData & {
  data: {
    items: FavoriteItem[]
    total: number
    pageNo: number
    pageSize: number
  }
}
