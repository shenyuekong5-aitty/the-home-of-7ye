import request from '@/utils/request'
import type { AnimeResponse } from './type'

const API = {
  ANIMELIST: '/api/anime/list'
} as const

export const reqGetAnimeList = () => request.get<AnimeResponse>(API.ANIMELIST)
