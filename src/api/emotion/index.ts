import request from '@/utils/request'
import type { EmotionListResponse, EmotionFormData, EmotionOpResponse, EmotionDeleteResponse } from './type'

const API = {
  LIST: '/emotion/list',
  ADD: '/emotion/add',
  UPDATE: '/emotion/update', // 后面会拼接 /{id}
  DELETE: '/emotion/delete', // 后面会拼接 /{id}
  REPLY: '/emotion/reply' // 后面会拼接 /{id}
} as const

// 获取情绪列表（公开）
export const reqGetEmotionList = () => request.get<EmotionListResponse>(API.LIST)

// 新增情绪
export const reqAddEmotion = (data: EmotionFormData) =>
  request.post<EmotionOpResponse>(API.ADD, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

// 修改情绪
export const reqUpdateEmotion = (id: number, data: EmotionFormData) =>
  request.put<EmotionOpResponse>(`${API.UPDATE}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

// 删除情绪
export const reqDeleteEmotion = (id: number) =>
  request.delete<EmotionDeleteResponse>(`${API.DELETE}/${id}`, {
    headers: { token: localStorage.getItem('token') || '' }
  })

// 追加回复
export const reqReplyEmotion = (id: number, data: { content: string }) =>
  request.post<EmotionOpResponse>(`${API.REPLY}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })
