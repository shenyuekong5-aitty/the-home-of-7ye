<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="card-header">
        <h2 class="title">欢迎登录</h2>
        <p class="subtitle">我是小烨，很高兴你能来看我!</p>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名或手机号"
            :prefix-icon="User"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="footer-links">
        <el-link type="primary" underline="never">忘记密码？</el-link>
        <el-link type="primary" underline="never" @click="openRegisterDialog">注册账号</el-link>
      </div>
    </el-card>

    <!-- 注册弹窗：账号 + 密码 + 昵称(可选) + 手机号 + 验证码 -->
    <el-dialog v-model="registerDialogVisible" title="注册新账号" width="400px" center>
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请设置登录账号（字母+数字）" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请设置登录密码"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="起个喜欢的昵称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
            @blur="validatePhone"
            placeholder="请输入手机号码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="15">
              <el-input v-model="registerForm.code" placeholder="请输入验证码" clearable></el-input>
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onBeforeUnmount } from 'vue'
  import { User, Lock } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { useRouter } from 'vue-router'
  import { reqSendSms } from '@/api/user'

  const userStore = useUserStore()
  const router = useRouter()

  // ========== 登录部分 ==========
  const loginForm = reactive({
    username: '',
    password: ''
  })

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

  const handleLogin = () => {
    loginFormRef.value!.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        try {
          await userStore.reqLogin(loginForm)
          router.push('/')
          ElMessage.success('登录成功！')
        } catch (error: any) {
          ElMessage.error(error.message || '系统错误')
        } finally {
          loading.value = false
        }
      } else {
        ElMessage.warning('请完整填写登录信息！')
      }
    })
  }

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

  const validatePhone = () => {
    if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
      ElMessage.error('手机号格式不正确')
      registerForm.phone = ''

      sendBtnText.value = '获取验证码'
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
          ElMessage.error(error.message || '注册失败')
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

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
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
    margin-bottom: 30px;
  }
  .title {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .subtitle {
    font-size: 14px;
    color: #666;
    margin-top: 0;
  }
  .login-form {
    margin-top: 20px;
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
</style>
