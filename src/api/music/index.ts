import request from '@/utils/request'
import type { MusicResponse, MusicOperationResponse, AddMusicParams, UpdateMusicParams } from './type'

const API = {
  LIST: '/music/list',
  ADD: '/music/add',
  UPDATE: '/music/update',
  DELETE: '/music/delete',
  RECOMMEND: '/recommendation/submit' // 统一推荐接口
} as const

// 获取音乐列表
export const reqGetMusicList = () => request.get<MusicResponse>(API.LIST)

// 新增音乐（管理员）
export const reqAddMusic = (data: AddMusicParams) => request.post<MusicOperationResponse>(API.ADD, data)

// 编辑音乐（管理员）
export const reqUpdateMusic = (data: UpdateMusicParams) => request.put<MusicOperationResponse>(API.UPDATE, data)

// 删除音乐（管理员）
export const reqDeleteMusic = (id: number) => request.delete<MusicOperationResponse>(`${API.DELETE}/${id}`)

// 推荐音乐（朋友）
export const reqRecommendMusic = (data: AddMusicParams) => {
  const payload = {
    type: 'music',
    content: data
  }
  return request.post<MusicOperationResponse>(API.RECOMMEND, payload)
}
