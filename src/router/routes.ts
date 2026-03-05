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
    redirect: '/home',
    meta: {
      title: '首页',
      hidden: true
    },
    children: [
      {
        path: 'home', // 子路由建议也使用相对路径
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
    path: '/study-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/study-manage/study',
    meta: {
      title: '学习中心',
      icon: 'Reading',
      hidden: false
    },
    children: [
      {
        path: 'study',
        component: () => import('@/views/study/index.vue'),
        name: 'study',
        meta: {
          title: '学习中心',
          hidden: false,
          icon: 'Reading'
        }
      }
    ]
  },
  {
    path: '/message-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/message-manage/message',
    meta: {
      title: '留言中心',
      icon: 'Comment',
      hidden: false
    },
    children: [
      {
        path: 'message',
        component: () => import('@/views/message/index.vue'),
        name: 'message',
        meta: {
          title: '留言中心',
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
        path: 'nickname-history', // 修改：去掉开头的 /
        component: () => import('@/views/about/NicknameHistory/index.vue'),
        name: 'AboutNicknameHistory',
        meta: { title: '曾用昵称', icon: 'User', hidden: false }
      },
      {
        path: 'book', // 修改：去掉开头的 /
        component: () => import('@/views/about/BookModule/index.vue'),
        name: 'AboutBook',
        meta: { title: '书籍模块', icon: 'Reading', hidden: false }
      },
      {
        path: 'music', // 修改：去掉开头的 /
        component: () => import('@/views/about/MusicModule/index.vue'),
        name: 'AboutMusic',
        meta: { title: '音乐模块', icon: 'Headset', hidden: false }
      },
      {
        path: 'anime', // 修改：去掉开头的 /
        component: () => import('@/views/about/AnimeModule/index.vue'),
        name: 'AboutAnime',
        meta: { title: '番剧模块', icon: 'VideoPlay', hidden: false }
      },
      {
        path: 'game', // 修改：去掉开头的 /
        component: () => import('@/views/about/GameModule/index.vue'),
        name: 'AboutGame',
        meta: { title: '游戏模块', icon: 'Iphone', hidden: false }
      },
      {
        path: 'psychology', // 修改：去掉开头的 /
        component: () => import('@/views/about/PsychologyModule/index.vue'),
        name: 'AboutPsychology',
        meta: { title: '心理模块', icon: 'Place', hidden: false }
      },
      {
        path: 'quote', // 修改：去掉开头的 /
        component: () => import('@/views/about/QuoteModule/index.vue'),
        name: 'AboutQuote',
        meta: { title: '名言模块', icon: 'ChatLineRound', hidden: false }
      },
      {
        path: 'creed', // 修改：去掉开头的 /
        component: () => import('@/views/about/CreedModule/index.vue'),
        name: 'AboutCreed',
        meta: { title: '信条模块', icon: 'Document', hidden: false }
      },
      {
        path: 'tag', // 修改：去掉开头的 /
        component: () => import('@/views/about/TagList/index.vue'),
        name: 'AboutTag',
        meta: { title: '标签模块', icon: 'List', hidden: false }
      },
      {
        path: 'cognition', // 修改：去掉开头的 /
        component: () => import('@/views/about/CognitionModule/index.vue'),
        name: 'AboutCognition',
        meta: { title: '认知命题', icon: 'CircleCheck', hidden: false }
      }
    ]
  },
  {
    path: '/role-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/role-manage/role',
    meta: {
      title: '角色管理',
      icon: 'User',
      hidden: false
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/role/index.vue'),
        name: 'role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/permission',
    component: () => import('@/layout/index.vue'),
    redirect: '/permission/index',
    name: 'PermissionManage',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      hidden: false
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/permission/index.vue'),
        name: 'permission',
        meta: {
          title: '权限管理',
          hidden: false,
          icon: 'Lock'
        }
      }
    ]
  },
  {
    path: '/user-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/user-manage/user',
    meta: {
      title: '用户管理',
      icon: 'Avatar',
      hidden: false
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/index.vue'),
        name: 'user',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'Avatar'
        }
      }
    ]
  },
  {
    path: '/friend-manage',
    component: () => import('@/layout/index.vue'),
    redirect: '/friend-manage/friend',
    meta: {
      title: '朋友中心',
      icon: 'ChatRound',
      hidden: false
    },
    children: [
      {
        path: 'friend',
        component: () => import('@/views/friend/index.vue'),
        name: 'friend',
        meta: {
          title: '朋友中心',
          hidden: false,
          icon: 'ChatRound'
        }
      }
    ]
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
      hidden: true,
      icon: 'DataLine'
    }
  }
]
