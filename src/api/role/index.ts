import request from '@/utils/request'
import type { RoleListResponse } from './type'

export const reqGetRoles = () => request.get<RoleListResponse>('/role/list')
// src/api/role/index.ts
export const reqAddRole = (name: string, description?: string) => request.post('/role', { name, description })

export const reqUpdateRole = (id: number, name: string, description?: string) =>
  request.put(`/role/${id}`, { name, description })

export const reqDeleteRole = (id: number) => request.delete(`/role/${id}`)
