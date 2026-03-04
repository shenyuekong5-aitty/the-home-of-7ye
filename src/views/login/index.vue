<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="card-header">
        <h2 class="title">欢迎登录</h2>
        <p class="subtitle">我是小烨，很高兴你能来看我!</p>
      </div>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
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
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer-links">
        <el-link type="primary" underline="never">忘记密码？</el-link>
        <el-link type="primary" underline="never">注册账号</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue' // 导入 Element Plus 图标
import { ElMessage } from 'element-plus' // 导入 Element Plus 消息提示
import { useUserStore } from '@/store/modules/user' // 引入用户仓库
import { useRouter } from 'vue-router' // 引入路由

const userStore = useUserStore()
const router = useRouter()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 15, message: '用户名长度为5-15个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度为6-18个字符', trigger: 'blur' }
  ]
})

// 表单引用，用于触发表单验证
const loginFormRef = ref(null)
const loading = ref(false) // 登录按钮加载状态

// 处理登录逻辑
const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 直接调用 store 的异步方法，并传入表单数据
        await userStore.reqLogin(loginForm)
        // 跳转到首页
        router.push('/')
        ElMessage.success('登录成功！')

        // 成功后的操作：比如路由跳转
        // router.push('/')
      } catch (error) {
        // 修正：显示具体的错误字符串
        ElMessage.error(error.message || '系统错误')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.warning('请完整填写登录信息！')
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 撑满整个视口高度 */
  background: linear-gradient(
    135deg,
    #e0f2f7 0%,
    #bbdefb 100%
  ); /* 淡蓝色渐变背景 */
  font-family: 'Arial', sans-serif; /* 保持简约字体 */
}

.login-card {
  width: 90%;
  max-width: 400px; /* 最大宽度，适应不同屏幕 */
  padding: 30px 20px;
  border-radius: 12px; /* 圆角卡片 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
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
  height: 45px; /* 增加输入框高度 */
  font-size: 16px;
  border-radius: 8px; /* 输入框圆角 */
  /* 可以覆盖 Element Plus 默认样式，使其更贴合设计 */
  --el-input-border-radius: 8px;
  --el-input-hover-border-color: #409eff; /* 鼠标悬浮时的边框颜色 */
}

/* 调整输入框内图标的颜色 */
:deep(.el-input__prefix .el-icon) {
  color: #666;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 18px;
  border-radius: 8px; /* 按钮圆角 */
  background-color: #409eff; /* Element Plus 主色调，清新蓝 */
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
</style>
