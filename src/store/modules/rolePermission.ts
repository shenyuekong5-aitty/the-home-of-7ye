import { defineStore } from 'pinia'
import { reqGetAllPermissions, reqGetPermissionsByRole, reqUpdatePermissions } from '@/api/rolePermission/index'
import { ElMessage } from 'element-plus'

export const useRolePermissionStore = defineStore('rolePermission', {
  state: () => ({
    allPermissions: [] as string[], // 系统所有可用权限标识
    rolePermissionsCache: {} as Record<number, string[]>, // 缓存各角色已有权限
    saving: false
  }),
  actions: {
    // 获取所有权限列表（从后端）
    async fetchAllPermissions() {
      if (this.allPermissions.length > 0) return
      try {
        const res = await reqGetAllPermissions()
        if (res.code === 200) {
          this.allPermissions = res.data
        }
      } catch {
        ElMessage.error('获取权限列表失败')
      }
    },

    // 获取指定角色的权限
    async fetchRolePermissions(roleId: number): Promise<string[]> {
      try {
        const res = await reqGetPermissionsByRole(roleId)
        if (res.code === 200) {
          const perms = res.data || []
          this.rolePermissionsCache[roleId] = perms
          return perms
        }
      } catch {
        ElMessage.error('加载角色权限失败')
      }
      return []
    },

    // 更新角色权限
    async updateRolePermissions(roleId: number, permissions: string[]) {
      this.saving = true
      try {
        await reqUpdatePermissions(roleId, permissions)
        this.rolePermissionsCache[roleId] = [...permissions]
        ElMessage.success('权限更新成功')
      } catch {
        ElMessage.error('保存失败')
      } finally {
        this.saving = false
      }
    }
  }
})
