<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="card-header">
        <h2 class="title">欢迎登录</h2>
        <p class="subtitle">我是小烨，很高兴你能来看我!</p>
      </div>

      <!-- 登录方式切换 -->
      <div class="login-tabs">
        <el-radio-group v-model="loginMode" size="small">
          <el-radio-button value="password">账号登录</el-radio-button>
          <el-radio-button value="qrcode">扫码登录</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 密码登录表单 -->
      <el-form
        v-if="loginMode === 'password'"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名或手机号" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>

      <!-- 扫码登录区域 -->
      <div v-if="loginMode === 'qrcode'" class="qr-login-area">
        <div class="qr-code-wrapper" ref="qrCodeRef">
          <!-- 二维码由 JS 动态生成到这里 -->
        </div>
        <p class="qr-tip">
          <template v-if="qrStatus === 'WAITING'">
            <el-icon class="is-loading"><Loading /></el-icon>
            请使用已登录的手机浏览器扫描二维码
          </template>
          <template v-else-if="qrStatus === 'EXPIRED'">
            二维码已过期，
            <el-link type="primary" @click="refreshQrCode">点击刷新</el-link>
          </template>
          <template v-else-if="qrStatus === 'CONFIRMED'">
            <el-icon color="#67c23a"><CircleCheck /></el-icon>
            登录成功，正在跳转...
          </template>
        </p>
      </div>

      <!-- 底部链接（仅密码登录时显示） -->
      <div v-if="loginMode === 'password'" class="footer-links">
        <el-link type="primary" underline="never" @click="openForgotDialog">忘记密码？</el-link>
        <el-link type="primary" underline="never" @click="openRegisterDialog">注册账号</el-link>
      </div>
    </el-card>

    <!-- 注册弹窗：账号 + 密码 + 昵称(可选) + 手机号 + 验证码 -->
    <el-dialog v-model="registerDialogVisible" title="注册新账号" width="400px" center>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请设置登录账号（字母+数字）" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请设置登录密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="起个喜欢的昵称" clearable />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" @blur="validatePhone" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="15">
              <el-input
                v-model="registerForm.code"
                placeholder="请输入验证码"
                clearable
                @keyup.enter="handleRegister"
              />
            </el-col>
            <el-col :span="9">
              <el-button type="primary" :disabled="sendDisabled" @click="sendSmsCode" style="width: 100%">
                {{ sendBtnText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="registerLoading" @click="handleRegister" class="register-btn">
            立即注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 忘记密码弹窗 -->
    <el-dialog v-model="forgotDialogVisible" title="重置密码" width="400px" center>
      <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules" label-width="0">
        <el-form-item prop="phone">
          <el-input v-model="forgotForm.phone" @blur="checkPhoneExists" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="15">
              <el-input v-model="forgotForm.code" placeholder="请输入验证码" clearable />
            </el-col>
            <el-col :span="9">
              <el-button :disabled="forgotSendDisabled" @click="sendForgotCode" style="width: 100%">
                {{ forgotSendBtnText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="forgotForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="forgotForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="forgotLoading" @click="handleForgot" class="register-btn">
            重置密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 手机扫码后的授权结果界面 -->
    <div v-if="qrConfirmStatus !== 'idle'" class="qr-result-overlay">
      <div class="qr-result-card">
        <el-icon v-if="qrConfirmStatus === 'success'" color="#67c23a" :size="60">
          <CircleCheck />
        </el-icon>
        <el-icon v-else color="#f56c6c" :size="60">
          <CircleClose />
        </el-icon>
        <h2 style="margin-top: 20px">
          {{ qrConfirmStatus === 'success' ? '授权成功' : '授权失败' }}
        </h2>
        <p style="color: #909399; margin-top: 10px">
          {{ qrConfirmStatus === 'success' ? 'PC端即将自动登录，您可以关闭此页面了' : '请刷新二维码后重试' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onBeforeUnmount, nextTick, watch, onMounted } from 'vue'
  import { User, Lock, Loading, CircleCheck, CircleClose } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { useRouter, useRoute } from 'vue-router'
  import { reqSendSms } from '@/api/user'
  import { reqQrSessionStatus, reqConfirmQrSession } from '@/api/qrlogin' // 移除未使用的 reqGenerateQrSession
  import QRCode from 'qrcode'

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()

  // ========== 登录方式切换 ==========
  const loginMode = ref<'password' | 'qrcode'>('password')

  // ========== 密码登录部分 ==========
  const loginForm = reactive({ username: '', password: '' })

  const loginRules = reactive({
    username: [
      { required: true, message: '请输入用户名或手机号', trigger: 'blur' },
      { min: 5, max: 15, message: '用户名长度为5-15个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 18, message: '密码长度为6-18个字符', trigger: 'blur' }
    ]
  })

  const loginFormRef = ref<FormInstance | null>(null)
  const loading = ref(false)

  // 待确认的 sessionId
  const pendingSessionId = ref<string | null>(null)

  // 密码登录
  const handleLogin = () => {
    loginFormRef.value!.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          await userStore.reqLogin(loginForm)

          // 如果存在待确认的 sessionId，自动确认后停留在当前页
          if (pendingSessionId.value) {
            try {
              await reqConfirmQrSession(pendingSessionId.value)
              pendingSessionId.value = null
              ElMessage.success('登录成功，已授权PC端')
              qrConfirmStatus.value = 'success'
            } catch (e: any) {
              pendingSessionId.value = null
              qrConfirmStatus.value = 'idle'
              const errMsg = e?.response?.data?.message || e.message || '授权失败，请重试'
              ElMessage.error(errMsg)
            }
            return // 授权任务完成后结束
          }

          // 普通登录：跳转首页
          router.push('/')
          ElMessage.success('登录成功！')
        } catch (error: any) {
          const errMsg = error?.response?.data?.message || error.message || '系统错误'
          ElMessage.error(errMsg)
        } finally {
          loading.value = false
        }
      } else {
        ElMessage.warning('请完整填写登录信息！')
      }
    })
  }

  // ========== 扫码登录部分 ==========
  const qrCodeRef = ref<HTMLDivElement | null>(null)
  const qrStatus = ref<'WAITING' | 'CONFIRMED' | 'EXPIRED'>('WAITING')
  let currentSessionId = ''
  let qrTimer: ReturnType<typeof setInterval> | null = null // 可中断的定时器

  // 手机扫码确认后的状态
  const qrConfirmStatus = ref<'idle' | 'success' | 'failed'>('idle')

  // 生成二维码
  const generateQrCode = async () => {
    try {
      stopPolling() // 先停止旧的轮询
      if (qrCodeRef.value) qrCodeRef.value.innerHTML = ''
      qrStatus.value = 'WAITING'

      // 使用 store 生成 sessionId（无需直接调用 API）
      const sessionId = await userStore.generateQrSession()
      currentSessionId = sessionId

      const pcIp = '10.96.235.201'
      const qrUrl = `http://${pcIp}:5173/#/login?qr=${sessionId}`

      await nextTick()
      if (qrCodeRef.value) {
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, qrUrl, {
          width: 180,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' }
        })
        qrCodeRef.value.appendChild(canvas)
      }

      startPolling()
    } catch (e) {
      ElMessage.error('生成二维码失败')
    }
  }

  // 开始轮询（可中断）
  const startPolling = () => {
    stopPolling() // 确保只有一个定时器
    qrTimer = setInterval(async () => {
      try {
        const res = await reqQrSessionStatus(currentSessionId)
        if (res.status === 'CONFIRMED' && res.token) {
          stopPolling()
          qrStatus.value = 'CONFIRMED'
          localStorage.setItem('TOKEN', res.token)
          userStore.userInfo.token = res.token
          setTimeout(() => {
            router.push('/')
            ElMessage.success('登录成功！')
          }, 1000)
        } else if (res.status === 'EXPIRED') {
          stopPolling()
          qrStatus.value = 'EXPIRED'
          drawExpiredOverlay()
        }
      } catch (e) {
        // 网络错误静默处理，继续轮询
      }
    }, 2000) // 每 2 秒轮询一次
  }

  // 停止轮询
  const stopPolling = () => {
    if (qrTimer) {
      clearInterval(qrTimer)
      qrTimer = null
    }
  }

  // 绘制过期蒙版
  const drawExpiredOverlay = () => {
    if (!qrCodeRef.value) return
    qrCodeRef.value.innerHTML = ''
    const canvas = document.createElement('canvas')
    canvas.width = 180
    canvas.height = 180
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.fillRect(0, 0, 180, 180)
    ctx.strokeStyle = '#909399'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(90, 75, 20, -0.5 * Math.PI, 1.5 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = '#909399'
    ctx.beginPath()
    ctx.moveTo(105, 58)
    ctx.lineTo(110, 50)
    ctx.lineTo(118, 58)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#909399'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('二维码已过期', 90, 120)
    ctx.fillText('点击刷新', 90, 142)
    qrCodeRef.value.appendChild(canvas)
  }

  // 刷新二维码
  const refreshQrCode = () => {
    qrStatus.value = 'WAITING'
    generateQrCode()
  }

  // 监听登录模式切换，停止轮询或生成二维码
  watch(loginMode, newMode => {
    if (newMode === 'qrcode') {
      nextTick(() => generateQrCode())
    } else {
      stopPolling() // 切换到其他模式时停止轮询
      qrStatus.value = 'WAITING'
    }
  })

  // ========== 页面加载时检测 ?qr 参数（手机端自动确认） ==========
  onMounted(async () => {
    const qrParam = route.query.qr as string

    if (qrParam) {
      pendingSessionId.value = qrParam

      if (userStore.userInfo.token) {
        try {
          await reqConfirmQrSession(qrParam)
          ElMessage.success('已授权PC端登录')
          qrConfirmStatus.value = 'success'
          pendingSessionId.value = null
        } catch (e: any) {
          // ✅ 失败时重置遮罩状态，并跳转到普通登录页
          qrConfirmStatus.value = 'idle'
          ElMessage.error('授权失败，请重新登录')
          // 清除 qr 参数，避免再次进入授权逻辑
          router.replace('/login')
        }
        return
      } else {
        ElMessage.warning('请先登录，登录后自动授权')
        loginMode.value = 'password'
        return
      }
    }

    if (userStore.userInfo.token) {
      router.push('/')
    }
  })

  // ========== 注册部分 ==========
  const registerDialogVisible = ref(false)
  const registerFormRef = ref<FormInstance | null>(null)
  const registerLoading = ref(false)

  const registerForm = reactive({
    username: '',
    password: '',
    nickname: '',
    phone: '',
    code: ''
  })

  const registerRules = reactive({
    username: [
      { required: true, message: '请设置账号', trigger: 'blur' },
      { pattern: /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/, message: '字母开头，4-20位字母/数字/下划线', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请设置密码', trigger: 'blur' },
      { min: 6, max: 18, message: '密码长度为6-18个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { min: 4, max: 6, message: '验证码为4-6位', trigger: 'blur' }
    ]
  })

  const sendDisabled = ref(false)
  const sendBtnText = ref('获取验证码')
  let timer: ReturnType<typeof setTimeout> | null = null

  const validatePhone = async () => {
    const phone = registerForm.phone
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      sendDisabled.value = true
      return
    }
    try {
      const exists = await userStore.checkPhone(phone)
      if (exists) {
        ElMessage.warning('该手机号已注册，可以直接登录')
        sendDisabled.value = true
      } else {
        sendDisabled.value = false
      }
    } catch (e) {
      sendDisabled.value = true
    }
  }

  const sendSmsCode = async () => {
    if (!registerForm.phone) {
      ElMessage.warning('请先输入手机号码')
      return
    }
    sendDisabled.value = true
    try {
      await reqSendSms({ phone: registerForm.phone })
      ElMessage.success('验证码已发送')
      let countdown = 60
      sendBtnText.value = `${countdown}s`
      timer = setInterval(() => {
        countdown--
        sendBtnText.value = `${countdown}s`
        if (countdown <= 0) {
          clearInterval(timer!)
          sendDisabled.value = false
          sendBtnText.value = '重新获取'
        }
      }, 1000)
    } catch (err: any) {
      ElMessage.error(err.message || '发送失败')
      sendDisabled.value = false
    }
  }

  const handleRegister = () => {
    registerFormRef.value!.validate(async (valid: boolean) => {
      if (valid) {
        registerLoading.value = true
        try {
          await userStore.registerByPhone({
            username: registerForm.username,
            phone: registerForm.phone,
            code: registerForm.code,
            password: registerForm.password,
            nickname: registerForm.nickname || undefined
          })
          registerDialogVisible.value = false
          ElMessage.success('注册成功，请使用账号和密码登录')
        } catch (error: any) {
          const msg = error?.response?.data?.message || error.message || '注册失败'
          ElMessage.error(msg)
        } finally {
          registerLoading.value = false
        }
      }
    })
  }

  const openRegisterDialog = () => {
    registerForm.username = ''
    registerForm.password = ''
    registerForm.nickname = ''
    registerForm.phone = ''
    registerForm.code = ''
    registerFormRef.value?.resetFields()
    registerDialogVisible.value = true
  }

  // ========== 忘记密码部分 ==========
  const forgotDialogVisible = ref(false)
  const forgotFormRef = ref<FormInstance | null>(null)
  const forgotLoading = ref(false)

  const forgotForm = reactive({
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })

  const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
    if (value !== forgotForm.newPassword) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }

  const forgotRules = reactive({
    phone: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { min: 4, max: 6, message: '验证码为4-6位', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 18, message: '密码长度为6-18个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入新密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'blur' }
    ]
  })

  const forgotSendDisabled = ref(false)
  const forgotSendBtnText = ref('获取验证码')
  let forgotTimer: ReturnType<typeof setTimeout> | null = null

  const checkPhoneExists = async () => {
    const phone = forgotForm.phone
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      forgotSendDisabled.value = true
      return
    }
    try {
      const exists = await userStore.checkPhone(phone)
      if (!exists) {
        ElMessage.warning('该手机号未注册，请先注册')
        forgotSendDisabled.value = true
      } else {
        forgotSendDisabled.value = false
      }
    } catch (e) {
      forgotSendDisabled.value = true
    }
  }

  const sendForgotCode = async () => {
    if (!forgotForm.phone) {
      ElMessage.warning('请先输入手机号码')
      return
    }
    forgotSendDisabled.value = true
    try {
      await reqSendSms({ phone: forgotForm.phone })
      ElMessage.success('验证码已发送')
      let countdown = 60
      forgotSendBtnText.value = `${countdown}s`
      forgotTimer = setInterval(() => {
        countdown--
        forgotSendBtnText.value = `${countdown}s`
        if (countdown <= 0) {
          clearInterval(forgotTimer!)
          forgotSendDisabled.value = false
          forgotSendBtnText.value = '重新获取'
        }
      }, 1000)
    } catch (err: any) {
      ElMessage.error(err.message || '发送失败')
      forgotSendDisabled.value = false
    }
  }

  const handleForgot = () => {
    forgotFormRef.value!.validate(async (valid: boolean) => {
      if (valid) {
        forgotLoading.value = true
        try {
          await userStore.resetPassword({
            phone: forgotForm.phone,
            code: forgotForm.code,
            newPassword: forgotForm.newPassword
          })
          forgotDialogVisible.value = false
          ElMessage.success('密码重置成功，请登录')
        } catch (err: any) {
          ElMessage.error(err.message || '重置失败')
        } finally {
          forgotLoading.value = false
        }
      }
    })
  }

  const openForgotDialog = () => {
    forgotForm.phone = ''
    forgotForm.code = ''
    forgotForm.newPassword = ''
    forgotForm.confirmPassword = ''
    forgotFormRef.value?.resetFields()
    forgotDialogVisible.value = true
  }

  // ========== 清除所有定时器 ==========
  onBeforeUnmount(() => {
    stopPolling()
    if (timer) clearInterval(timer)
    if (forgotTimer) clearInterval(forgotTimer)
  })
</script>
<style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #e0f2f7 0%, #bbdefb 100%);
    font-family: 'Arial', sans-serif;
  }
  .login-card {
    width: 90%;
    max-width: 400px;
    padding: 30px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    text-align: center;
    background-color: #ffffff;
  }
  .card-header {
    margin-bottom: 20px;
  }
  .title {
    font-size: 28px;
    color: #333;
    margin-bottom: 0;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-top: 8px;
  }

  /* 登录方式切换 */
  .login-tabs {
    margin-bottom: 20px;
  }

  .login-form {
    margin-top: 10px;
  }

  /* 扫码登录区域 */
  .qr-login-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 10px;
  }
  .qr-code-wrapper {
    width: 180px;
    height: 180px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
  }
  .qr-tip {
    font-size: 13px;
    color: #909399;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .el-input {
    height: 45px;
    font-size: 16px;
    border-radius: 8px;
    --el-input-border-radius: 8px;
    --el-input-hover-border-color: #409eff;
  }
  :deep(.el-input__prefix .el-icon) {
    color: #666;
  }
  .login-button {
    width: 100%;
    height: 48px;
    font-size: 18px;
    border-radius: 8px;
    background-color: #409eff;
    border-color: #409eff;
    margin-top: 10px;
    letter-spacing: 2px;
  }
  .login-button:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
  .footer-links {
    margin-top: 25px;
    display: flex;
    justify-content: space-around;
    font-size: 14px;
  }
  .el-link {
    color: #409eff;
  }
  .el-link:hover {
    color: #66b1ff;
  }
  .register-btn {
    width: 100%;
  }
  /* 用户扫码登陆后移动端的页面 */
  .qr-result-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .qr-result-card {
    text-align: center;
    padding: 40px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
</style>
