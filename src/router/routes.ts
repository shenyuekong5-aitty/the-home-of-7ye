// 静态路由
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
      title: '留言中心',
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
      title: '大屏模式',
      hidden: false,
      icon: 'Monitor'
    }
  }
]

// 动态路由
export const asyncRoutes = [
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
    // 1. 父路由：渲染整体布局外壳
    path: '/friend-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/friend-manage/friend', // 默认指向子页面
    meta: {
      title: '朋友中心', // 一级菜单标题
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
  }
]

// 任意路由
export const anyRoute = [
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
