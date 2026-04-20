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

/**
 * 获取学习列表
 */
export const reqGetStudyList = (pageNo: number = 1, pageSize: number = 10) =>
  request.get<StudyListResponse>(API.LIST, { params: { pageNo, pageSize } })

/**
 * 获取学习详情
 */
export const reqGetStudyDetail = (id: number) => request.get<StudyDetailResponse>(`${API.DETAIL}/${id}`)

/**
 * 新增学习条目
 */
export const reqAddStudy = (data: AddStudyParams) => request.post<StudyOperationResponse>(API.ADD, data)

/**
 * 编辑学习条目
 */
export const reqUpdateStudy = (data: UpdateStudyParams) => request.put<StudyOperationResponse>(API.UPDATE, data)

/**
 * 删除学习条目
 */
export const reqDeleteStudy = (id: number) => request.delete<StudyOperationResponse>(`${API.DELETE}/${id}`)
