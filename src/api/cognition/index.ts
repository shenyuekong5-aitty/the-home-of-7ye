import request from '@/utils/request'
import type { CognitionResponse } from './type'

const API = {
  LIST: '/api/cognition/list'
} as const

export const reqGetCognitionList = () => request.get<CognitionResponse>(API.LIST)
