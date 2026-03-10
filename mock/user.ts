// TS类型引入
import type { LoginParams, MockRequest } from '../src/api/user/type.ts'
//createUserList:次函数执行会返回一个数组,数组里面包含两个用户信息
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
    },
    {
      userId: 3,
      avatar: './assets/images/avatar3.jpg',
      username: 'whx666',
      password: '123456',
      desc: '朋友',
      roles: ['admin'],
      routes: [
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
        'friend'
      ],
      token: 'WHX Token'
    },
    {
      userId: 4,
      avatar: './assets/images/avatar11.png',
      username: '3in777',
      password: '123456',
      desc: '朋友',
      roles: ['admin'],
      routes: [
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
        'friend'
      ],
      token: 'LYT Token'
    },
    {
      userId: 2,
      avatar: './assets/images/avatar2.jpg',
      username: 'test2',
      password: '000000',
      desc: '测试',
      roles: ['user'],
      routes: [
        'AboutNicknameHistory',
        'AboutBook',
        'AboutMusic',
        'AboutAnime',
        'AboutGame',
        'AboutQuote'
      ],
      token: 'Test Token'
    }
  ]
}

// / --- 1. 新增：公告数据模拟 ---
// 在真实 Mock 服务中，为了能“发布”后立刻能“看到”，我们定义一个外部变量存储
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

//对外暴露一个数组:数组里面包含多个接口
export default [
  // 用户登录接口
  {
    url: '/api/user/login', //请求地址
    method: 'post', //请求方式
    response: ({ body }: { body: LoginParams }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body
      //调用获取用户信息函数,用于判断是否有此用户
      const user = createUserList().find(
        (item) => item.username === username && item.password === password
      )
      //没有用户返回失败信息
      if (!user) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      //如果有返回成功信息
      const { token } = user
      return { code: 200, data: { token } }
    }
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request: MockRequest) => {
      //获取请求头携带token
      const token = request.headers.token
      //查看用户信息是否包含有次token用户
      const user = createUserList().find((item) => item.token === token)
      //没有返回失败的信息
      if (!user) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      //如果有返回成功信息
      return { code: 200, data: { user } }
    }
  },
  // 退出登录接口
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: {
          message: '退出登录成功'
        }
      }
    }
  },
  // 修改密码接口
  {
    url: '/api/user/change-password',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { username, oldPassword, newPassword } = body

      // 1. 查找用户
      const user = createUserList().find((item) => item.username === username)

      // 2. 校验逻辑
      if (!user) {
        return { code: 201, data: { message: '用户不存在' } }
      }
      if (user.password !== oldPassword) {
        return { code: 201, data: { message: '旧密码错误' } }
      }
      if (oldPassword === newPassword) {
        return { code: 201, data: { message: '新密码不能与旧密码相同' } }
      }

      // 3. 返回成功（Mock 环境下数据不会真实持久化到源码数组，仅模拟返回）
      return {
        code: 200,
        data: {
          message: '密码修改成功，请重新登录'
        }
      }
    }
  },
  // 获取公共接口
  {
    url: '/api/notice/list',
    method: 'get',
    response: ({ query }) => {
      // 1. 获取前端传来的参数（如果没有传，默认显示 6 条）
      const pageSize = parseInt(query.pageSize) || 6
      const pageNo = parseInt(query.pageNo) || 1

      // 2. 增强版排序逻辑
      const sortedNotices = [...mockNotices].sort((a, b) => {
        // 优先级 1：是否置顶 (Important)
        if (a.isImportant !== b.isImportant) {
          return a.isImportant ? -1 : 1
        }
        // 优先级 2：发布时间 (倒序)
        return (
          new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
        )
      })

      // 3. 模拟分页/截取
      const start = (pageNo - 1) * pageSize
      const end = pageNo * pageSize
      const limitNotices = sortedNotices.slice(start, end)

      return {
        code: 200,
        message: 'ok',
        data: {
          items: limitNotices,
          total: mockNotices.length, // 总条数，前端用来判断是否显示“更多”或者分页
          pageSize: pageSize,
          pageNo: pageNo
        }
      }
    }
  },
  // 发布公告接口
  {
    url: '/api/notice/publish',
    method: 'post',
    response: (request: MockRequest) => {
      // 1. 权限校验
      const token = request.headers.token
      const user = createUserList().find((item) => item.token === token)

      if (!user || !user.roles.includes('admin')) {
        return { code: 201, data: { message: '无权发布公告，仅限管理员' } }
      }

      const { title, content, isImportant } = request.body

      // 2. 处理唯一“重要”标识 (修复这里的逻辑)
      if (isImportant) {
        // 关键修复：补全变量名，并将其他所有公告设为非重要
        mockNotices.forEach((item) => {
          item.isImportant = false
        })
      }

      // 3. 创建新公告
      const newNotice = {
        id: Date.now(),
        title,
        content,
        isImportant: !!isImportant, // 确保是布尔值
        // 使用更规范的时间格式，方便 list 接口排序
        publishTime: new Date().toISOString(),
        publisher: user.username
      }

      // 4. 插入数组
      mockNotices.unshift(newNotice)

      return {
        code: 200,
        data: {
          message: '公告发布成功'
        }
      }
    }
  },
  // 获取历史昵称
  {
    url: '/api/user/nicknames',
    method: 'get',
    response: () => {
      return {
        code: 200,
        // 按照你图片的逻辑，message 被包在了 data 里面
        data: {
          message: 'ok',
          nicknames: mockNicknames // 把数组放进对象里
        }
      }
    }
  }
]
