import request from '@/utils/request'
import type { EmotionResponse } from './type'

const API = {
  EMOTIONLIST: '/api/emotion/list'
} as const

export const reqGetEmotionList = () => request.get<EmotionResponse>(API.EMOTIONLIST)
