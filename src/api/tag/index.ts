import request from '@/utils/request'
import type { TagResponse } from './type'

const API = {
  LIST: '/tag/list'
} as const

export const reqGetTagList = () => request.get<TagResponse>(API.LIST)
