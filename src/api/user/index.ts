import request from '@/utils/request'
import type {
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  UpdatePasswordParams,
  ChangePasswordResponse,
  LogoutResponseData,
  SecurityCheckResponse,
  RegisterByPhoneParams,
  RegisterResponse,
  UserItem,
  DeactivateResponse
} from './type'

const API = {
  LOGIN: '/user/login',
  USER_INFO: '/user/info',
  LOGOUT: '/user/logout',
  CHANGE_PASSWORD: '/user/change-password',
  SECURITY_CHECK: '/user/security-check',
  REGISTER_BY_PHONE: '/user/register-by-phone'
} as const

export const reqLogin = (data: LoginParams) => request.post<LoginResponseData>(API.LOGIN, data)
export const reqUserInfo = () => request.get<UserInfoResponseData>(API.USER_INFO)
export const reqLogout = () => request.post<LogoutResponseData>(API.LOGOUT)
export const reqChangePassword = (data: UpdatePasswordParams) =>
  request.post<ChangePasswordResponse>(API.CHANGE_PASSWORD, data)
export const reqSecurityCheck = () => request.get<SecurityCheckResponse>(API.SECURITY_CHECK)
export const reqGetUserById = (userId: number) => request.get<UserInfoResponseData>(`/user/${userId}`)

/** 发送短信验证码 */
export const reqSendSms = (data: { phone: string }) => request.post('/sms/send', data)

/** 手机号注册（含账号、密码、昵称） */
export const reqRegisterByPhone = (data: RegisterByPhoneParams) =>
  request.post<RegisterResponse>(API.REGISTER_BY_PHONE, data)

export const reqResetPassword = (data: { phone: string; code: string; newPassword: string }) =>
  request.post('/user/reset-password', data)

//** 检查手机号是否已注册 */
export const reqCheckPhone = (phone: string) => request.get('/user/check-phone', { params: { phone } })

/** 获取用户列表（用于用户管理页） */
export const reqGetUserList = () => request.get<{ code: number; data: UserItem[] }>('/user/list')

/** 修改用户角色 */
export const reqUpdateUserRole = (userId: number, roleId: number) => request.put(`/user/${userId}/role`, { roleId })

/**
 * 注销当前账号
 */
export const reqDeactivate = () => request.post<DeactivateResponse>('/user/deactivate')

//上传头像
export const reqUploadAvatar = (avatar: string) => request.post('/user/avatar', { avatar })
