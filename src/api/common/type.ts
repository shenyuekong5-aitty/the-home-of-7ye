// 保留原有结构，用于兼容旧接口
export interface LegacyResponseData {
  code: number
  data: {
    token?: string
    message?: string
  }
}

// 新的标准响应结构（顶层 message）
export interface StandardResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 导出统一的 ResponseData 类型，根据实际需要选择使用
export type ResponseData<T = any> = LegacyResponseData | StandardResponseData<T>
