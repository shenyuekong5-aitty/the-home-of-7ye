import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { useRouteStore } from './route'
// 假设你还有 permission 和 setting 仓库
import { usePermissionStore } from './permission'
import type {
  UserState,
  LoginParams,
  LoginResponseData,
  UserInfoResponseData,
  LogoutResponseData
} from '@/api/user/type.ts'
export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: {
        token: GET_TOKEN(),
        username: '',
        avatar: '',
        permissions: []
      }
    }
  },
  actions: {
    // 登录函数
    async reqLogin(data: LoginParams) {
      const res: LoginResponseData = await reqLogin(data)
      if (res.code === 200) {
        // 建议：在这里把 token 存入 state 或 localStorage
        this.userInfo.token = res.data.token
        SET_TOKEN(res.data.token as string)
        return res
      } else {
        // 这里的 res.data?.message 对应你 Mock 里的失败信息
        return Promise.reject(new Error(res.data?.message || '登录失败'))
      }
    },
    // 请求用户信息函数
    async reqUserInfo() {
      const res: UserInfoResponseData = await reqUserInfo()
      if (res.code === 200) {
        this.userInfo.username = res.data.user?.username
        this.userInfo.avatar = res.data.user?.avatar
        this.userInfo.permissions = res.data.user?.routes
        return res
      } else {
        return Promise.reject(
          new Error(res.data?.message || '获取用户信息失败')
        )
      }
    },
    // 登出函数
    async logout() {
      const res: LogoutResponseData = await reqLogout()
      if (res.code === 200) {
        // 清空本仓库数据
        // this.userInfo.token = ''
        // this.userInfo.username = ''
        // this.userInfo.avatar = ''
        // this.userInfo.permissions = []
        this.$reset()
        REMOVE_TOKEN()
        // 2. 调用其他仓库的重置
        const routeStore = useRouteStore()
        const permissionStore = usePermissionStore()
        routeStore.$reset()
        permissionStore.$reset()
        location.href = '/login'
        return res
      } else {
        return Promise.reject(new Error(res.data?.message || '登出失败'))
      }
    }
  }
})
