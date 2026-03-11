import request from '@/utils/request'
// Ts类型
import type {
  ResponseData,
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  LogoutResponseData,
  UpdatePasswordParams,
  ChangePasswordResponse,
  NoticeListResponse,
  PublishNoticeParams,
  PublishNoticeResponse,
  NicknameResponse
} from './type.ts'

// API
const API = {
  LOGIN_URL: '/api/user/login',
  USERINFO_URL: '/api/user/info',
  LOGOUT_URL: '/api/user/logout',
  CHANGEPASSWORD: '/api/user/change-password',
  GET_NOTICE_LIST: '/api/notice/list',
  PUBLISH_NOTICE: '/api/notice/publish',
  // nickname模块接口
  NICKNAME_LIST: '/api/user/nicknames', // 查
  NICKNAME_ADD: '/api/user/nickname/add', // 增
  NICKNAME_UPDATE: '/api/user/nickname/update', // 改
  NICKNAME_DELETE: '/api/user/nickname/delete' // 删
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

// 修改用户信息接口
export const reqChangePassword = (data: UpdatePasswordParams) =>
  request.post<ChangePasswordResponse, any>(API.CHANGEPASSWORD, data)

// 获取公告列表接口
export const reqNoticeList = () =>
  request.get<NoticeListResponse, any>(API.GET_NOTICE_LIST)

// 发布公告接口
export const reqPublishNotice = (data: PublishNoticeParams) =>
  request.post<PublishNoticeResponse, any>(API.PUBLISH_NOTICE, data)

// nickanem模块
// 获取历史昵称列表接口
// 1. 【查】获取昵称列表（支持搜索关键字）
export const reqGetHistoryNicknames = (keyword?: string) =>
  request.get<NicknameResponse, any>(API.NICKNAME_LIST, { params: { keyword } })

// 2. 【增】新增昵称
export const reqAddNickname = (newName: string) =>
  request.post<ResponseData, any>(API.NICKNAME_ADD, { newName })

// 3. 【改】修改昵称
export const reqUpdateNickname = (oldName: string, newName: string) =>
  request.put<ResponseData, any>(API.NICKNAME_UPDATE, { oldName, newName })

// 4. 【删】删除昵称 (注意：你的 Mock 里是用 query 接收，所以用 params)
export const reqDeleteNickname = (name: string) =>
  request.delete<ResponseData, any>(API.NICKNAME_DELETE, { params: { name } })
