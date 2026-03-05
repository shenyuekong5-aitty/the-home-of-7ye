import router from '@/router'
import nProgress from 'nprogress' // 进度条（可选，建议安装：npm i nprogress）
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

nProgress.configure({ showSpinner: false })

// 路由白名单：不需要 Token 就能访问的页面
const whiteList = ['/login', '/404']

router.beforeEach(async (to, _from, next) => {
  nProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const token = userStore.userInfo.token

  if (token) {
    // 1. 已登录，如果去登录页，直接重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 2. 判断是否已经获取过用户信息/权限
      const hasPermissions =
        userStore.userInfo.permissions &&
        userStore.userInfo.permissions.length > 0

      if (hasPermissions) {
        // 如果已经有权限数据，直接放行
        next()
      } else {
        try {
          // 3. 【核心步骤】获取用户信息（包含权限 name 数组）
          // 假设后端返回：['home', 'AboutBook', 'userManage'...]
          const result = await userStore.reqUserInfo()
          const permissions = result?.data?.user?.routes
          console.log('permissions', permissions)

          // 4. 根据权限生成动态路由表
          const accessRoutes = permissionStore.generateRoutes(permissions)

          // 5. 将动态路由逐个挂载到路由实例中
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })

          // 6. 重点：使用 next({ ...to, replace: true })
          // 确保 addRoute 挂载完成后再进入页面，防止刷新白屏
          next({ ...to, replace: true })
        } catch (error) {
          // 发生错误（如 Token 过期），清空数据并跳转回登录
          // await userStore.resetToken()
          console.error(error)
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    // 7. 未登录
    if (whiteList.includes(to.path)) {
      next() // 在白名单中，直接进入
    } else {
      // 不在白名单，跳到登录页，并记录原本想去的路径
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})
