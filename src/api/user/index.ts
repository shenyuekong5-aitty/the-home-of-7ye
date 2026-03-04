import request from '@/utils/request'
import type {
  LoginParams,
  LoginResponseData,
  UserInfoResponseData
} from './type.ts'

const API = {
  LOGIN_URL: '/api/user/login',
  USERINFO_URL: '/api/user/info'
} as const

export const reqLogin = (data: LoginParams) =>
  request.post<LoginResponseData, any>(API.LOGIN_URL, data)
export const reqUserInfo = () =>
  request.get<UserInfoResponseData, any>(API.USERINFO_URL)
