import request from '@/utils/request'
import type { QuoteResponse } from './type'

const API = {
  LIST: '/quote/list'
} as const

export const reqGetQuoteList = () => request.get<QuoteResponse>(API.LIST)
