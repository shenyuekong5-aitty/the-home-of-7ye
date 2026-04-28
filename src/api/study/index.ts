import request from '@/utils/request'
import type {
  StudyListResponse,
  StudyDetailResponse,
  StudyOperationResponse,
  AddStudyParams,
  UpdateStudyParams
} from './type'

const API = {
  LIST: '/study/list',
  DETAIL: '/study',
  ADD: '/study/add',
  UPDATE: '/study/update',
  DELETE: '/study/delete'
} as const

/** 获取学习列表：支持 categoryIds 数组或 parentCategoryId */
export const reqGetStudyList = (
  pageNo: number = 1,
  pageSize: number = 10,
  categoryIds?: number[],
  parentCategoryId?: number
) =>
  request.get<StudyListResponse>(API.LIST, {
    params: {
      pageNo,
      pageSize,
      ...(categoryIds && categoryIds.length > 0 && { categoryIds: categoryIds.join(',') }),
      ...(parentCategoryId !== undefined && { parentCategoryId })
    }
  })

export const reqGetStudyDetail = (id: number) => request.get<StudyDetailResponse>(`${API.DETAIL}/${id}`)

export const reqAddStudy = (data: AddStudyParams) => request.post<StudyOperationResponse>(API.ADD, data)

export const reqUpdateStudy = (data: UpdateStudyParams) => request.put<StudyOperationResponse>(API.UPDATE, data)

export const reqDeleteStudy = (id: number) => request.delete<StudyOperationResponse>(`${API.DELETE}/${id}`)
