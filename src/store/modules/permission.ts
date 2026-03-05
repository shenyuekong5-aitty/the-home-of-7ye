import { defineStore } from 'pinia'
import { constantRoute, asyncRoutes, anyRoute } from '@/router/routes'

/**
 * 1. 工具函数：判断当前路由是否拥有权限
 * 放在 Store 外部作为私有工具
 */
function hasPermission(permissions: string[] | undefined, route: any) {
  if (route.name) {
    return permissions?.includes(route.name)
  }
  return true
}

/**
 * 2. 工具函数：递归过滤异步路由表
 * 放在 Store 外部
 */
function filterAsyncRoutes(routes: any[], permissions: string[] | undefined) {
  const res: any[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    } else if (tmp.children) {
      const children = filterAsyncRoutes(tmp.children, permissions)
      if (children.length > 0) {
        tmp.children = children
        res.push(tmp)
      }
    }
  })
  return res
}

/**
 * 3. 定义 Permission Store
 */
export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      // 最终展示在侧边栏的完整路由表
      routes: constantRoute as any[],
      // 记录是否已经添加过动态路由
      isAdded: false
    }
  },
  actions: {
    /**
     * 根据权限生成最终路由
     * @param permissions 后端返回的 name 数组
     */
    generateRoutes(permissions: string[] | undefined) {
      // 过滤出有权限的动态路由
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)

      // 更新全量路由表（用于侧边栏递归渲染）
      // 顺序必须是：静态 + 动态 + 任意(404)
      this.routes = [...accessedRoutes, ...constantRoute, ...anyRoute]

      this.isAdded = true

      // 返回需要通过 router.addRoute 动态添加的路由
      return [...accessedRoutes, ...anyRoute]
    },

    /**
     * 重置路由（用于退出登录）
     */
    resetRoutes() {
      this.routes = constantRoute
      this.isAdded = false
    }
  }
})
