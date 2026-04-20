import request from '@/utils/request'
import type { ToggleFavoriteResponse, CheckFavoriteResponse, FavoriteListResponse } from './type'

const API = {
  TOGGLE: '/favorite/toggle',
  CHECK: '/favorite/check',
  LIST: '/favorite/my',
  ADD: '/favorite/add',
  REMOVE: '/favorite/remove'
} as const

export interface ToggleFavoriteParams {
  targetType: string
  targetId: number
}

export const reqToggleFavorite = (params: ToggleFavoriteParams) =>
  request.post<ToggleFavoriteResponse>(API.TOGGLE, params)

export const reqCheckFavorite = (targetType: string, targetId: number) =>
  request.get<CheckFavoriteResponse>(API.CHECK, { params: { targetType, targetId } })

export const reqGetFavoriteList = (pageNo: number = 1, pageSize: number = 10) =>
  request.get<FavoriteListResponse>(API.LIST, { params: { pageNo, pageSize } })

export const reqAddFavorite = (targetType: string, targetId: number) =>
  request.post<ToggleFavoriteResponse>(API.ADD, { targetType, targetId })

export const reqRemoveFavorite = (targetType: string, targetId: number) =>
  request.delete<ToggleFavoriteResponse>(API.REMOVE, { data: { targetType, targetId } })
