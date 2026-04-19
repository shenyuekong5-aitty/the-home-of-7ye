import request from '@/utils/request'
import type {
  StudyListResponse,
  StudyDetailResponse,
  StudyOperationResponse,
  FavoriteStatusResponse,
  AddStudyParams,
  UpdateStudyParams
} from './type'

const API = {
  LIST: '/study/list',
  DETAIL: '/study',
  ADD: '/study/add',
  UPDATE: '/study/update',
  DELETE: '/study/delete',
  LIKE: '/study/like',
  FAVORITE_CHECK: '/favorite/check',
  FAVORITE_TOGGLE: '/favorite/toggle'
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

/**
 * 点赞学习条目
 */
export const reqLikeStudy = (id: number) => request.post<StudyOperationResponse>(`${API.LIKE}/${id}`)

/**
 * 检查当前用户是否已收藏
 */
export const reqCheckFavorite = (targetType: string, targetId: number) =>
  request.get<FavoriteStatusResponse>(API.FAVORITE_CHECK, {
    params: { targetType, targetId }
  })

/**
 * 切换收藏状态（智能收藏/取消）
 */
export const reqToggleFavorite = (targetType: string, targetId: number) =>
  request.post<FavoriteStatusResponse>(API.FAVORITE_TOGGLE, {
    targetType,
    targetId
  })
