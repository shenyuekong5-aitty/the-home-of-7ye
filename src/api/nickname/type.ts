import type { ResponseData } from '../common/type'

export type NicknameResponse = ResponseData & {
  data: { nicknames: string[] }
}

export interface AddNicknameParams {
  newName: string
}

export interface UpdateNicknameParams {
  oldName: string
  newName: string
}
