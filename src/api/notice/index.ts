import request from '@/utils/request'
import type { NoticeListResponse, PublishNoticeParams, PublishNoticeResponse } from './type'

const API = {
  LIST: '/notice/list',
  PUBLISH: '/notice/publish'
} as const

export const reqNoticeList = () => request.get<NoticeListResponse>(API.LIST)
export const reqPublishNotice = (data: PublishNoticeParams) => request.post<PublishNoticeResponse>(API.PUBLISH, data)
