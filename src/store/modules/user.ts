import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo } from '@/api/user'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
import type {
  UserState,
  LoginParams,
  LoginResponseData,
  UserInfoResponseData
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
    }
  }
})
