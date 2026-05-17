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
  reqCheckPhone,
  reqDeactivate,
  reqUploadAvatar,
  reqUpdateProfile,
  reqSendSms
} from '@/api/user'
import { reqGenerateQrSession, reqQrSessionStatus, reqConfirmQrSession } from '@/api/qrlogin'
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
  RegisterByPhoneParams,
  RegisterResponse
} from '@/api/user/type'
import { playBeep } from '@/utils/beep'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: {
      token: GET_TOKEN(),
      userid: 0,
      username: '',
      avatar: '',
      nickname: '',
      role: '',
      permissions: [],
      phone: ''
    },
    securityCheckData: null,
    userCache: {},
    unreadRecNotify: null
  }),
  actions: {
    /**
     * 应用外部获取的 token（如扫码登录成功）
     * 存储到 localStorage，拉取用户信息
     */
    async applyToken(token: string) {
      this.userInfo.token = token
      SET_TOKEN(token)
      try {
        await this.reqUserInfo() // 拉取权限、昵称等
      } catch (e) {
        // 如果拉取失败，清理无效 token
        REMOVE_TOKEN()
        this.$reset()
        throw e
      }
    },
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
        this.userInfo.nickname = user.nickname || user.username
        this.userInfo.phone = user.phone
        this.userInfo.permissions = user.routes
        this.userInfo.role = user.role
        this.userInfo.userid = user.userid
        return res
      } else {
        return Promise.reject(new Error(res.data?.message || '未登录或登录已过期，请重新登录'))
      }
    },
    /**
     * 发送短信验证码（注册/重置密码通用）
     */
    async sendSms(phone: string) {
      const res = await reqSendSms({ phone })
      if (res.code === 200) {
        return res
      } else {
        throw new Error(res.message || '发送失败')
      }
    },

    /**
     * 查询扫码登录状态（轮询用）
     * 返回 { status, token } 或直接抛异常
     */
    async checkQrStatus(sessionId: string): Promise<{ status: string; token?: string }> {
      const res = await reqQrSessionStatus(sessionId)
      if (res.code === 200) {
        return { status: res.status, token: res.token }
      }
      throw new Error((res as any).message || '查询失败')
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
      if (res.code === 200 && res.data) {
        this.userCache[userId] = res.data as any
        return this.userCache[userId]
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
      try {
        const res = await reqResetPassword(data)
        if (res.code === 200) {
          return res
        } else {
          throw new Error(res.message || '重置密码失败')
        }
      } catch (error: any) {
        // 如果是 Axios 错误（如 400），尝试从响应体中提取业务消息
        if (error.response && error.response.data) {
          const biz = error.response.data as { message?: string; code?: number }
          if (biz.message) {
            throw new Error(biz.message)
          }
        }
        // 否则抛出通用错误
        throw new Error(error.message || '重置密码失败')
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
    },
    /**
     * 生成二维码会话ID
     */
    async generateQrSession() {
      const res = await reqGenerateQrSession()
      if (res.code === 200) {
        return res.sessionId
      }
      throw new Error((res as any).message || '生成二维码失败')
    },

    /**
     * 轮询二维码状态，直到登录成功或过期
     * @returns token 或 null
     */
    async pollQrStatus(sessionId: string, maxRetries = 60): Promise<string | null> {
      for (let i = 0; i < maxRetries; i++) {
        const res = await reqQrSessionStatus(sessionId)
        if (res.code === 200) {
          if (res.status === 'CONFIRMED' && res.token) {
            // 登录成功，保存 token
            this.userInfo.token = res.token
            SET_TOKEN(res.token)
            return res.token
          } else if (res.status === 'EXPIRED') {
            return null // 过期
          }
          // 状态为 WAITING，继续等待
        }
        // 等待 2 秒再试
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      return null // 超时
    },
    /**
     * 确认二维码授权（手机端调用）
     */
    async confirmQrSession(sessionId: string) {
      const res = await reqConfirmQrSession(sessionId)
      if (res.code === 200) {
        return res
      } else {
        throw new Error(res.message || '确认失败')
      }
    },
    // 注销账号
    async deactivate() {
      const res = await reqDeactivate()
      if (res.code === 200) {
        REMOVE_TOKEN()
        this.$reset()
        return res
      } else {
        throw new Error(res.message || '注销失败')
      }
    },
    //上传头像
    async uploadAvatar(base64: string) {
      const res = await reqUploadAvatar(base64)
      if (res.code === 200) {
        this.userInfo.avatar = base64
        return res
      } else {
        throw new Error(res.message || '上传失败')
      }
    },
    // 修改资料
    async updateProfile(data: { nickname?: string; avatar?: string; phone?: string }) {
      const res = await reqUpdateProfile(data)
      if (res.code === 200) {
        // 更新本地用户信息
        if (res.data?.nickname) this.userInfo.nickname = res.data.nickname
        if (res.data?.avatar) this.userInfo.avatar = res.data.avatar
        if (res.data?.phone) this.userInfo.phone = res.data.phone
        return res
      } else {
        throw new Error(res.message || '更新失败')
      }
    },

    // 设置未读推荐通知
    // WebSocket 收到审批结果时调用
    setRecNotification(data: { status: string; message: string }) {
      this.unreadRecNotify = { ...data }
      // 播放提示音
      playBeep()
    },

    // 用户点击“我的推荐”后清除未读
    clearRecNotification() {
      this.unreadRecNotify = null
    }
  }
})
