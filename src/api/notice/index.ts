import request from '@/utils/request'
import type { NoticeListResponse, NoticeFormParams, NoticeOpResponse } from './type'

const API = {
  LIST: '/notice/list',
  ADD: '/notice/add',
  UPDATE: '/notice/update', // 后面拼 ID
  DELETE: '/notice/delete' // 后面拼 ID
} as const

// 获取公告列表
export const reqNoticeList = () => request.get<NoticeListResponse>(API.LIST)

// 新增公告
export const reqAddNotice = (data: NoticeFormParams) =>
  request.post<NoticeOpResponse>(API.ADD, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

// 编辑公告
export const reqUpdateNotice = (id: number, data: NoticeFormParams) =>
  request.put<NoticeOpResponse>(`${API.UPDATE}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

// 删除公告
export const reqDeleteNotice = (id: number) =>
  request.delete<NoticeOpResponse>(`${API.DELETE}/${id}`, {
    headers: { token: localStorage.getItem('token') || '' }
  })
