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
      username: 'why666',
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
//对外暴露一个数组:数组里面包含两个接口
//登录假的接口
//获取用户信息的假的接口
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
  }
]
