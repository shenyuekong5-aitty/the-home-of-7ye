import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
// 引入用户仓库
import { useUserStore } from '@/store/modules/user'

// 基础配置
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 1. 获取用户信息
    const store = useUserStore()
    const token = store.userInfo.token

    // 2. 判断是否存在token
    if (token) {
      // 3. 设置token
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  // 1. 明确指定 error 类型为 AxiosError，解决 any 报错
  (error: AxiosError) => {
    const status = error.response?.status
    let msg: string

    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器问题'
        break
      default:
        msg = '网络出现问题'
        break
    }

    // 2. 确保在这里调用，这样变量就被“使用”了
    ElMessage({
      type: 'error',
      message: msg
    })

    return Promise.reject(error)
  }
)

export default request
