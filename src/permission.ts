import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouteStore } from '@/store/modules/route'
import { GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'

nProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404', '/home']

router.beforeEach(async to => {
  nProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  const token = GET_TOKEN()

  if (token) {
    if (to.path === '/login') {
      // 只要携带 redirect 或 qr 参数，就放行（让登录页自行处理确认逻辑）
      if (to.query.redirect || to.query.qr) {
        nProgress.done()
        return true
      }
      // 无任何特殊参数，直接跳转首页
      nProgress.done()
      return { path: '/' }
    } else {
      // 检查是否有权限/用户信息
      const hasPermissions = userStore.userInfo?.permissions && userStore.userInfo.permissions.length > 0

      if (hasPermissions) {
        return true
      } else {
        try {
          // 获取用户信息
          const result = await userStore.reqUserInfo()

          // 确保接口返回了路由数据再进行动态挂载
          const permissions = result?.data?.user?.routes || []
          const accessRoutes = permissionStore.generateRoutes(permissions)

          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // 【重要】动态路由添加后，必须使用 return { ...to, replace: true }
          // 确保路由表更新后再进入页面
          return { ...to, replace: true }
        } catch (error) {
          console.error('获取用户信息失败，强制登出:', error)
          REMOVE_TOKEN()
          userStore.$reset()
          nProgress.done()
          return `/login?redirect=${to.path}`
        }
      }
    }
  } else {
    // 没有 Token 的情况
    if (whiteList.includes(to.path)) {
      return true
    } else {
      nProgress.done()
      if (to.path === '/login') return true
      return `/login?redirect=${to.path}`
    }
  }
})

router.afterEach(to => {
  const routeStore = useRouteStore()

  // 1. 提取并去重 meta.title
  const titles = [
    ...new Set(
      to.matched
        .map(item => item.meta?.title)
        .filter((title): title is string => typeof title === 'string' && title.trim() !== '')
    )
  ]

  // 2. 同步到 Store
  routeStore.setMatched(titles)

  // 3. 必须调用 done()，否则进度条会一直卡在 99%
  nProgress.done()
})
