import request from '@/utils/request'
import type { TagResponse, TagOpResponse } from './type'

const API = {
  LIST: '/tag/list',
  ADD: '/tag/add',
  UPDATE: '/tag/update',
  DELETE: '/tag/delete'
}

export const reqGetTagList = () => request.get<TagResponse>(API.LIST)

export const reqAddTag = (data: { content: string }) =>
  request.post<TagOpResponse>(API.ADD, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqUpdateTag = (id: number, data: { content: string }) =>
  request.put<TagOpResponse>(`${API.UPDATE}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqDeleteTag = (id: number) =>
  request.delete<TagOpResponse>(`${API.DELETE}/${id}`, {
    headers: { token: localStorage.getItem('token') || '' }
  })
