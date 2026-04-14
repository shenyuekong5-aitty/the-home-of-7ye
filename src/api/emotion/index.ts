import request from '@/utils/request'
import type { EmotionResponse } from './type'

const API = {
  EMOTIONLIST: '/emotion/list'
} as const

export const reqGetEmotionList = () => request.get<EmotionResponse>(API.EMOTIONLIST)
