import axios, { AxiosError } from 'axios'
import { useUserStore } from '@/store/modules/user'

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
// 基础配置
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000
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
// 响应拦截器 - 成功
request.interceptors.response.use(
  response => {
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response
    }
    return response.data
  },
  // 错误处理：增加自动重试
  async (error: AxiosError) => {
    const config = error.config as any

    // 只对 GET 请求进行重试，最多重试 2 次
    if (config.method === 'get' && (!config.retryCount || config.retryCount < 2)) {
      config.retryCount = (config.retryCount || 0) + 1
      // 递增延迟：第一次等 1 秒，第二次等 2 秒
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retryCount))
      return request(config)
    }

    // 如果重试依然失败，或者不是 GET 请求，走原有错误处理
    const status = error.response?.status
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
