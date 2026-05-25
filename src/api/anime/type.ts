import type { ResponseData } from '../common/type'

export interface AnimeItem {
  id: number
  name: string
  author: string
  brief: string
  coverImg: string
}

export type AnimeListResponse = ResponseData & {
  data: {
    items: AnimeItem[]
    totalPages: number
    totalElements: number
    currentPage: number
    size: number
  }
}

export interface AddAnimeParams {
  name: string
  author: string
  brief: string
  coverImg: string
}

export interface UpdateAnimeParams extends AddAnimeParams {
  id: number
}

export type AnimeOperationResponse = ResponseData & {
  data: AnimeItem | null
}
