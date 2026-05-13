import request from '@/utils/request'
import type { QrGenerateResponse, QrStatusResponse, QrConfirmResponse } from './type'

/** 生成二维码会话 */
export const reqGenerateQrSession = () => request.get<QrGenerateResponse>('/qrlogin/generate')

/** 轮询二维码状态 */
export const reqQrSessionStatus = (sessionId: string) =>
  request.get<QrStatusResponse>('/qrlogin/status', {
    params: { sessionId }
  })

/** 手机端确认登录 */
export const reqConfirmQrSession = (sessionId: string) =>
  request.post<QrConfirmResponse>(
    '/qrlogin/confirm',
    { sessionId },
    {
      headers: {
        token: localStorage.getItem('TOKEN') || ''
      }
    }
  )
