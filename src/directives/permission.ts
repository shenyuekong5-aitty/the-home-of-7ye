import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    if (value && Array.isArray(value)) {
      const userStore = useUserStore()
      const roles = userStore.userInfo.roles || []
      const hasPermission = value.some(role => roles.includes(role))
      if (!hasPermission) {
        el.style.display = 'none'
      }
    }
  }
}
