import { defineStore } from 'pinia'
import { reqGetUserList, reqUpdateUserRole } from '@/api/user/index'
import { useRoleStore } from '@/store/modules/role' // 引入角色 store
import type { UserItem } from '@/api/user/type'

export const useUserManageStore = defineStore('userManage', {
  state: () => ({
    userList: [] as UserItem[],
    loading: false
  }),
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const res = await reqGetUserList()
        if (res.code === 200) {
          this.userList = res.data
        }
      } finally {
        this.loading = false
      }
    },
    async updateUserRole(userId: number, roleId: number) {
      await reqUpdateUserRole(userId, roleId)

      // 从角色 store 获取角色信息以更新本地用户列表
      const roleStore = useRoleStore()
      // 确保角色列表已加载
      if (roleStore.roleList.length === 0) {
        await roleStore.fetchRoles()
      }
      const role = roleStore.roleList.find(r => r.id === roleId)

      const user = this.userList.find(u => u.id === userId)
      if (user && role) {
        user.role = role.name
        user.roleId = role.id
      }
    }
  }
})
