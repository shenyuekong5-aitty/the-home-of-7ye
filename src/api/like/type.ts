import type { ResponseData } from '../common/type'

export type LikeToggleResponse = ResponseData & {
  data: { liked: boolean }
}

export type LikeCheckResponse = ResponseData & {
  data: { liked: boolean }
}
