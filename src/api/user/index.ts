import request from '@/utils/request'
import type {
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  LogoutResponseData,
  UpdatePasswordParams,
  ChangePasswordResponse
} from './type'

const API = {
  LOGIN: '/api/user/login',
  USER_INFO: '/api/user/info',
  LOGOUT: '/api/user/logout',
  CHANGE_PASSWORD: '/api/user/change-password'
} as const

export const reqLogin = (data: LoginParams) => request.post<LoginResponseData>(API.LOGIN, data)
export const reqUserInfo = () => request.get<UserInfoResponseData>(API.USER_INFO)
export const reqLogout = () => request.post<LogoutResponseData>(API.LOGOUT)
export const reqChangePassword = (data: UpdatePasswordParams) =>
  request.post<ChangePasswordResponse, any>(API.CHANGE_PASSWORD, data)
