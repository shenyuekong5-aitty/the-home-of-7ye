import request from '@/utils/request'
// Ts类型
import type {
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
  // 添加其他接口
  GET_HISTORY_NICKNAMES: '/api/user/nicknames'
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

// 获取历史昵称列表接口
export const reqGetHistoryNicknames = () =>
  request.get<NicknameResponse, any>(API.GET_HISTORY_NICKNAMES)
