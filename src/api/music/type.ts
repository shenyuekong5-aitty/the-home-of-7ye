import type { ResponseData } from '../common/type'

export interface MusicItem {
  id: number // 后端实体有 id
  name: string
  author: string
}

export type MusicResponse = ResponseData & {
  data: { items: MusicItem[] }
}

// 新增音乐参数
export interface AddMusicParams {
  name: string
  author: string
}

// 编辑音乐参数
export interface UpdateMusicParams extends AddMusicParams {
  id: number
}

// 操作响应
export type MusicOperationResponse = ResponseData & {
  data: MusicItem | null
}
