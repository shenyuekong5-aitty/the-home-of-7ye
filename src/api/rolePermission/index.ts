import request from '@/utils/request'

const API = {
  ALL_PERMISSIONS: '/permission/list',
  ROLE_PERMISSIONS: '/permission/role',
  UPDATE_PERMISSIONS: '/permission/role'
}

/**
 * 获取系统所有可分配权限列表
 */
export const reqGetAllPermissions = () => request.get<{ code: number; data: string[] }>(API.ALL_PERMISSIONS)

/**
 * 获取指定角色的权限
 */
export const reqGetPermissionsByRole = (roleId: number) =>
  request.get<{ code: number; data: string[] }>(`${API.ROLE_PERMISSIONS}/${roleId}`)

/**
 * 更新指定角色的权限
 * @param roleId 角色ID
 * @param permissions 权限标识数组
 */
export const reqUpdatePermissions = (roleId: number, permissions: string[]) =>
  request.put<{ code: number; message: string }>(`${API.UPDATE_PERMISSIONS}/${roleId}`, permissions)
