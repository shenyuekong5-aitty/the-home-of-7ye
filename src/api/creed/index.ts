import request from '@/utils/request'
import type { CreedResponse } from './type'

const API = {
  LIST: '/api/creed/list'
} as const

export const reqGetCreedList = () => request.get<CreedResponse>(API.LIST)
