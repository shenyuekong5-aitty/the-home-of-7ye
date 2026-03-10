// 用户登录携带的参数
export interface LoginParams {
  username: string
  password: string
}

// 用户登录返回结果数据类型
export interface LoginResponseData {
  code?: number
  data: {
    token?: string
    message?: string
  }
}
// 用户仓库数据类型
export interface UserState {
  userInfo: {
    token: string | undefined | null
    username: string | undefined
    avatar: string | undefined
    permissions: string[] | undefined
    roles: string[] | undefined
  }
}
// 获取用户信息返回结果数据类型
// 用户信息对象接口
export interface UserInfo {
  userId: number
  avatar: string
  username: string
  password?: string // 密码通常不建议在获取信息接口中返回，可选即可
  desc: string
  roles: string[]
  routes: string[]
  token: string
}

// 获取用户信息接口的返回数据结构
export interface UserInfoResponseData {
  code: number
  data: {
    message?: string
    user?: UserInfo // 直接引用上面的接口
  }
}

// request TS类型
export interface MockRequest {
  headers: {
    token?: string // 这里的 token 是 Mock 逻辑校验的关键
    [key: string]: any
  }
  body?: any
}

// 登出接口返回的数据类型
export type LogoutResponseData = LoginResponseData

// 修改密码请求数据
export interface UpdatePasswordParams {
  username: string | undefined
  password: string | undefined
  newPassword: string | undefined
}
// 修改密码返回数据
export type ChangePasswordResponse = LoginResponseData
