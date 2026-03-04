##### 1.路由菜单

<template>
  <div>
    <el-scrollbar height="400px" @end-reached="loadMore">
      <el-menu default-active="1" :default-openeds="routes" collapse-transition>
        <template v-for="route in routes" :key="route.path">
          <!-- 没有子路由 -->
          <template v-if="!route.children">
            <el-menu-item v-if="!route.meta.hidden">
              <el-icon>
                <component :is="route.meta.icon"></component>
              </el-icon>
              <template #title>
                <span>{{ route.meta.title }}</span>
              </template>
            </el-menu-item>
          </template>
          <!-- 这一部分仅用于练习 -->
          <!-- 有一个子路由 -->
          <!-- <template v-if="route.children && route.children?.length === 1">
            <el-menu-item v-if="!route.children[0]?.meta?.hidden">
              <el-icon>
                <component :is="route.children[0]?.meta?.icon"></component>
              </el-icon>
              <template #title>
                <span>{{ route.children[0]?.meta.title }}</span>
              </template>
            </el-menu-item>
          </template> -->
          <template v-if="route.children && route.children?.length === 1">
            <el-menu-item v-if="!route.meta.hidden">
              <el-icon>
                <component :is="route.meta.icon"></component>
              </el-icon>
              <template #title>
                <span>{{ route.meta.title }}</span>
              </template>
            </el-menu-item>
          </template>
          <!-- 有多个子路由 -->
          <el-sub-menu v-if="route.children && route.children?.length > 1">
            <template #title>
              <el-icon>
                <component :is="route.meta.icon"></component>
              </el-icon>
              <span>{{ route.meta.title }}</span>
            </template>
            <MenuItem :menuList="route.children" />
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>


<script lang="ts">
export default {
  name: 'MenuItem' // 必须定义 name，递归调用才能找到自己
}
</script>
<script setup lang="ts">
import { usePermissionStore } from '@/store/modules/permission'
import type { ScrollbarDirection } from 'element-plus'
const permissionStore = usePermissionStore()
const routes = permissionStore.routes
console.log(routes)
const loadMore = (direction: ScrollbarDirection) => {
  if (direction === 'bottom') {
    console.log(11)
  }
}
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>

我这样写，然后发现了为什么必须得再额外封装一个组件，因为一开始数据来源于路由，而递归数据来源于:menuList="routes"



正确写法：

MenuItem组件：

```
<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item?.children">
      <el-menu-item v-if="!item?.meta?.hidden">
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 这一部分仅用于练习 -->
    <!-- 有一个子路由 -->
    <!-- <template v-if="item.children && item.children?.length === 1">
    <el-menu-item v-if="!item.children[0]?.meta?.hidden">
      <el-icon>
        <component :is="item.children[0]?.meta?.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0]?.meta.title }}</span>
      </template>
    </el-menu-item>
  </template> -->
    <template v-else-if="item?.children && item?.children?.length === 1">
      <el-menu-item v-if="!item?.meta?.hidden">
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多个子路由 -->
    <el-sub-menu v-else-if="item?.children && item?.children?.length > 1">
      <template #title>
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <span>{{ item?.meta?.title }}</span>
      </template>
      <MenuItem :menuList="item?.children" />
    </el-sub-menu>
  </template>
</template>

<script setup>
defineOptions({
  name: 'MenuItem'
})
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [] // 确保即使没传，也是空数组，v-for 不会报错
  }
})

// 访问数据
console.log(33, props.menuList)
</script>

<style scoped></style>

```

Menu/index:

```
<template>
  <div>
    <el-scrollbar height="100%" max-height="100%">
      <el-menu default-active="1" collapse-transition>
        <MenuItem :menuList="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/store/modules/permission'
import MenuItem from '@/layout/aside/menu/MenuItem/index.vue'
const permissionStore = usePermissionStore()
const routes = permissionStore.routes
console.log(routes)
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>

```

因为起始数据导致的额外组件封装



##### 2.动态鉴权

```
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    redirect: '/home', // 添加重定向
    meta: {
      title: '',
      hidden: true
    },
    children: [
      {
        path: '/home', // 使用相对路径
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled'
        }
      }
    ]
  },
  {
    path: '/About',
    component: () => import('@/layout/index.vue'),
    name: 'About',
    meta: {
      title: '关于我',
      hidden: false,
      icon: 'Pointer'
    },
    children: [
      {
        path: '/nickname-history',
        component: () => import('@/views/about/NicknameHistory/index.vue'),
        name: 'AboutNicknameHistory',
        meta: { title: '曾用昵称', icon: 'User', hidden: false }
      },
      {
        path: '/book',
        component: () => import('@/views/about/BookModule/index.vue'),
        name: 'AboutBook',
        meta: { title: '书籍模块', icon: 'Reading', hidden: false }
      },
      {
        path: '/music',
        component: () => import('@/views/about/MusicModule/index.vue'),
        name: 'AboutMusic',
        meta: { title: '音乐模块', icon: 'Headset', hidden: false }
      },
      {
        path: '/anime',
        component: () => import('@/views/about/AnimeModule/index.vue'),
        name: 'AboutAnime',
        meta: { title: '番剧模块', icon: 'VideoPlay', hidden: false }
      },
      {
        path: '/game',
        component: () => import('@/views/about/GameModule/index.vue'),
        name: 'AboutGame',
        meta: { title: '游戏模块', icon: 'Iphone', hidden: false }
      },
      {
        // 动态路由
        path: '/psychology',
        component: () => import('@/views/about/PsychologyModule/index.vue'),
        name: 'AboutPsychology',
        meta: { title: '心理模块', icon: 'Place', hidden: false }
      },
      {
        path: '/quote',
        component: () => import('@/views/about/QuoteModule/index.vue'),
        name: 'AboutQuote',
        meta: { title: '名言模块', icon: 'ChatLineRound', hidden: false }
      },
      {
        // 动态路由
        path: '/creed',
        component: () => import('@/views/about/CreedModule/index.vue'),
        name: 'AboutCreed',
        meta: { title: '信条模块', icon: 'Document', hidden: false }
      },
      {
        // 动态路由
        path: '/tag',
        component: () => import('@/views/about/TagList/index.vue'),
        name: 'AboutTag',
        meta: { title: '标签模块', icon: 'List', hidden: false }
      },
      {
        // 动态路由
        path: '/cognition',
        component: () => import('@/views/about/CognitionModule/index.vue'),
        name: 'AboutCognition',
        meta: { title: '认知命题', icon: 'CircleCheck', hidden: false }
      }
    ]
  },
  {
    // 1. 定义父级路径
    path: '/study-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/study-manage/study', // 默认跳转到子路由
    meta: {
      title: '学习中心', // 一级菜单标题
      icon: 'Reading',
      hidden: false
    },
    children: [
      {
        // 2. 实际渲染在 Layout 内部的子页面
        path: 'study',
        component: () => import('@/views/study/index.vue'),
        name: 'study',
        meta: {
          title: '我的学习', // 二级菜单标题
          hidden: false,
          icon: 'Reading'
        }
      }
    ]
  },
  {
    // 1. 父级路由，指向布局外壳
    path: '/message-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/message-manage/message', // 自动重定向到实际内容页
    meta: {
      title: '留言',
      icon: 'Comment',
      hidden: false
    },
    children: [
      {
        // 2. 子路由，这是真正显示在二级窗口的组件
        path: 'message',
        component: () => import('@/views/message/index.vue'),
        name: 'message',
        meta: {
          title: '留言列表',
          hidden: false,
          icon: 'Comment'
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    name: 'dashboard',
    meta: {
      title: '大屏',
      hidden: false,
      icon: 'Monitor'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true, // 这个应该隐藏
      icon: 'DataLine'
    }
  }
]

export const asyncRoutes = [
  {
    // 1. 父路由：渲染整体布局外壳
    path: '/friend-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/friend-manage/friend', // 默认指向子页面
    meta: {
      title: '朋友', // 一级菜单标题
      icon: 'ChatRound',
      hidden: false
    },
    children: [
      {
        // 2. 子路由：实际的朋友页面组件
        path: 'friend',
        component: () => import('@/views/friend/index.vue'),
        name: 'friend',
        meta: {
          title: '我的朋友', // 侧边栏显示的二级菜单
          hidden: false,
          icon: 'ChatRound'
        }
      }
    ]
    // 这个子路由仅用于练习
    // children: [
    //   {
    //     path: '/Message',
    //     component: () => import('@/views/friend/Message/index.vue'),
    //     name: 'Message',
    //     meta: {
    //       title: '留言',
    //       hidden: false,
    //       icon: 'Message'
    //     }
    //   }
    // ]
  },
  {
    // 1. 父级路径：负责渲染 Layout 框架
    path: '/user-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/user-manage/user', // 访问父路径时，自动跳到子页面
    meta: {
      title: '用户管理', // 侧边栏一级菜单名称
      icon: 'Avatar',
      hidden: false
    },
    children: [
      {
        // 2. 子级路径：显示在 Layout 的 router-view 中
        path: 'user',
        component: () => import('@/views/user/index.vue'),
        name: 'user',
        meta: {
          title: '用户列表', // 二级菜单名称
          hidden: false,
          icon: 'Avatar'
        }
      }
    ]
  },
  {
    path: '/permission',
    component: () => import('@/layout/index.vue'), // 1. 父级指向布局组件
    redirect: '/permission/index', // 2. 重定向到具体的子页面
    name: 'PermissionManage',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      hidden: false
    },
    children: [
      {
        path: 'index', // 3. 实际的业务页面路径
        component: () => import('@/views/permission/index.vue'),
        name: 'permission',
        meta: {
          title: '权限设置', // 侧边栏显示的二级菜单名
          hidden: false,
          icon: 'Lock'
        }
      }
    ]
  },
  {
    path: '/role-manage', // 父级路径（建议与子级区分开）
    component: () => import('@/layout/index.vue'),
    redirect: '/role-manage/role', // 访问父路径时自动重定向到子路由
    meta: {
      title: '角色管理', // 侧边栏显示的父级名称
      icon: 'User',
      hidden: false
    },
    children: [
      {
        path: 'role', // 子路由路径（实际访问路径为 /role-manage/role）
        component: () => import('@/views/role/index.vue'), // 这里指向你的具体角色页面组件
        name: 'role',
        meta: {
          title: '角色', // 对应二级菜单的标题
          hidden: false,
          icon: 'User'
        }
      }
    ]
  }
]
在将路由拆解为动态路由+静态路由时，拆解途中遇到问题，About里有些子路由需要鉴权，是直接在asyncRouter中定义一个About，在其children中追加对应的动态子路由吗？这样会不会造成重复
答：会造成重复，目前动态路由没问题了，完全是需要后端返回数据或者前端mock鉴权的，静态路由也没问题，虽然About子路由有部分需要鉴权，而部分是共有的，可以定义如下三个函数：
1.动态路由
/**
 * 第一个函数：递归过滤动态路由
 * @param asyncRoutes 所有的动态路由配置
 * @param routeNames 后端返回的权限 name 数组
 */
function filterAsyncRoutes(asyncRoutes: any[], routeNames: string[]) {
  return asyncRoutes.filter((item) => {
    if (routeNames.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        // 使用解构赋值或 Object.assign 避免污染原数据
        item.children = filterAsyncRoutes(item.children, routeNames);
      }
      return true;
    }
    return false;
  });
}
2.静态路由过滤
/**
 * 第二个函数：过滤静态路由
 * 默认情况下返回全部，或者过滤掉 meta.hidden 为 true 的（用于侧边栏展示）
 */
function filterConstantRoutes(constantRoutes: any[]) {
  // 这里可以根据你的需求定制。
  // 如果只是为了侧边栏展示，通常过滤掉 meta.hidden === true 的项
  return constantRoutes.filter(route => !route.meta?.hidden);
}
3.结果封装函数
/**
 * 第三个函数：封装并返回最终结果
 * @param allAsyncRoutes 所有的动态路由
 * @param allConstantRoutes 所有的静态路由
 * @param routeNames 权限列表
 */
export function generateRoutes(allAsyncRoutes: any[], allConstantRoutes: any[], routeNames: string[]) {
  // 1. 获取过滤后的动态路由
  // 注意：这里建议传入 asyncRoutes 的深拷贝，防止污染
  const accessedRoutes = filterAsyncRoutes(JSON.parse(JSON.stringify(allAsyncRoutes)), routeNames);

  // 2. 获取最终完整的路由表（用于 router.addRoute）
  const completeRoutes = [...allConstantRoutes, ...accessedRoutes];

  return {
    accessedRoutes, // 过滤后的动态路由（常用于动态添加）
    completeRoutes  // 完整的路由表（常用于侧边栏渲染）
  };
}
```



##### 3.网络请求流程

`mock/user.ts` -->`api` --> `src/utils/request.ts` --> `.env.xxx `

mock数据：vite.config.ts里的plugins-->viteMockServe相关配置注释或者设置为localEnabled:false

```
依赖：pnpm install vite-plugin-mock mockjs -D
```

`vite.config.ts`配置

```
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: mode === 'development', // 3.0版本的新属性名
      }),
    ],
  }
})
```





#### 问题

1.在书写TS类型中，我发现api、store、mock等TS类型复用太严重了

这样性能太低了，我就想只在一个地方作为源头，现在有两种方案

A：api下建立types文件夹，专门用来放类型文件

B：api/user文件夹，下有api接口文件跟api类型文件

最终选择B,理由：更符合“高内聚低耦合”思想



2.响应式陷阱

```
<template>
  <div>home</div>
  <h1>{{ userInfo.username }}</h1>
</template>

<script setup lang="ts">
// 这里写 TypeScript 代码
import { onMounted, reactive } from 'vue'
// 引入类型文件
// 获取用户信息
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
let userInfo = reactive<any>({})
onMounted(async () => {
  await userStore.reqUserInfo()
  console.log(userStore.userInfo)
  userInfo = userStore.userInfo
})
console.log(userInfo)
</script>
```

当写 `let userInfo = reactive({})` 时，Vue 创建了一个**响应式代理对象**。

- **赋值前**：`userInfo` 指向内存地址 A（Vue 的代理对象）。
- **赋值后**：你执行 `userInfo = userStore.userInfo`，这时 `userInfo` 这个变量不再指向地址 A，而是指向了内存地址 B（Store 里的数据）。
- **后果**：由于 Vue 的模板（Template）在编译时已经锁定了地址 A，而你现在把变量改向了地址 B，**模板再也收不到地址 B 的任何变化通知了**。

而后一个`console.log()`打印不出数据则是由于setup立刻执行了，时机快于`onMounted`
