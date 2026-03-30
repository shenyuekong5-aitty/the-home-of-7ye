import request from '@/utils/request'
import type { MusicResponse } from './type'

const API = {
  LIST: '/api/music/list'
} as const

export const reqGetMusicList = () => request.get<MusicResponse>(API.LIST)
