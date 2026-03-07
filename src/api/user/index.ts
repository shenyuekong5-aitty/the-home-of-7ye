import request from '@/utils/request'
// Ts类型
import type {
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  LogoutResponseData
} from './type.ts'

// API
const API = {
  LOGIN_URL: '/api/user/login',
  USERINFO_URL: '/api/user/info',
  LOGOUT_URL: '/api/user/logout'
} as const

/**
 * 登录接口
 * @param data 登录参数
 * @returns 登录结果
 */
export const reqLogin = (data: LoginParams) =>
  request.post<LoginResponseData, any>(API.LOGIN_URL, data)

/**
 * 获取用户信息接口
 * @returns 用户信息
 */
export const reqUserInfo = () =>
  request.get<UserInfoResponseData, any>(API.USERINFO_URL)

// 登出接口
export const reqLogout = () =>
  request.post<LogoutResponseData, any>(API.LOGOUT_URL)
