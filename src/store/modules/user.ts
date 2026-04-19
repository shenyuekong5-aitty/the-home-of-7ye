import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqChangePassword, reqLogout, reqSecurityCheck, reqGetUserById } from '@/api/user'
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
  SecurityCheckData
} from '@/api/user/type'

export const useUserStore = defineStore('user', {
  state: (): UserState & { securityCheckData: SecurityCheckData | null; userCache: Record<number, any> } => ({
    userInfo: {
      token: GET_TOKEN(),
      userid: 0,
      username: '',
      avatar: '',
      roles: [],
      permissions: []
    },
    securityCheckData: null,
    userCache: {} // ✅ 独立于 userInfo 的缓存对象
  }),
  actions: {
    async reqLogin(data: LoginParams) {
      const res: LoginResponseData = await reqLogin(data)
      if (res.code === 200) {
        this.userInfo.token = res.data.token
        SET_TOKEN(res.data.token as string)
        return res
      } else {
        return Promise.reject(new Error(res.data?.message || '登录失败'))
      }
    },
    async reqUserInfo() {
      const res: UserInfoResponseData = await reqUserInfo()
      if (res.code === 200) {
        this.userInfo.username = res.data.user?.username
        this.userInfo.avatar = res.data.user?.avatar
        this.userInfo.permissions = res.data.user?.routes
        this.userInfo.roles = res.data.user?.roles
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
      // 先从缓存读取
      if (this.userCache[userId]) return this.userCache[userId]
      const res = await reqGetUserById(userId)
      if (res.code === 200) {
        this.userCache[userId] = res.data
        return res.data
      } else {
        throw new Error(res.message || '获取用户信息失败')
      }
    }
  }
})
