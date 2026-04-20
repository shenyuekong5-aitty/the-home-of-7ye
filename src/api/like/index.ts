import request from '@/utils/request'
import type { LikeToggleResponse, LikeCheckResponse } from './type'

const API = {
  TOGGLE: '/like/toggle',
  CHECK: '/like/check'
} as const

export const reqToggleLike = (targetType: string, targetId: number) =>
  request.post<LikeToggleResponse>(API.TOGGLE, { targetType, targetId })

export const reqCheckLike = (targetType: string, targetId: number) =>
  request.get<LikeCheckResponse>(API.CHECK, { params: { targetType, targetId } })
