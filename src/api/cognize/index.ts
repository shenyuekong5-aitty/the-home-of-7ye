import request from '@/utils/request'
import type {
  CognizeListResponse,
  CognizeDetailResponse,
  CognizeOperationResponse,
  AddCognizeParams,
  UpdateCognizeParams
} from './type'

const API = {
  LIST: '/cognize/list',
  DETAIL: '/cognize',
  ADD: '/cognize/add',
  UPDATE: '/cognize/update',
  DELETE: '/cognize/delete'
} as const

export const reqGetCognizeList = (pageNo: number = 1, pageSize: number = 10) =>
  request.get<CognizeListResponse>(API.LIST, { params: { pageNo, pageSize } })

export const reqGetCognizeDetail = (id: number) => request.get<CognizeDetailResponse>(`${API.DETAIL}/${id}`)

export const reqAddCognize = (data: AddCognizeParams) => request.post<CognizeOperationResponse>(API.ADD, data)

export const reqUpdateCognize = (data: UpdateCognizeParams) => request.put<CognizeOperationResponse>(API.UPDATE, data)

export const reqDeleteCognize = (id: number) => request.delete<CognizeOperationResponse>(`${API.DELETE}/${id}`)
