import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

// ==================== 类型覆盖 ====================
// 告诉 TypeScript 我们的 request 方法直接返回业务数据（response.data），而不是 AxiosResponse
// ==================== 类型覆盖 ====================
declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(_config: AxiosRequestConfig): Promise<T> // 添加下划线
    get<T = any>(_url: string, _config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(_url: string, _config?: AxiosRequestConfig): Promise<T>
    head<T = any>(_url: string, _config?: AxiosRequestConfig): Promise<T>
    options<T = any>(_url: string, _config?: AxiosRequestConfig): Promise<T>
    post<T = any>(_url: string, _data?: any, _config?: AxiosRequestConfig): Promise<T>
    put<T = any>(_url: string, _data?: any, _config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(_url: string, _data?: any, _config?: AxiosRequestConfig): Promise<T>
  }
}
// ==================== 类型覆盖结束 ====================
// ==================== 类型覆盖结束 ====================

// 基础配置
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const store = useUserStore()
    const token = store.userInfo.token
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对于下载类请求（blob / arraybuffer），需要完整的响应对象，以便业务层获取 headers 和 blob 数据
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response
    }
    // 普通 JSON 请求，直接提取 data，配合类型覆盖后，业务层拿到的就是业务数据
    return response.data
  },
  (error: AxiosError) => {
    const status = error.response?.status
    // 将 data 断言为带有可选 message 属性的对象
    const data = error.response?.data as { message?: string } | undefined
    let msg: string

    switch (status) {
      case 400:
        msg = '请求参数错误'
        break
      case 401:
        msg = '未登录或登录已过期，请重新登录'
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
        msg = data?.message || '网络出现问题'
        break
    }

    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request
