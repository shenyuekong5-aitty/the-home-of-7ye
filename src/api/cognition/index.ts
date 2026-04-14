import request from '@/utils/request'
import type { CognitionResponse } from './type'

const API = {
  LIST: '/cognition/list'
} as const

export const reqGetCognitionList = () => request.get<CognitionResponse>(API.LIST)
