import request from '@/utils/request'
import type { CreedResponse, CreedOpResponse } from './type'

const API = {
  LIST: '/creed/list',
  ADD: '/creed/add',
  UPDATE: '/creed/update',
  DELETE: '/creed/delete'
}

export const reqGetCreedList = () => request.get<CreedResponse>(API.LIST)

export const reqAddCreed = (data: { content: string }) =>
  request.post<CreedOpResponse>(API.ADD, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqUpdateCreed = (id: number, data: { content: string }) =>
  request.put<CreedOpResponse>(`${API.UPDATE}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqDeleteCreed = (id: number) =>
  request.delete<CreedOpResponse>(`${API.DELETE}/${id}`, {
    headers: { token: localStorage.getItem('token') || '' }
  })
