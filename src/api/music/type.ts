import type { ResponseData } from '../common/type'

export type MusicResponse = ResponseData & {
  data: { items: string[] }
}
