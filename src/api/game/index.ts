import request from '@/utils/request'
import type { GameResponse } from './type'

const API = {
  GAMELIST: '/api/game/list'
} as const

export const reqGetGameList = () => request.get<GameResponse>(API.GAMELIST)
