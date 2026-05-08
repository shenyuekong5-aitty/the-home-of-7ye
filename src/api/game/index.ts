import request from '@/utils/request'
import type { GameResponse, GameFormData, GameOpResponse } from './type'

const API = {
  GAMELIST: '/game/list',
  ADDGAME: '/game/add',
  UPDATEGAME: '/game/update',
  DELETEGAME: '/game/delete'
} as const

export const reqGetGameList = () => request.get<GameResponse>(API.GAMELIST)

export const reqAddGame = (data: GameFormData) =>
  request.post<GameOpResponse>(API.ADDGAME, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqUpdateGame = (id: number, data: GameFormData) =>
  request.put<GameOpResponse>(`${API.UPDATEGAME}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqDeleteGame = (id: number) =>
  request.delete<GameOpResponse>(`${API.DELETEGAME}/${id}`, {
    headers: { token: localStorage.getItem('token') || '' }
  })
