import { defineStore } from 'pinia'
import { reqGetRoles } from '@/api/role/index'
import type { RoleItem } from '@/api/role/type'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roleList: [] as RoleItem[]
  }),
  actions: {
    async fetchRoles() {
      if (this.roleList.length > 0) return
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
