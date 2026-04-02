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
  password: string | undefined
  newPassword: string | undefined
}

export type ChangePasswordResponse = LoginResponseData

export interface MockRequest {
  headers: { token?: string; [key: string]: any }
  body: any
  query: any
}
