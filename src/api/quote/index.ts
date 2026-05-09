import request from '@/utils/request'
import type { QuoteResponse, QuoteOpResponse } from './type'

const API = {
  LIST: '/quote/list',
  ADD: '/quote/add',
  UPDATE: '/quote/update',
  DELETE: '/quote/delete'
}

// 原有获取列表
export const reqGetQuoteList = () => request.get<QuoteResponse>(API.LIST)

// 新增
export const reqAddQuote = (data: { content: string }) =>
  request.post<QuoteOpResponse>(API.ADD, data, { headers: { token: localStorage.getItem('token') } })

// 更新
export const reqUpdateQuote = (id: number, data: { content: string }) =>
  request.put<QuoteOpResponse>(`${API.UPDATE}/${id}`, data, { headers: { token: localStorage.getItem('token') } })

// 删除
export const reqDeleteQuote = (id: number) =>
  request.delete<QuoteOpResponse>(`${API.DELETE}/${id}`, { headers: { token: localStorage.getItem('token') } })
