import request from '@/utils/request'
import type { NicknameResponse } from './type'
import type { ResponseData } from '../common/type'

const API = {
  LIST: '/api/user/nicknames',
  ADD: '/api/user/nickname/add',
  UPDATE: '/api/user/nickname/update',
  DELETE: '/api/user/nickname/delete'
} as const

export const reqGetHistoryNicknames = (keyword?: string) =>
  request.get<NicknameResponse>(API.LIST, { params: { keyword } })

export const reqAddNickname = (newName: string) => request.post<ResponseData>(API.ADD, { newName })

export const reqUpdateNickname = (oldName: string, newName: string) =>
  request.put<ResponseData>(API.UPDATE, { oldName, newName })

export const reqDeleteNickname = (name: string) => request.delete<ResponseData>(API.DELETE, { params: { name } })
