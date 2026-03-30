// src/api/common/type.ts
export interface ResponseData {
  code: number
  data: {
    token?: string
    message?: string
  }
}
