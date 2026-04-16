import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/store/modules/user'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    updateVisibility(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    updateVisibility(el, binding)
  }
}

function updateVisibility(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding
  if (!value || !Array.isArray(value)) return
  const userStore = useUserStore()
  const roles = userStore.userInfo.roles || []
  const hasPermission = value.some(role => roles.includes(role))
  el.style.display = hasPermission ? '' : 'none'
}
