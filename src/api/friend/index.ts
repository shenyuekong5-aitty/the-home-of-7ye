import request from '@/utils/request'
import type { FriendUsersResponse, MemoryListResponse, OperationResponse } from './type'

const BASE = '/friend'

// 获取所有朋友用户（管理员用）
export const reqGetFriendUsers = () => request.get<FriendUsersResponse>(`${BASE}/users`)

// 获取专属回忆（partnerId 可选）
export const reqGetMemories = (partnerId?: number | null, page = 0, size = 10) =>
  request.get<MemoryListResponse>(`${BASE}/memory`, {
    params: partnerId ? { partnerId, page, size } : { page, size },
    timeout: 30000 // 给记忆接口更长的超时
  })

// 添加回忆
export const reqAddMemory = (data: {
  friendId: number
  title: string
  photo: string
  description: string
  memoryTime: string
}) => request.post<OperationResponse>(`${BASE}/memory`, data)

// 删除回忆
export const reqDeleteMemory = (memoryId: number) => request.delete<OperationResponse>(`${BASE}/memory/${memoryId}`)
