import request from '@/utils/request'
import type {
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  LogoutResponseData,
  UpdatePasswordParams,
  ChangePasswordResponse,
  SecurityCheckResponse,
  UserItem
} from './type'

const API = {
  LOGIN: '/user/login',
  USER_INFO: '/user/info',
  LOGOUT: '/user/logout',
  CHANGE_PASSWORD: '/user/change-password',
  SECURITY_CHECK: '/user/security-check'
} as const

export const reqLogin = (data: LoginParams) => request.post<LoginResponseData>(API.LOGIN, data)
export const reqUserInfo = () => request.get<UserInfoResponseData>(API.USER_INFO)
export const reqLogout = () => request.post<LogoutResponseData>(API.LOGOUT)
export const reqChangePassword = (data: UpdatePasswordParams) =>
  request.post<ChangePasswordResponse>(API.CHANGE_PASSWORD, data)
// 获取账号安全检测结果
export const reqSecurityCheck = () => request.get<SecurityCheckResponse>(API.SECURITY_CHECK)
// 根据id获取用户信息
export const reqGetUserById = (userId: number) => request.get<UserInfoResponseData>(`/user/${userId}`)
// 获取所有用户
export const reqGetUserList = () => request.get<{ code: number; data: UserItem[] }>('/user/list')
// 修改用户角色
export const reqUpdateUserRole = (userId: number, roleId: number) =>
  request.put<{ code: number; message: string }>(`/user/${userId}/role`, { roleId })
