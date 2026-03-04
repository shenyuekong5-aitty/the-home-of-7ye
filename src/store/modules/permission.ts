import { defineStore } from 'pinia'
import { constantRoute } from '@/router/routes'
export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routes: constantRoute
    }
  }
})
