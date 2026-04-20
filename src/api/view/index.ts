import request from '@/utils/request'
import type { ViewIncrementResponse } from './type'

const API = {
  ADD: '/view/add' // 改为通用路径
} as const

export const reqIncrementView = (targetType: string, targetId: number) =>
  request.post<ViewIncrementResponse>(API.ADD, { targetType, targetId })
