import request from '@/utils/request'
import type { AnimeListResponse, AnimeOperationResponse, AddAnimeParams, UpdateAnimeParams } from './type'

const API = {
  LIST: '/anime/list',
  ADD: '/anime/add',
  UPDATE: '/anime/update',
  DELETE: '/anime/delete',
  RECOMMEND: '/recommendation/submit' // 统一推荐接口
} as const

export const reqGetAnimeList = (page = 0, size = 10) =>
  request.get<AnimeListResponse>(API.LIST, { params: { page, size }, timeout: 15000 })

export const reqAddAnime = (data: AddAnimeParams) => request.post<AnimeOperationResponse>(API.ADD, data)

export const reqUpdateAnime = (data: UpdateAnimeParams) => request.put<AnimeOperationResponse>(API.UPDATE, data)

export const reqDeleteAnime = (id: number) => request.delete<AnimeOperationResponse>(`${API.DELETE}/${id}`)

export const reqRecommendAnime = (data: AddAnimeParams) => {
  const payload = {
    type: 'anime',
    content: data
  }
  return request.post<AnimeOperationResponse>(API.RECOMMEND, payload)
}
