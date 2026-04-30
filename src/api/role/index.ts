import request from '@/utils/request'
import type { RoleListResponse } from './type'

export const reqGetRoles = () => request.get<RoleListResponse>('/role/list')
