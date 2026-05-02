import { defineStore } from 'pinia'
import {
  reqLogin,
  reqUserInfo,
  reqChangePassword,
  reqLogout,
  reqSecurityCheck,
  reqGetUserById,
  reqRegisterByPhone,
  reqResetPassword,
  reqCheckPhone
} from '@/api/user'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { useRouteStore } from './route'
import { usePermissionStore } from './permission'
import router from '@/router'
import type {
  UserState,
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  UpdatePasswordParams,
  ChangePasswordResponse,
  LogoutResponseData,
  SecurityCheckData,
  RegisterByPhoneParams,
  RegisterResponse
} from '@/api/user/type'

export const useUserStore = defineStore('user', {
  state: (): UserState & { securityCheckData: SecurityCheckData | null; userCache: Record<number, any> } => ({
    userInfo: {
      token: GET_TOKEN(),
      userid: 0,
      username: '',
      avatar: '',
      nickname: '',
      role: '',
      permissions: []
    },
    securityCheckData: null,
    userCache: {}
  }),
  actions: {
    async reqLogin(data: LoginParams) {
      const res: LoginResponseData = await reqLogin(data)
      if (res.code === 200) {
        this.userInfo.token = res.data!.token!
        SET_TOKEN(res.data!.token!)
        return res
      } else {
        return Promise.reject(new Error(res.data?.message || '登录失败'))
      }
    },
    async reqUserInfo() {
      const res: UserInfoResponseData = await reqUserInfo()
      if (res.code === 200 && res.data.user) {
        const user = res.data.user
        this.userInfo.username = user.username
        this.userInfo.avatar = user.avatar
        this.userInfo.nickname = user.nickname || user.username // 新增
        this.userInfo.permissions = user.routes
        this.userInfo.role = user.role
        return res
      } else {
        return Promise.reject(new Error(res.data?.message || '获取用户信息失败'))
      }
    },
    async logout() {
      try {
        const res: LogoutResponseData = await reqLogout()
        if (res.code === 200) {
          REMOVE_TOKEN()
          await router.push('/login')
          this.$reset()
          useRouteStore().$reset()
          usePermissionStore().$reset()
          return res
        } else {
          return Promise.reject(new Error(res.data?.message || '登出失败'))
        }
      } catch (error) {
        REMOVE_TOKEN()
        this.$reset()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    },
    async changePassword(data: UpdatePasswordParams) {
      try {
        const res: ChangePasswordResponse = await reqChangePassword(data)
        if (res.code === 200) {
          return 'ok'
        } else {
          return Promise.reject(new Error(res.data.message || '修改失败'))
        }
      } catch (error: any) {
        return Promise.reject(error)
      }
    },
    async getSecurityCheck() {
      try {
        const res = await reqSecurityCheck()
        if (res.code === 200) {
          this.securityCheckData = res.data
          return res.data
        } else {
          return Promise.reject(new Error(res.message || '获取安全检测失败'))
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getUserById(userId: number) {
      if (this.userCache[userId]) return this.userCache[userId]
      const res: UserInfoResponseData = await reqGetUserById(userId)
      if (res.code === 200 && res.data.user) {
        this.userCache[userId] = res.data.user
        return res.data.user
      } else {
        throw new Error(res.message || '获取用户信息失败')
      }
    },
    async registerByPhone(data: RegisterByPhoneParams) {
      const res: RegisterResponse = await reqRegisterByPhone(data)
      if (res.code === 200) {
        if (res.data?.token) {
          this.userInfo.token = res.data.token
          SET_TOKEN(res.data.token)
        }
        return res
      } else {
        throw new Error(res.message || '注册失败')
      }
    },
    // 重置密码
    async resetPassword(data: { phone: string; code: string; newPassword: string }) {
      const res = await reqResetPassword(data)
      if (res.code === 200) {
        return res
      } else {
        throw new Error(res.message || '重置密码失败')
      }
    },
    // 检查手机号是否已注册
    async checkPhone(phone: string) {
      const res = await reqCheckPhone(phone)
      if (res.code === 200) {
        return res.data.exists // 返回 true/false
      } else {
        throw new Error(res.message || '检查失败')
      }
    }
  }
})
