import request from '@/utils/request'
import type { MusicResponse } from './type'

const API = {
  LIST: '/music/list'
} as const

export const reqGetMusicList = () => request.get<MusicResponse>(API.LIST)
