import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouteStore } from '@/store/modules/route'

nProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404']

router.beforeEach(async (to) => {
  nProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const token = userStore.userInfo.token

  if (token) {
    if (to.path === '/login') {
      nProgress.done() // 【必须】重定向前手动结束
      return { path: '/' }
    } else {
      const hasPermissions = (userStore?.userInfo?.permissions?.length ?? 0) > 0

      if (hasPermissions) {
        return true
      } else {
        try {
          const result = await userStore.reqUserInfo()
          const permissions = result?.data?.user?.routes
          const accessRoutes = permissionStore.generateRoutes(permissions)

          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 【必须】这里返回对象会触发新导航，当前导航取消，不走 afterEach
          // 所以理论上这里不用手工 done，因为新导航很快就会接管并最终在 afterEach 结束
          return { ...to, replace: true }
        } catch (error) {
          console.error(error)
          nProgress.done() // 【必须】出错时手动结束
          return `/login?redirect=${to.path}`
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      return true
    } else {
      nProgress.done() // 【必须】跳转登录前手动结束
      return `/login?redirect=${to.path}`
    }
  }
})

router.afterEach((to) => {
  const routeStore = useRouteStore()

  // 1. 提取并去重 meta.title
  const titles = [
    ...new Set(
      to.matched
        .map((item) => item.meta?.title)
        .filter(
          (title): title is string =>
            typeof title === 'string' && title.trim() !== ''
        )
    )
  ]

  // 2. 同步到 Store
  routeStore.setMatched(titles)

  // 3. 【核心修复】必须调用 done()，否则进度条会一直卡在 99%
  nProgress.done()
})
