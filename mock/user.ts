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
    content: '服务器将于今晚 22:00 进行常规维护，预计时长 1 小时。',
    publishTime: '2026-03-09 10:00:00',
    isImportant: false, // 是否重要
    publisher: 'Admin'
  },
  {
    id: 2,
    title: '欢迎来到个人空间',
    content: '这是最新的公告系统，管理员可以发布置顶公告。',
    publishTime: '2026-03-09 12:00:00',
    isImportant: true, // 标记为最重要/首条
    publisher: 'Admin'
  }
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
    response: () => {
      // 逻辑：将 isImportant 为 true 的排在最前面，其余按时间倒序
      const sortedNotices = [...mockNotices].sort((a, b) => {
        if (a.isImportant) return -1
        if (b.isImportant) return 1
        return (
          new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
        )
      })

      return {
        code: 200,
        data: {
          items: sortedNotices,
          total: sortedNotices.length
        }
      }
    }
  },
  // 发布公告接口
  {
    url: '/api/notice/publish',
    method: 'post',
    response: (request: MockRequest) => {
      // 简单校验权限：检查 Token 是否为管理员
      const token = request.headers.token
      const user = createUserList().find((item) => item.token === token)

      if (!user || !user.roles.includes('admin')) {
        return { code: 201, data: { message: '无权发布公告，仅限管理员' } }
      }

      const { title, content, isImportant } = request.body

      // 如果当前发布的是“重要”公告，需要把之前的“重要”标记取消（保证只有一条首显）
      if (isImportant) {
        mockNotices = mockNotices.map((item) => ({
          ...item,
          isImportant: false
        }))
      }

      const newNotice = {
        id: Date.now(),
        title,
        content,
        isImportant: !!isImportant,
        publishTime: new Date().toLocaleString(),
        publisher: user.username
      }

      mockNotices.unshift(newNotice) // 添加到数组最前面

      return {
        code: 200,
        data: {
          message: '公告发布成功'
        }
      }
    }
  }
]
