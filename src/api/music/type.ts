import type { ResponseData } from '../common/type'
export type musicItem = {
  name: string
  author: string
}
export type MusicResponse = ResponseData & {
  data: { items: musicItem[] }
}
