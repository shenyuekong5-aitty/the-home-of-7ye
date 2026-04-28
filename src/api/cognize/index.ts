import request from '@/utils/request'
import type { CognizeListResponse, CognizeDetailResponse } from './type'

const API = {
  LIST: '/cognize/list',
  DETAIL: '/cognize'
} as const

/**
 * 获取认知列表（分页）
 */
export const reqGetCognizeList = (pageNo: number = 1, pageSize: number = 10) =>
  request.get<CognizeListResponse>(API.LIST, { params: { pageNo, pageSize } })

/**
 * 获取认知详情
 */
export const reqGetCognizeDetail = (id: number) => request.get<CognizeDetailResponse>(`${API.DETAIL}/${id}`)
