import type { ResponseData } from '../common/type'

export interface LoginParams {
  username: string
  password: string
}

export type LoginResponseData = ResponseData & {
  data?: {
    token: string
  }
}

export interface UserInfo {
  userId: number
  avatar: string
  username: string
  nickname?: string // 新增
  password?: string
  desc: string
  role: string
  routes: string[]
  token: string
}

export interface UserInfoResponseData {
  code: number
  message?: string
  data: {
    message?: string
    user?: UserInfo
  }
}

export interface UserState {
  userInfo: {
    token: string | undefined | null
    userid: number | undefined | null
    username: string | undefined
    avatar: string | undefined
    nickname?: string // 新增
    permissions: string[] | undefined
    role: string | undefined
  }
}

export interface UpdatePasswordParams {
  username: string | undefined
  oldPassword: string
  newPassword: string | undefined
}

export type ChangePasswordResponse = LoginResponseData

export type LogoutResponseData = LoginResponseData

export interface SecurityCheckItem {
  id: string
  label: string
  result: string
  status: 'success' | 'warning' | 'error'
}

export interface SecurityCheckData {
  score: number
  items: SecurityCheckItem[]
  message: string
}

export interface SecurityCheckResponse {
  code: number
  data: SecurityCheckData
  message?: string
}

export interface RegisterByPhoneParams {
  username: string
  phone: string
  code: string
  password?: string
  nickname?: string
}

export interface RegisterResponse {
  code: number
  data?: {
    token?: string
    userId?: number
  }
  message?: string
}
//  UserItem 接口
export interface UserItem {
  id: number
  username: string
  avatar: string
  role: string
  roleId: number | null
}
