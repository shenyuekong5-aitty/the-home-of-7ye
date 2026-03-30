import type { ResponseData } from '../common/type'

export type BookResponse = ResponseData & {
  data: { items: string[] }
}
