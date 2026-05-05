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
  if (!value) {
    el.style.display = 'none'
    return
  }

  const userStore = useUserStore()
  const currentRole = userStore.userInfo.role

  let hasPermission = false

  if (Array.isArray(value)) {
    // 数组：角色匹配其中一个即可
    hasPermission = value.includes(currentRole)
  } else if (typeof value === 'string') {
    // 字符串：完全匹配
    hasPermission = value === currentRole
  }

  el.style.display = hasPermission ? '' : 'none'
}
