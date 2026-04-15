import type { ResponseData } from '../common/type'

export interface LoginParams {
  username: string
  password: string
}

export type LoginResponseData = ResponseData

export interface UserState {
  userInfo: {
    token: string | undefined | null
    userid: number | undefined | null
    username: string | undefined
    avatar: string | undefined
    permissions: string[] | undefined
    roles: string[] | undefined
  }
}

export interface UserInfo {
  userId: number
  avatar: string
  username: string
  password?: string
  desc: string
  roles: string[]
  routes: string[]
  token: string
}

export interface UserInfoResponseData {
  code: number
  data: {
    message?: string
    user?: UserInfo
  }
}

export type LogoutResponseData = LoginResponseData

export interface UpdatePasswordParams {
  username: string | undefined
  oldPassword: string
  newPassword: string | undefined
}

export type ChangePasswordResponse = LoginResponseData

export interface MockRequest {
  headers: { token?: string; [key: string]: any }
  body: any
  query: any
}

// 安全检测单项
export interface SecurityCheckItem {
  id: string // 检测项标识：pwd, role, route, info
  label: string // 显示名称
  result: string // 检测结果描述
  status: 'success' | 'warning' | 'error'
}

// 安全检测响应数据
export interface SecurityCheckData {
  score: number // 总分（0-100）
  items: SecurityCheckItem[] // 检测项列表
  message: string // 整体评价消息
}

// 安全检测接口响应体
export interface SecurityCheckResponse {
  code: number
  data: SecurityCheckData
  message?: string
}
