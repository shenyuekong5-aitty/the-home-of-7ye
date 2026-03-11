/**
 * 通用返回值接口
 */
export interface ResponseData {
  code: number
  data: {
    token?: string
    message?: string
  }
}

/**
 * 用户登录携带的参数
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * 用户登录返回结果数据类型
 */
export type LoginResponseData = ResponseData

/**
 * 用户仓库数据类型 (Store)
 */
export interface UserState {
  userInfo: {
    token: string | undefined | null
    username: string | undefined
    avatar: string | undefined
    permissions: string[] | undefined
    roles: string[] | undefined
  }
}

/**
 * 用户信息对象详细接口
 */
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

/**
 * 获取用户信息接口的返回数据结构
 */
export interface UserInfoResponseData {
  code: number
  data: {
    message?: string
    user?: UserInfo
  }
}

/**
 * Mock 请求对象的 TS 类型
 */
export interface MockRequest {
  headers: {
    token?: string
    [key: string]: any
  }
  body: any
  query: any
}

/**
 * 登出接口返回的数据类型
 */
export type LogoutResponseData = LoginResponseData

/**
 * 修改密码请求参数
 */
export interface UpdatePasswordParams {
  username: string | undefined
  password: string | undefined // 旧密码
  newPassword: string | undefined // 新密码
}

/**
 * 修改密码返回数据
 */
export type ChangePasswordResponse = LoginResponseData

/**
 * 公告项数据类型
 */
export type NoticeItem = {
  id: number
  title: string
  content: string
  publishTime: string
  isImportant: boolean
  publisher: string
}

/**
 * 公告列表查询参数
 */
export interface NoticeListQuery {
  pageSize?: string | number
  pageNo?: string | number
}

/**
 * 公告列表接口返回的数据类型
 */
export interface NoticeListResponse {
  code: number
  data: {
    items: NoticeItem[]
    total: number
    pageSize: number
    pageNo: number
  }
}

/**
 * 发布公告请求参数
 */
export interface PublishNoticeParams {
  title: string
  content: string
  isImportant: boolean
}

/**
 * 发布公告返回值
 */
export type PublishNoticeResponse = ResponseData

/* --- 昵称模块 --- */

/**
 * 历史昵称返回数据类型 (使用交叉类型扩展 data)
 */
export type NicknameResponse = ResponseData & {
  data: {
    nicknames: string[]
  }
}

/**
 * 昵称模块查询参数 (用于模糊搜索和精准删除)
 */
export interface NicknameQuery {
  keyword?: string
  name?: string
}

/**
 * 新增昵称参数
 */
export interface AddNicknameParams {
  newName: string
}

/**
 * 修改昵称参数
 */
export interface UpdateNicknameParams {
  oldName: string
  newName: string
}
