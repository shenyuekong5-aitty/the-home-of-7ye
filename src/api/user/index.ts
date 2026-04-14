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
  LOGIN: '/user/login',
  USER_INFO: '/user/info',
  LOGOUT: '/user/logout',
  CHANGE_PASSWORD: '/user/change-password'
} as const

export const reqLogin = (data: LoginParams) => request.post<LoginResponseData>(API.LOGIN, data)
export const reqUserInfo = () => request.get<UserInfoResponseData>(API.USER_INFO)
export const reqLogout = () => request.post<LogoutResponseData>(API.LOGOUT)
export const reqChangePassword = (data: UpdatePasswordParams) =>
  request.post<ChangePasswordResponse>(API.CHANGE_PASSWORD, data)
