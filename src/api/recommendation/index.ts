import request from '@/utils/request'
import type { RecommendationListResponse } from './type'

const API = {
  PENDING: '/recommendation/pending',
  LIST: '/recommendation/list',
  APPROVE: '/recommendation/approve',
  REJECT: '/recommendation/reject'
} as const

// 获取待审核列表（管理员）
export const reqPendingList = () => request.get<RecommendationListResponse>(API.PENDING)

// 获取推荐列表（可按状态过滤）
export const reqRecommendationList = (status: string = 'approved') =>
  request.get<RecommendationListResponse>(API.LIST, { params: { status } })

// 审核通过
/**
 * 发起审批请求的函数
 * @param id - 需要审批的项目ID
 * @returns 返回一个POST请求的Promise对象
 */
export const reqApprove = (id: number) => request.post(`${API.APPROVE}/${id}`)

// 审核拒绝
export const reqReject = (id: number, comment: string) => request.post(`${API.REJECT}/${id}`, { comment })
