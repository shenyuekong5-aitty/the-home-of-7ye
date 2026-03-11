// TS类型引入
import type {
  LoginParams,
  MockRequest,
  UpdateNicknameParams,
  UpdatePasswordParams,
  NoticeListQuery,
  PublishNoticeParams,
  NicknameQuery,
  AddNicknameParams
} from '../src/api/user/type.ts'

// createUserList: 返回用户信息数组
function createUserList() {
  return [
    {
      userId: 1,
      avatar: './assets/images/avatar1.png',
      username: 'aitty',
      password: '200406',
      desc: '管理员',
      roles: ['admin'],
      routes: [
        'AboutHome',
        'AboutNicknameHistory',
        'AboutBook',
        'AboutMusic',
        'AboutAnime',
        'AboutGame',
        'AboutPsychology',
        'AboutQuote',
        'AboutCreed',
        'AboutTag',
        'AboutCognition',
        'friend',
        'user',
        'permission',
        'role'
      ],
      token: 'Admin Token'
    }
    // ... 其他用户保持不变
  ]
}

const mockNotices = [
  {
    id: 1,

    title: '系统维护通知',

    content:
      '服务器将于今晚 22:00 进行常规维护，预计时长 1 小时。维护期间部分功能可能受限，请提前保存工作。',

    publishTime: '2026-03-09 10:00:00',

    isImportant: false,

    publisher: 'Admin'
  },

  {
    id: 2,

    title: '欢迎来到个人空间',

    content:
      '这是最新的公告系统，管理员可以发布置顶公告。你可以在这里查看最新的系统动态和功能更新日志。',

    publishTime: '2026-03-09 12:00:00',

    isImportant: true, // 置顶

    publisher: 'Admin'
  },

  {
    id: 3,

    title: '✨ 视觉风格 2.0 更新',

    content:
      '本次更新引入了全新的“黑白漫画 + 现代极简”设计语言。优化了卡片阴影、边框线条以及毛玻璃交互效果，希望你会喜欢！',

    publishTime: '2026-03-10 09:30:00',

    isImportant: false,

    publisher: 'Developer'
  },

  {
    id: 4,

    title: '倒计时功能上线',

    content:
      '首页新增了“日落倒计时”与“法定节假日倒计时”。现在你可以清晰地看到距离放假还有多久啦！',

    publishTime: '2026-03-10 15:00:00',

    isImportant: false,

    publisher: 'System'
  },

  {
    id: 5,

    title: '🚀 性能优化公告',

    content:
      '我们优化了 API 拦截器的解析逻辑，现在页面加载速度提升了约 30%，修复了之前部分数据层级读取失败的问题。',

    publishTime: '2026-03-11 11:20:00',

    isImportant: false,

    publisher: 'Developer'
  },

  {
    id: 6,

    title: '植树节特别活动',

    content:
      '春天来啦！明天就是 3 月 12 日植树节，虽然我们在数字世界工作，也别忘了给窗台的小盆栽浇浇水哦~',

    publishTime: '2026-03-11 17:45:00',

    isImportant: false,

    publisher: '小烨'
  }
]

// 历史昵称数据

const mockNicknames = [
  '空神月',

  '33',

  '同途',

  '7ye',

  '筱',

  '落九天',

  '九日言',

  '追神风',

  '夜郎紫',

  '穿越风',

  '玉门关',

  '不知火',

  'breeze',

  'Gemini',

  'beam',

  'Aitty',

  'AittyFlora',

  '烨烨子',

  '永轮同承·咒体·怨',

  '永轮同承·咒体·令',

  '魏落樱',

  '问天·天与咒缚·解轮·自在极意功',

  '千烨',

  'yamanaiame',

  '夜千烨',

  '叶锦添',

  '踏前雪，夜千烨，雪中焰',

  '空花映月.d.旭烨',

  '神赐的救赎道',

  '长眠',

  '长辞',

  '旧逢',

  '旧眠',

  '功成名就刘文生',

  '镜花',

  '镜花缘·梦与雨',

  '夜梦雨',

  '夜修罗',

  '在别人的心巴上开道口子',

  '别时雨',

  '仙姬我妻',

  '夜归鹿门歌',

  '秋风词',

  '萤火虫不见了',

  '筱',

  'tyi'
]

// 对外暴露接口数组
export default [
  // 用户登录接口
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }: { body: LoginParams }) => {
      const { username, password } = body
      const user = createUserList().find(
        (item) => item.username === username && item.password === password
      )
      if (!user) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      return { code: 200, data: { token: user.token } }
    }
  },

  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request: MockRequest) => {
      const token = request.headers.token
      const user = createUserList().find((item) => item.token === token)
      if (!user) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      return { code: 200, data: { user } }
    }
  },

  // 退出登录
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return { code: 200, data: { message: '退出登录成功' } }
    }
  },

  // 修改密码接口
  {
    url: '/api/user/change-password',
    method: 'post',
    response: ({ body }: { body: UpdatePasswordParams }) => {
      const { username, password, newPassword } = body
      const user = createUserList().find((item) => item.username === username)

      if (!user) return { code: 201, data: { message: '用户不存在' } }
      if (user.password !== password)
        return { code: 201, data: { message: '旧密码错误' } }
      if (password === newPassword)
        return { code: 201, data: { message: '新密码不能与旧密码相同' } }

      return { code: 200, data: { message: '密码修改成功，请重新登录' } }
    }
  },

  // 获取公告列表 (带排序和分页)
  {
    url: '/api/notice/list',
    method: 'get',
    response: ({ query }: { query: NoticeListQuery }) => {
      const pageSize = parseInt(query.pageSize as string) || 6
      const pageNo = parseInt(query.pageNo as string) || 1

      const sortedNotices = [...mockNotices].sort((a, b) => {
        if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1
        return (
          new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
        )
      })

      const start = (pageNo - 1) * pageSize
      const limitNotices = sortedNotices.slice(start, start + pageSize)

      return {
        code: 200,
        message: 'ok',
        data: {
          items: limitNotices,
          total: mockNotices.length,
          pageSize,
          pageNo
        }
      }
    }
  },

  // 发布公告
  {
    url: '/api/notice/publish',
    method: 'post',
    response: (request: MockRequest) => {
      const token = request.headers.token
      const user = createUserList().find((item) => item.token === token)
      if (!user || !user.roles.includes('admin')) {
        return { code: 201, data: { message: '无权发布公告' } }
      }

      const { title, content, isImportant } =
        request.body as PublishNoticeParams
      if (isImportant) {
        mockNotices.forEach((item) => (item.isImportant = false))
      }

      mockNotices.unshift({
        id: Date.now(),
        title,
        content,
        isImportant: !!isImportant,
        publishTime: new Date().toISOString(),
        publisher: user.username
      })

      return { code: 200, data: { message: '公告发布成功' } }
    }
  },

  // 1. 【查】获取/搜索历史昵称
  {
    url: '/api/user/nicknames',
    method: 'get',
    response: ({ query }: { query: NicknameQuery }) => {
      const { keyword } = query
      let result = [...mockNicknames]
      if (keyword) {
        result = result.filter((name) =>
          name.toLowerCase().includes(keyword.toLowerCase())
        )
      }
      return {
        code: 200,
        data: {
          message: keyword ? `搜索 "${keyword}" 成功` : '获取成功',
          nicknames: result
        }
      }
    }
  },

  // 2. 【增】新增昵称
  {
    url: '/api/user/nickname/add',
    method: 'post',
    response: ({ body }: { body: AddNicknameParams }) => {
      const { newName } = body
      if (!newName) return { code: 201, data: { message: '昵称不能为空' } }
      if (mockNicknames.includes(newName))
        return { code: 201, data: { message: '昵称已存在' } }
      mockNicknames.unshift(newName)
      return { code: 200, data: { message: '新增成功' } }
    }
  },

  // 3. 【改】修改昵称
  {
    url: '/api/user/nickname/update',
    method: 'put',
    response: ({ body }: { body: UpdateNicknameParams }) => {
      const { oldName, newName } = body
      const index = mockNicknames.indexOf(oldName)
      if (index === -1) return { code: 201, data: { message: '原昵称不存在' } }
      mockNicknames[index] = newName
      return { code: 200, data: { message: '修改成功' } }
    }
  },

  // 4. 【删】删除昵称
  {
    url: '/api/user/nickname/delete',
    method: 'delete',
    response: ({ query }: { query: NicknameQuery }) => {
      const { name } = query
      const index = mockNicknames.indexOf(name as string)
      if (index === -1) return { code: 201, data: { message: '昵称不存在' } }
      mockNicknames.splice(index, 1)
      return { code: 200, data: { message: '删除成功' } }
    }
  }
]
