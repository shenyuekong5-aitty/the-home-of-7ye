import { defineStore } from 'pinia'
import {
  reqLogin,
  reqUserInfo,
  reqChangePassword,
  reqLogout,
  reqNoticeList,
  reqGetHistoryNicknames,
  reqAddNickname,
  reqUpdateNickname,
  reqDeleteNickname
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
  NoticeListResponse,
  NicknameResponse,
  ResponseData
} from '@/api/user/type.ts'
export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: {
        token: GET_TOKEN(),
        username: '',
        avatar: '',
        roles: [],
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
        this.userInfo.roles = res.data.user?.roles
        return res
      } else {
        return Promise.reject(
          new Error(res.data?.message || '获取用户信息失败')
        )
      }
    },
    // 登出函数
    // store/modules/user.ts
    async logout() {
      try {
        const res: LogoutResponseData = await reqLogout()
        if (res.code === 200) {
          // 1. 先清除持久化的 Token (确保守卫能识别到无登录状态)
          REMOVE_TOKEN()

          // 2. 直接执行跳转
          // 这里的 router 是从 @/router 导入的实例
          await router.push('/login')

          // 3. 跳转指令发出后，再清理内存状态
          // 顺序很重要：先离场，再拆台
          this.$reset()
          useRouteStore().$reset()
          usePermissionStore().$reset()

          return res
        } else {
          return Promise.reject(new Error(res.data?.message || '登出失败'))
        }
      } catch (error) {
        // 即使接口报错，也要强制清理并跳回登录
        REMOVE_TOKEN()
        this.$reset()
        // 强制刷新页面到登录页是解决跳转失败的“大招”
        window.location.href = '/login'
        return Promise.reject(error)
      }
    },
    // 修改密码函数
    // store/modules/user.ts
    async changePassword(data: UpdatePasswordParams) {
      try {
        const res: ChangePasswordResponse = await reqChangePassword(data)
        if (res.code === 200) {
          // 成功直接返回，不需要额外处理
          return 'ok'
        } else {
          // 这里的错误会被组件里的 try...catch 捕获
          return Promise.reject(new Error(res.data.message || '修改失败'))
        }
      } catch (error: any) {
        // 这里的 error 可能是请求拦截器抛出的，也可能是网络错误
        return Promise.reject(error)
      }
    },
    // 获取公共列表
    async getNoticeList() {
      const res: NoticeListResponse = await reqNoticeList()
      if (res.code === 200) {
        console.log(11, res)

        return res.data.items
      } else {
        return Promise.reject(new Error('获取公告列表失败'))
      }
    },
    // nickanme模块
    async getHistoryNicknames(keyword?: string) {
      const res: NicknameResponse = await reqGetHistoryNicknames(keyword)
      if (res.code === 200) {
        return res.data.nicknames
      } else {
        return Promise.reject(new Error('获取昵称列表失败'))
      }
    },
    // 增
    async addNickname(newName: string) {
      const res: ResponseData = await reqAddNickname(newName)
      return res.code === 200 ? 'ok' : res.data.message
    },
    // 改
    async updateNickname(oldName: string, newName: string) {
      const res: ResponseData = await reqUpdateNickname(oldName, newName)
      return res.code === 200 ? 'ok' : res.data.message
    },
    // 删
    async removeNickname(name: string) {
      const res: ResponseData = await reqDeleteNickname(name)
      return res.code === 200 ? 'ok' : res.data.message
    }
  }
})
