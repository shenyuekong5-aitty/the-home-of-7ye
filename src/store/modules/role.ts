import { defineStore } from 'pinia'
import { reqGetRoles } from '@/api/role/index'
import type { RoleItem } from '@/api/role/type'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roleList: [] as RoleItem[]
  }),
  actions: {
    async fetchRoles() {
      // 直接请求，不再判断 roleList.length
      try {
        const res = await reqGetRoles()
        if (res.code === 200) {
          this.roleList = res.data
        }
      } catch {
        // ignore
      }
    }
  }
})
