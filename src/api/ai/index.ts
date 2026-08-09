import request from '@/utils/request'
import type { ChatRequest, ChatResponse } from './type'

const API = {
  CHAT: '/ai/chat'
} as const

export const chatWithAI = (data: ChatRequest) => request.post<ChatResponse>(API.CHAT, data)
