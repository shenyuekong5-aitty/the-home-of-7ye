/** 生成二维码会话响应 */
export interface QrGenerateResponse {
  code: number
  sessionId: string
}

/** 轮询会话状态响应 */
export interface QrStatusResponse {
  code: number
  status: 'WAITING' | 'CONFIRMED' | 'EXPIRED'
  token?: string // 状态为 CONFIRMED 时返回
}

/** 确认登录响应 */
export interface QrConfirmResponse {
  code: number
  message: string
}
