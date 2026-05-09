import request from '@/utils/request'
import type { TagResponse, TagOpResponse } from './type'

const API = {
  LIST: '/tag/list',
  ADD: '/tag/add',
  UPDATE: '/tag/update',
  DELETE: '/tag/delete',
  EXPORT: '/tag/export',
  IMPORT: '/tag/import',
  TEMPLATE: '/tag/template'
}

export const reqGetTagList = () => request.get<TagResponse>(API.LIST)

export const reqAddTag = (data: { content: string }) =>
  request.post<TagOpResponse>(API.ADD, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqUpdateTag = (id: number, data: { content: string }) =>
  request.put<TagOpResponse>(`${API.UPDATE}/${id}`, data, {
    headers: { token: localStorage.getItem('token') || '' }
  })

export const reqDeleteTag = (id: number) =>
  request.delete<TagOpResponse>(`${API.DELETE}/${id}`, {
    headers: { token: localStorage.getItem('token') || '' }
  })

// 导出 Excel（返回 Blob）
export const reqExportTags = () =>
  request.get(API.EXPORT, {
    responseType: 'blob',
    headers: { token: localStorage.getItem('token') || '' }
  })

// 导入 Excel（上传文件）
export const reqImportTags = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post(API.IMPORT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: localStorage.getItem('token') || ''
    }
  })
}

// 下载模板
export const reqDownloadTemplate = () =>
  request.get(API.TEMPLATE, {
    responseType: 'blob',
    headers: { token: localStorage.getItem('token') || '' }
  })
