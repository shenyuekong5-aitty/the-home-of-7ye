// TS类型引入
import { id } from 'element-plus/es/locales.mjs'
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
      avatar: './assets/images/users/avatars/avatar2.jpg',
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
      userId: 2,
      avatar: './assets/images/users/avatars/avatar9.jpg',
      username: 'unitty',
      password: '123456',
      desc: '朋友',
      roles: ['friend'],
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
      userId: 3,
      avatar: './assets/images/users/avatars/avatar3.jpg',
      username: 'why666',
      password: '123456',
      desc: '朋友',
      roles: ['friend'],
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
      avatar: './assets/images/users/avatars/avatar5.jpg',
      username: '3in777',
      password: '123456',
      desc: '朋友',
      roles: ['friend'],
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
      userId: 5,
      avatar: './assets/images/avatar2.jpg',
      username: 'test2',
      password: '000000',
      desc: '测试',
      roles: ['user'],
      routes: ['AboutNicknameHistory', 'AboutBook', 'AboutMusic', 'AboutAnime', 'AboutGame', 'AboutQuote'],
      token: 'Test Token'
    }
  ]
}

const mockNotices = [
  {
    id: 1,

    title: '系统维护通知',

    content: '服务器将于今晚 22:00 进行常规维护，预计时长 1 小时。维护期间部分功能可能受限，请提前保存工作。',

    publishTime: '2026-03-09 10:00:00',

    isImportant: false,

    publisher: 'Admin'
  },

  {
    id: 2,

    title: '欢迎来到个人空间',

    content: '这是最新的公告系统，管理员可以发布置顶公告。你可以在这里查看最新的系统动态和功能更新日志。',

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

    content: '首页新增了“日落倒计时”与“法定节假日倒计时”。现在你可以清晰地看到距离放假还有多久啦！',

    publishTime: '2026-03-10 15:00:00',

    isImportant: false,

    publisher: 'System'
  },

  {
    id: 5,

    title: '🚀 性能优化公告',

    content: '我们优化了 API 拦截器的解析逻辑，现在页面加载速度提升了约 30%，修复了之前部分数据层级读取失败的问题。',

    publishTime: '2026-03-11 11:20:00',

    isImportant: false,

    publisher: 'Developer'
  },

  {
    id: 6,

    title: '植树节特别活动',

    content: '春天来啦！明天就是 3 月 12 日植树节，虽然我们在数字世界工作，也别忘了给窗台的小盆栽浇浇水哦~',

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

  'tyi',

  '冬瓜哩个西西'
]

// 书籍模块
const mockBooks = [
  {
    id: 1,
    bookName: '平凡的世界',
    author: '路遥',
    brief: '全景式地展现中国当代城乡社会生活的长篇小说',
    cover: './assets/images/books/book1.jpg'
  },
  {
    id: 2,
    bookName: '小巷人家',
    author: '大米',
    brief: '以苏州小巷为背景，讲述普通人家的烟火人生',
    cover: './assets/images/books/book2.jpg'
  },
  {
    id: 3,
    bookName: '三体',
    author: '刘慈欣',
    brief: '中国科幻文学的里程碑之作，讲述人类与三体文明的交锋',
    cover: './assets/images/books/book3.jpg'
  },
  {
    id: 4,
    bookName: '云边有个小卖铺',
    author: '张嘉佳',
    brief: '关于思念、成长和告别的温暖故事',
    cover: './assets/images/books/book4.jpg'
  },
  {
    id: 5,
    bookName: '嫌疑人X的献身',
    author: '东野圭吾',
    brief: '极致的推理与极致的爱情交织的经典悬疑小说',
    cover: './assets/images/books/book5.jpg'
  },
  {
    id: 6,
    bookName: '罪与罚',
    author: '陀思妥耶夫斯基',
    brief: '探讨人性、道德与救赎的经典文学著作',
    cover: './assets/images/books/book6.jpg'
  },
  {
    id: 7,
    bookName: '哑舍',
    author: '玄色',
    brief: '围绕古董展开的古风奇幻故事，融合历史与传说',
    cover: './assets/images/books/book7.jpg'
  },
  {
    id: 8,
    bookName: '龙族',
    author: '江南',
    brief: '少年与龙族的热血冒险，融合青春与幻想',
    cover: './assets/images/books/book8.jpg'
  },
  {
    id: 9,
    bookName: '人间失格',
    author: '太宰治',
    brief: '剖析自我与社会的矛盾，展现人性的孤独与挣扎',
    cover: './assets/images/books/book9.jpg'
  },
  {
    id: 10,
    bookName: '活着',
    author: '余华',
    brief: '讲述一个人一生的苦难与坚韧，直面生命的本质',
    cover: './assets/images/books/book10.jpg'
  },
  {
    id: 11,
    bookName: '第七天',
    author: '余华',
    brief: '以荒诞的笔触描绘死后世界，折射现实的冷暖',
    cover: './assets/images/books/book11.jpg'
  },
  {
    id: 12,
    bookName: '素食者',
    author: '韩江',
    brief: '以女性视角探讨身份、暴力与自我觉醒',
    cover: './assets/images/books/book12.jpg'
  },
  {
    id: 13,
    bookName: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    brief: '用诗意的语言探讨爱与成长的寓言故事',
    cover: './assets/images/books/book13.jpg'
  },
  {
    id: 14,
    bookName: '恶意',
    author: '东野圭吾',
    brief: '深挖人性深处的恶意，反转式的推理佳作',
    cover: './assets/images/books/book14.jpg'
  },
  {
    id: 15,
    bookName: '双城记',
    author: '狄更斯',
    brief: '以法国大革命为背景，讲述爱与牺牲的经典',
    cover: './assets/images/books/book15.jpg'
  },
  {
    id: 16,
    bookName: '月亮与六便士',
    author: '毛姆',
    brief: '探讨理想与现实、艺术与生活的冲突',
    cover: './assets/images/books/book16.jpg'
  },
  {
    id: 17,
    bookName: '解忧杂货店',
    author: '东野圭吾',
    brief: '跨越时空的温暖故事，治愈每一个迷茫的心灵',
    cover: './assets/images/books/book17.jpg'
  },
  {
    id: 18,
    bookName: '摆渡人',
    author: '克莱儿·麦克福尔',
    brief: '关于死亡、救赎与爱的奇幻治愈小说',
    cover: './assets/images/books/book18.jpg'
  },
  {
    id: 19,
    bookName: '疯人说：精神病院医生手记',
    author: '穆戈',
    brief: '记录精神病院的真实故事，窥见人性的多面',
    cover: './assets/images/books/book19.jpg'
  },
  {
    id: 20,
    bookName: '病隙碎笔',
    author: '史铁生',
    brief: '在病痛中思考生命、苦难与信仰的随笔集',
    cover: './assets/images/books/book20.jpg'
  },
  {
    id: 21,
    bookName: '布鲁克林有棵树',
    author: '贝蒂·史密斯',
    brief: '讲述贫民窟女孩的成长，传递希望与坚韧',
    cover: './assets/images/books/book21.jpg'
  },
  {
    id: 22,
    bookName: '被讨厌的勇气',
    author: '岸见一郎/古贺史健',
    brief: '以阿德勒心理学为核心，探讨自由与幸福',
    cover: './assets/images/books/book22.jpg'
  },
  {
    id: 23,
    bookName: '山茶文具店',
    author: '小川糸',
    brief: '以代笔店为载体，书写温柔的人间故事',
    cover: './assets/images/books/book23.jpg'
  },
  {
    id: 24,
    bookName: '在细雨中呐喊',
    author: '余华',
    brief: '回望童年与故乡，展现生命的真实与荒诞',
    cover: './assets/images/books/book24.jpg'
  },
  {
    id: 25,
    bookName: '她的国',
    author: '夏洛特·珀金斯·吉尔曼',
    brief: '乌托邦式的女性主义经典，构想理想的女性国度',
    cover: './assets/images/books/book25.jpg'
  },
  {
    id: 26,
    bookName: '一间属于自己的房间',
    author: '弗吉尼亚·伍尔夫',
    brief: '探讨女性与写作、独立与自由的经典随笔',
    cover: './assets/images/books/book26.jpg'
  }
]

// 音乐模块
const mockMusics = [
  { name: '起风了', author: '买辣椒也用券' },
  { name: '笔记', author: '周笔畅' },
  { name: '烟火里的尘埃', author: '华晨宇' },
  { name: '好像爱这个世界', author: '华晨宇' },
  { name: '打上花火', author: 'DAOKO / 米津玄師' },
  { name: '东京不太热', author: '洛天依 / 初心社' },
  { name: '口是心非', author: '张雨生' },
  { name: '走马', author: '陈粒' },
  { name: '天下', author: '张杰' },
  { name: '不染', author: '毛不易' },
  { name: '消愁', author: '毛不易' },
  { name: '像我这样的人', author: '毛不易' },
  { name: '此生不换', author: '青鸟飞鱼' },
  { name: '东西', author: '林俊呈' },
  { name: 'Ngau Hung', author: 'Hoaprox' },
  { name: '烟袋斜街', author: '音阙诗听 / 赵方婧' },
  { name: 'letter', author: 'Iris' },
  { name: 'Flower Dance', author: 'DJ Okawari' },
  { name: 'luv letter', author: 'DJ Okawari' },
  { name: 'trap queen', author: 'Fetty Wap' },
  { name: 'Aruarian Dance', author: 'Nujabes' },
  { name: '呓语', author: '毛不易' },
  { name: '水星记', author: '郭顶' },
  { name: '年轮', author: '张碧晨' },
  { name: 'III', author: 'Atheletics' },
  { name: 'IV', author: 'Mapps/AK' },
  { name: '从你的全世界路过', author: '牛奶咖啡' },
  { name: 'Yakitori', author: 'Noicybino' }, // 常见纯音乐
  { name: 'THEMEX', author: '泽野弘之' },
  { name: 'Meant To Be', author: 'Bebe Rexha / Florida Georgia Line' },
  { name: 'Contact', author: 'Daft Punk' },
  { name: 'The Garden of Escapism', author: 'Miro' },
  { name: 'Merry Christmas Mr.Lawrence', author: '坂本龙一' },
  { name: '开始懂了', author: '孙燕姿' },
  { name: '我记得', author: '赵雷' },
  { name: '偏爱', author: '张芸京' },
  { name: '城南花已开', author: '三亩地' },
  { name: 'luv u 2', author: 'Seto' },
  { name: '海街寺庙', author: '七月的星期七' }
]

// 番剧模块
const mockAnimes = [
  {
    id: 1,
    name: '关于我转生为史莱姆这档事',
    coverImg: '../assets/images/animes/A1.png',
    author: '伏濑',
    brief: '上班族转生异世界成为史莱姆，开启传奇冒险'
  },
  {
    id: 2,
    name: 'Overlord',
    coverImg: '../assets/images/animes/A2.png',
    author: '丸山黄金',
    brief: '游戏停服，主角化身最强魔法师统治异世界'
  },
  {
    id: 3,
    name: '全职猎人',
    coverImg: '../assets/images/animes/A3.png',
    author: '富坚义博',
    brief: '少年为寻父踏上猎人考试的惊险旅程'
  },
  {
    id: 4,
    name: '月光下的异世界之旅',
    coverImg: '../assets/images/animes/A4.png',
    author: '白米良',
    brief: '被召唤到异世界，主角凭借超强能力开启逆袭人生'
  },
  {
    id: 5,
    name: '魔王学院的不适任者',
    coverImg: '../assets/images/animes/A5.png',
    author: '秋',
    brief: '史上最强魔王转生，在学院里轻松碾压一切对手'
  },
  {
    id: 6,
    name: 'JOJO的奇妙冒险',
    coverImg: '../assets/images/animes/A6.png',
    author: '荒木飞吕彦',
    brief: '乔斯达家族跨越百年的热血与宿命传奇'
  },
  {
    id: 7,
    name: '野良神',
    coverImg: '../assets/images/animes/A7.png',
    author: '安达渡嘉',
    brief: '落魄神明与少女共同解决世间怪异事件'
  },
  {
    id: 8,
    name: '鬼灭之刃',
    coverImg: '../assets/images/animes/A8.png',
    author: '吾峠呼世晴',
    brief: '少年为救妹妹踏上斩鬼之路，热血又催泪'
  },
  {
    id: 9,
    name: '死神',
    coverImg: '../assets/images/animes/A9.png',
    author: '久保带人',
    brief: '高中生化身死神，守护人间与灵界的平衡'
  },
  {
    id: 10,
    name: '火影忍者',
    coverImg: '../assets/images/animes/A10.png',
    author: '岸本齐史',
    brief: '孤儿鸣人立志成为火影，守护村子与伙伴'
  },
  {
    id: 11,
    name: '七龙珠',
    coverImg: '../assets/images/animes/A11.png',
    author: '鸟山明',
    brief: '悟空寻找龙珠，成长为宇宙最强战士'
  },
  {
    id: 12,
    name: '七龙珠Z',
    coverImg: '../assets/images/animes/A12.png',
    author: '鸟山明',
    brief: '悟空与伙伴保卫地球，对抗外星强敌'
  },
  {
    id: 13,
    name: '七龙珠GT',
    coverImg: '../assets/images/animes/A13.png',
    author: '鸟山明',
    brief: '悟空变小后再度踏上宇宙冒险之旅'
  },
  {
    id: 14,
    name: '犬夜叉',
    coverImg: '../assets/images/animes/A14.png',
    author: '高桥留美子',
    brief: '少女穿越战国时代，与半妖犬夜叉共寻四魂之玉'
  },
  {
    id: 15,
    name: '银魂',
    coverImg: '../assets/images/animes/A15.png',
    author: '空知英秋',
    brief: '万事屋三人组的搞笑与热血日常'
  },
  {
    id: 16,
    name: '恶魔奶爸',
    coverImg: '../assets/images/animes/A16.png',
    author: '田村隆平',
    brief: '不良少年意外成为魔王之子的奶爸'
  },
  {
    id: 17,
    name: '夏日重现',
    coverImg: '../assets/images/animes/A17.png',
    author: '田中靖规',
    brief: '男主回到家乡，陷入时间循环拯救亲友'
  },
  {
    id: 18,
    name: '死亡笔记',
    coverImg: '../assets/images/animes/A18.png',
    author: '大场鸫、小畑健',
    brief: '天才少年捡到死亡笔记，与侦探展开智斗'
  },
  {
    id: 19,
    name: '咒术回战',
    coverImg: '../assets/images/animes/A19.png',
    author: '芥见下下',
    brief: '少年加入咒术高专，对抗诅咒守护世界'
  },
  {
    id: 20,
    name: '海贼王',
    coverImg: '../assets/images/animes/A20.png',
    author: '尾田荣一郎',
    brief: '路飞带领伙伴寻找One Piece，成为海贼王'
  },
  {
    id: 21,
    name: '怪医黑杰克',
    coverImg: '../assets/images/animes/A21.png',
    author: '手冢治虫',
    brief: '无执照天才医生，用医术拯救各类患者'
  },
  {
    id: 22,
    name: '城市猎人',
    coverImg: '../assets/images/animes/A22.png',
    author: '北条司',
    brief: '帅气侦探解决城市案件，守护正义'
  },
  {
    id: 23,
    name: '樱桃小丸子',
    coverImg: '../assets/images/animes/A23.png',
    author: '樱桃子',
    brief: '小丸子一家温馨搞笑的日常生活故事'
  },
  {
    id: 24,
    name: '哆啦A梦',
    coverImg: '../assets/images/animes/A24.png',
    author: '藤子·F·不二雄',
    brief: '蓝胖子用神奇道具陪伴大雄成长'
  },
  {
    id: 25,
    name: '蜡笔小新',
    coverImg: '../assets/images/animes/A25.png',
    author: '臼井仪人',
    brief: '搞怪小新与家人朋友的爆笑日常'
  }
]

// 游戏模块
const mockGames = [
  {
    id: 1,
    name: '星露谷',
    coverImg: '../assets/images/games/G1.jpg',
    author: 'ConcernedApe',
    brief: '经典农场模拟经营游戏，种田钓鱼养老神作'
  },
  {
    id: 2,
    name: '饥荒',
    coverImg: '../assets/images/games/G2.jpg',
    author: 'Klei Entertainment',
    brief: '荒野求生类沙盒游戏，硬核生存挑战'
  },
  {
    id: 3,
    name: '文明6',
    coverImg: '../assets/images/games/G3.jpg',
    author: 'Firaxis Games',
    brief: '史诗级回合制策略游戏，建立属于你的文明'
  },
  {
    id: 4,
    name: '霍格沃茨之遗',
    coverImg: '../assets/images/games/G4.jpg',
    author: 'Avalanche Software',
    brief: '哈利波特世界观开放世界魔法冒险'
  },
  {
    id: 5,
    name: '东京幽灵线',
    coverImg: '../assets/images/games/G5.jpg',
    author: 'Tango Gameworks',
    brief: '东京奇幻都市冒险，超能力对战妖魔鬼怪'
  },
  {
    id: 6,
    name: '双人成行',
    coverImg: '../assets/images/games/G6.jpg',
    author: 'Hazelight Studios',
    brief: '必玩双人合作冒险神作，互动解谜闯关'
  },
  {
    id: 7,
    name: 'GTA5',
    coverImg: '../assets/images/games/G7.jpg',
    author: 'Rockstar',
    brief: '开放式自由世界动作冒险经典大作'
  },
  {
    id: 8,
    name: 'Sherlock Holmes',
    coverImg: '../assets/images/games/G8.jpg',
    author: 'Frogwares',
    brief: '福尔摩斯系列侦探推理解谜游戏'
  },
  {
    id: 9,
    name: 'The crew2',
    coverImg: '../assets/images/games/G9.jpg',
    author: 'Ubisoft',
    brief: '开放式载具竞速游戏，海陆空全能狂飙'
  },
  {
    id: 10,
    name: 'Thief Simulator',
    coverImg: '../assets/images/games/G10.jpg',
    author: 'Noble Muffins',
    brief: '小偷模拟类游戏，潜行偷窃任务挑战'
  },
  {
    id: 11,
    name: 'This War of Mine',
    coverImg: '../assets/images/games/G11.jpg',
    author: '11 Bit Studios',
    brief: '战争背景生存模拟，体验平民苦难'
  },
  {
    id: 12,
    name: '方舟',
    coverImg: '../assets/images/games/G12.jpg',
    author: 'Studio Wildcard',
    brief: '恐龙题材生存建造沙盒游戏'
  },
  {
    id: 13,
    name: '炼爱',
    coverImg: '../assets/images/games/G13.jpg',
    author: '独立开发者',
    brief: '文字恋爱养成互动剧情游戏'
  },
  {
    id: 14,
    name: '究极风暴',
    coverImg: '../assets/images/games/G14.jpg',
    author: 'CyberConnect2',
    brief: '火影忍者正版授权格斗对战游戏'
  },
  {
    id: 15,
    name: '白色情人节',
    coverImg: '../assets/images/games/G15.jpg',
    author: 'Rootstudio',
    brief: '校园恐怖题材解谜冒险游戏'
  },
  {
    id: 16,
    name: '学园构想家',
    coverImg: '../assets/images/games/G16.jpg',
    author: '国产独立游戏',
    brief: '校园模拟经营建造类游戏'
  },
  {
    id: 17,
    name: '纪元1800',
    coverImg: '../assets/images/games/G17.jpg',
    author: 'Ubisoft',
    brief: '工业时代城市建造经营策略游戏'
  },
  {
    id: 18,
    name: '王者荣耀',
    coverImg: '../assets/images/games/G18.jpg',
    author: '腾讯天美',
    brief: '国民级MOBA手机对战游戏'
  },
  {
    id: 19,
    name: '火影忍者',
    coverImg: '../assets/images/games/G19.jpg',
    author: '腾讯魔方',
    brief: '火影正版IP动作格斗手游'
  },
  {
    id: 20,
    name: '时空召唤',
    coverImg: '../assets/images/games/G20.jpg',
    author: '银汉游戏',
    brief: '科幻风MOBA竞技对战手游'
  },
  {
    id: 21,
    name: '罪恶都市',
    coverImg: '../assets/images/games/G21.jpg',
    author: 'Rockstar',
    brief: 'GTA经典开放世界动作冒险怀旧神作'
  },
  {
    id: 22,
    name: '帝国时代',
    coverImg: '../assets/images/games/G22.jpg',
    author: '微软',
    brief: '历史题材即时战略经典游戏系列'
  },
  {
    id: 23,
    name: '魔兽',
    coverImg: '../assets/images/games/G23.jpg',
    author: '暴雪',
    brief: '经典魔兽争霸与魔兽世界系列'
  },
  {
    id: 24,
    name: '流星蝴蝶剑',
    coverImg: '../assets/images/games/G24.jpg',
    author: '昱泉国际',
    brief: '国风武侠动作格斗经典单机'
  },
  {
    id: 25,
    name: '血战上海滩',
    coverImg: '../assets/images/games/G25.jpg',
    author: '欢乐亿派',
    brief: '国产经典抗日题材射击游戏'
  },
  {
    id: 26,
    name: '真三国无双',
    coverImg: '../assets/images/games/G26.jpg',
    author: '光荣特库摩',
    brief: '三国题材割草无双动作游戏'
  },
  {
    id: 27,
    name: '植物大战僵尸',
    coverImg: '../assets/images/games/G27.jpg',
    author: 'PopCap',
    brief: '经典塔防休闲益智小游戏'
  },
  {
    id: 28,
    name: '炸弹堂',
    coverImg: '../assets/images/games/G28.jpg',
    author: 'Nexon',
    brief: '经典Q版炸弹人对战休闲游戏'
  },
  {
    id: 29,
    name: '水果忍者',
    coverImg: '../assets/images/games/G29.jpg',
    author: 'Halfbrick',
    brief: '触屏切水果休闲解压手游'
  },
  {
    id: 30,
    name: '汤姆猫',
    coverImg: '../assets/images/games/G30.jpg',
    author: 'Outfit7',
    brief: '会说话的汤姆猫养成互动小游戏'
  },
  {
    id: 31,
    name: '我的世界',
    coverImg: '../assets/images/games/G31.jpg',
    author: 'Mojang',
    brief: '全球现象级沙盒创造建造游戏'
  },
  {
    id: 32,
    name: '遗弃之地',
    coverImg: '../assets/images/games/G32.jpg',
    author: '独立开发者',
    brief: '废土题材生存冒险RPG游戏'
  },
  {
    id: 33,
    name: '英雄联盟',
    coverImg: '../assets/images/games/G33.jpg',
    author: '拳头游戏',
    brief: '全球顶级MOBA竞技端游'
  },
  {
    id: 34,
    name: '邪恶天才2',
    coverImg: '../assets/images/games/G34.jpg',
    author: 'Rebellion',
    brief: '反派基地模拟经营策略游戏'
  },
  {
    id: 35,
    name: '求生之路',
    coverImg: '../assets/images/games/G35.jpg',
    author: 'Valve',
    brief: '经典四人合作丧尸射击游戏'
  },
  {
    id: 36,
    name: '死神vs火影',
    coverImg: '../assets/images/games/G36.jpg',
    author: '5Dplay',
    brief: '动漫题材同人格斗小游戏'
  },
  {
    id: 37,
    name: '拳皇2002风云再起',
    coverImg: '../assets/images/games/G37.jpg',
    author: 'SNK',
    brief: '经典街机格斗拳皇系列'
  },
  {
    id: 38,
    name: '街机游戏',
    coverImg: '../assets/images/games/G38.jpg',
    author: '经典合集',
    brief: '怀旧街机游戏经典大合集'
  },
  {
    id: 39,
    name: '小霸王游戏',
    coverImg: '../assets/images/games/G39.jpg',
    author: '怀旧合集',
    brief: '童年经典小霸王游戏机游戏合集'
  },
  {
    id: 40,
    name: '饥饿鲨',
    coverImg: '../assets/images/games/G40.jpg',
    author: '育碧',
    brief: '大鱼吃小鱼类吞噬进化休闲手游'
  },
  {
    id: 41,
    name: '黄金矿工',
    coverImg: '../assets/images/games/G41.jpg',
    author: 'GameRival',
    brief: '经典挖矿休闲小游戏'
  }
]

// 心理模块
// 情绪记录 Mock 数据
const mockEmotions = [
  {
    userid: 0,
    id: 1,
    author: '空神月',
    content: '很多情绪表达不出来',
    time: '2020.02.28',
    like: 12,
    remarks: ['零人在意']
  },
  { userid: 0, id: 2, author: '九日言', content: '很久很久没哭过了', time: '2021.04.06', like: 8, remarks: [] },
  { userid: 0, id: 3, author: '落九天', content: '感觉现实淡淡的', time: '2022.07.03', like: 5, remarks: [] },
  { userid: 0, id: 4, author: '库洛洛', content: '世界雾蒙蒙的，有点灰色', time: '2023.12.12', like: 15, remarks: [] },
  {
    userid: 0,
    id: 5,
    author: '你看我',
    content: '感觉跟真实的世界之间隔了一层什么东西',
    time: '2024.09.13',
    like: 9,
    remarks: []
  },
  { userid: 0, id: 6, author: '东方月', content: '控制不住自己情绪的低落', time: '2025.01.29', like: 20, remarks: [] },
  { userid: 0, id: 7, author: '原初零', content: '焦虑得睡不着', time: '2025.05.09', like: 7, remarks: [] },
  { userid: 0, id: 7, author: '空神月', content: '心悸', time: '2026.03.09', like: 3, remarks: [] }
]
// 信条模块
const mockCreeds = [
  {
    id: 1,
    content: '长短不如短痛'
  }
]
// 名言模块
const mockQuotes = [
  {
    id: 1,
    content:
      '这个世界上有很多路，但是你每走一条道路，就觉得难，就退缩，就换路，那么能走的路只会越来越少，到最后只剩，死路一条'
  },
  {
    id: 2,
    content: '五行缺水的少年，却被冠于旭烨之名'
  },
  {
    id: 3,
    content: '我自己的故事太无聊了，我沉溺于别人的故事'
  },
  {
    id: 4,
    content: '雨水是连接天空与大地的线条'
  },
  {
    id: 5,
    content: '世界百无聊赖，灵魂与书籍沟通'
  },
  {
    id: 6,
    content: '梦境再一次让我触及到了完整的灵魂'
  },
  {
    id: 7,
    content: '每个人都面临着清算'
  },
  {
    id: 8,
    content: '「宇宙坍缩成一颗蓝珀，而我是被困在夜核的磷火」'
  },
  {
    id: 9,
    content: '「风把黄昏碾成紫雾，而夜是神明垂落的痂。」'
  },
  {
    id: 10,
    content: '「他用叹息浇灌夜色，于是冰川在子夜绽放出莺尾。」'
  },
  {
    id: 11,
    content: '你可以是我的星辰，也可以是我的月亮，可是你在我的世界里却偏偏像个小太阳'
  }
]
// 标签模块
const mockTags = [
  {
    id: 1,
    content: '低配得感'
  },
  {
    id: 2,
    content: '习得性无助'
  },
  {
    id: 3,
    content: '回避型依恋'
  },
  {
    id: 4,
    content: 'infj'
  },
  {
    id: 5,
    content: 'Gemini'
  },
  {
    id: 6,
    content: '场依存'
  }
]
// 命题模块
// 命题模块
const mockCognitions = [
  {
    id: 1,
    title: '关于朋友的命题',
    content:
      '我始终认为，朋友是在困难的时候给予精神上的鼓励以及自己力所能及的物质上的支持，至少不应该是落井下石，在朋友处于困境时非凡不给予帮助，反而嘲弄，感受自身的优越感，而在朋友成功时又嫉妒，眼红，不该是这样的，但这是人性中无法避免的一面，人类这种生活始终被七宗罪死死的捆锁着，却又被包裹在积极正向的能量与消极负向的能量行成的泡沫中，但是我坚持认为，君子论迹不论心，论心世上无完人，假如我伪善一辈子呢？在朋友需要帮助时彰显自身的存在，在朋友胜利时不屑、嫉妒，轮到自己时呢，这样会有真正的朋友吗？可能因为一时的运气让你站在高处，可是，后面呢？难道一辈子这样吗？人就是这种成群、互帮互助的存在，人类这种物种本来就是社会性动物，很多时候不过是千人千面，逢场作戏罢了，但是难道就真的没有真心为你好，真正因为你的成功感到开心，真正因为你处于痛苦而痛苦的人吗？有吧，是爱吧，爱这种体验虽然是种飘忽不定的东西，但是我认为它始终是存在的',
    cognize_time: '2026.2.28 12:28 阴天、高铁',
    favorite: 12,
    remarks: ['']
  },
  {
    id: 2,
    title: '关于梦的部分命题',
    content:
      '我们总认为，那些梦中真实的经历，是另一个世界的体验,有没有可能只是你的意识，或者说你魂魄的一部分，附着到了他人的身上,我刚才就附着到了沐浴在太阳雨下走向死亡之人的临终过程,梦里的人，场景都是熟悉的，因为只是你的一部分意识，或者一部分魂魄附着到了别人身上，你的其他更大的部分，将梦中的人、环境同化成了你现实中的投射,而且往往被你附着的人，是跟你很相近之人,也许是不同轮回的自己,或者有没有一种可能，关于你以前存在于大脑中的记录等一切都是虚假的，就像Boltzmann Brain一样，一切都只在这一瞬间重组存在，此刻你的人生才刚刚开始，你是从另一个场景中死亡的人，投射到了现在这个生活上🤔',
    cognize_time: ' 2004.03.06 谁记得具体时间呢',
    favorite: 1299,
    remarks: ['']
  },
  {
    id: 3,
    title: '关于梦的命题2',
    content:
      '有时候感觉做过的梦很熟悉，好像是重复做过很多次，但是每次在细节上又都会有一点点的不同，好像是为了微调某种细节，纠正剧情的走向🤔',
    cognize_time: '2026.4.1 07:39',
    favorite: 24,
    remarks: ['']
  },
  {
    id: 4,
    title: '关于“客气”的命题',
    content:
      '小时候总是被教育着要客气点，客人给的东西不能随便拿，之类的，但是他们只告诉我这种行为，但是却没告诉我这种行为背后的含义，以至于我一直畏畏缩缩的，甚至于别人给我礼物我都不敢接受，虽然我懂的要回礼云云，但是总是有种急切的、别人给我东西我就要马上还给别人的心理,直到上大学，走出了原来的环境，切换世界的视角审视原来，我才感受到了不同，第一次察觉是在广科，跟Hb一起坐伯伯一个朋友的车去学校，那一次司机大哥拿了林檎还是什么的给我们，Hb很自然的接过了,我很诧异，一般我都是推脱的不要的，即使有时候内心是想要的，但是Hb就那么自然而然的接受了,后来就是在跟三水三金and3in的相处过程中，我们有过好几次礼物往来，即使面对这种情况我还是会不知所措，不知道是怕朋友破费，还是原生的不配得感，反正就是很囧，但是又怕辜负朋友好意，很矛盾，原来我懂得的是别人给我礼物我就要回礼，这是礼尚往来，后面我思考到了更深的层次，我发现这是关系的存续，是羁绊的生命线，即使是现在，我接受了朋友的礼物仍然会有想迫切回礼的心理，这很奇怪，但是我学着不那么急躁了，好像不管是学习还是什么，我都在急于求成，但是同时我也明白欲速则不达的道理',
    cognize_time: '2026.3.27 18:42',
    favorite: 12,
    remarks: ['']
  },
  {
    id: 5,
    title: '关于学习的命题',
    content:
      '做中学&先去学:我在闲鱼上看到有人帮忙steam清理假入库问题，我感觉我也会，其实我不确定，但是我就是发布了，很快就有人来找我了，我硬着头皮上，一开始是跟着视频教程，老是搞不出来，最后只能用geek卸载，然后重装steam，后来我觉得这样太慢了，而且客户的游戏会消失，得重新安装，我又自己去研究，然后看一些教程，总结出了一套属于自己的笔记:清理假入库办法:1.Get-ExecutionPolicy，查看当前电脑对脚本的执行策略:Restricted为默认，表示禁止所有脚本;Unrestricted则表示允许所有脚本，危险！！我自己电脑上的是RemoteSigned，因为我电脑上需要执行自己的一些脚本 1.2.Set-ExecutionPolicy Restricted，改回严格模式 2.打开steam所在文件删除hid.dll，appcache文件  3.win+R键入%AppData%/stool，删除里面的文件  4.win+R键入%LocalAppData%，找到SteamActive跟Steam文件 5.Get-MpPreference | Select-Object -ExpandProperty ExclusionPath，假入库/盗版入库工具为了不被杀毒软件查杀，会自动把自己的目录添加到 Defender 的排除列表里。- 这行代码就是用来检查：是否还有之前假入库工具留下的排除路径残留（比如  E:\e  这种可疑目录）， 如果发现有可疑路径，就可以手动删除，彻底清除  5.2.清理办法:Remove-MpPreference -ExclusionPath "E:\e",把  "E:\e"  替换成你要删除的路径即可,不过基本上只要win➕r键入%AppData%/stool，清理掉里面的文件，win➕r键入%LocalAppData%，清理掉Steam跟SteamActive相关的文件，然后打开steam文件所在位置，清理掉hid.dll基本就没问题了，Get-ExecutionPolicy基本就是查看系统是否允许脚本执行的权限有没有被更改,跑题了，以上不是重点，重点是这种学习办法，以及我现在的复盘，这才是真正的学习，可能我没办法很好的表达出来，但是我已经隐隐触及到某些东西的核心了,我记录下来，防止忘记这种感觉,我基本上算是悟到了这个命题，但是还没有彻底掌握，我记录他,我甚至透过其感受到了生命的本质，有什么东西改变了，齿轮开始转动了……',
    cognize_time: '2026.2.28 02:19',
    favorite: 112,
    remarks: ['']
  },
  {
    id: 6,
    title: '关于爱的命题',
    content:
      '今天跟朋友聊天的时候涉及到了关于爱方面的命题，很幸运，他跟我都是思维正常的男性，而不是那种以是不是处、睡过多少女生为荣的人,首先第一点，我觉得不管是结婚还是发生关系，女性都处于劣势的一方，不管是未婚先孕还是结婚，对于女性都是不公平的，所以我们应该对女性多些包容和理解，譬如:发生完关系之后，女性怀孕了，如果男性不负责，那么结局可想而知了;即使男性负责，但是由于现实导致的经济能力不足,打胎，那么对于女性的伤害也是极大的;其次，如果双方没有在一起，女性的下一任也可能会在意女性是不是净身状态，云云；第二点，人本质上是受激素控制的动物，情绪上头了，发生了关系很正常，我们没办法泯灭人的本性，但是首先第一点，我们可以采取避孕措施，而不是诸如想体验无套云云，即使真的导致意外了，如果在能力允许的情况下或许可以让小孩降世，但是这件事是否对错，那是另一个命题了，我以后或许会补充，现在不想打断思路，最后，即使打胎了，男方依旧可以把持负责的态度，即使情绪下头了，我依旧认为身为男生，应该把持住自己的责任，负起相应的责任，这是态度问题，全凭良心和人品，朋友说到，他有一个女性朋友，一直到打胎那一步，中间的步骤也是男生出的钱，负的责，我觉得到此没有问题，但是，他说了但是，我脑海里立刻响起了oh no，是的，那个男生跟其他女生聊骚，我持批判态度，诸如我身边一个认识了挺多年的人，在跟女方关系尚且不确定，还处于黏黏糊糊状态的时候便发生了关系，这点我保持怀疑态度，我认为应该在结婚之后，最少应该在明确确认关系之后才允许发生关系，但是我也知道氛围到极点了，人难免办错事，但是后续负责全凭男性态度，那家伙在这点上做得挺不错的，他们在毕业后确定了关系，也算是负起了责任，但是关于他说的类似于“如果在婚前让她怀孕，那她就是我的人了”，我又持批判态度了，即使这确实有益于男性，比如减少彩礼叫板成本云云；第三点，我是04年的，牡丹solo，有人会说我幼稚，甚至说我圣母，我也知道上述很多我认为不正确的想法对于男方来说具有很强的诱惑力，也许我会接受这是因为我没有这些经历所以才会有如此想法，即使世界上很多人都是持上述我认为不准确态度的，但是我并不觉得我便是错的，反而，我很庆幸，我在介入这些关系之前便已经深度思考过，我觉得这个世界上肯定有不少人在经历过这些之后，甚至年长于我十岁，二十岁之人都没思考过这些，我也知道有很多东西很难做到，比如情绪上头后发生关系，比如情绪下头后不想负责，这些确实都很难做到，但此刻的我仍然保持这些想法，最后，我也知道人是会变得，我将这些记录下来，如果日后的我被世俗侵扰，我希望这段文字能帮我回归本心；补充，昨天跟发小出去也聊到了相似的话题，他跟他的前女友，谈了四年多，分手了，他说她是一个保守的人，即使在感情最上头的第二年里，即使已经开好房间，女生依旧把持住了界限，关于他们分开了，我深表遗憾，但是现在的我已经处于能够理解双方苦楚的阶段了，发小的想法也没有什么错误，他是纯爱，也会负起相应的责任，女生在结婚后才允许发生关系，但是对于现阶段的我们又谈何容易呢？没有家庭的兜底，能力没有特别出众，运气没有特别好，拿着5 6千的工资，凭什么给对方幸福，这里又要涉及到关于结婚的命题了，这次我不做表述，以防打扰思路;对于女方，说实话我很赞赏这样洁身自好的女性，现在快餐式的社会，很多女生轻而易举的给出自己的身体，我个人持否定态度，后来我们聊到，不过这样也有好处，发小说:或许我们将来会复合，但是在中间间断的期间，我能相信她仍然是干净的，我觉得他的想法没什么问题，也许现阶段的他们彼此都不够成熟，在各自的经济、想法、情感都更成熟之后，也许能给彼此更好的未来；终语:人与人的关系是极其复杂的，人是会变的，也许是双方都变了，也许是A方变了，也许是B方变了，也许双方都不变，从数学概率上来看，两个人像初始一样的概率只有1/4。你以为人与人的对话是你与我双方，其实有6个人，我以为的我，以为的你，以为的我，以为的你，真正的你，真正的我。但是人与人的关系也可以很简单，一次以内心深处最纯粹的爱驱动的行为',
    cognize_time: '2026.2.24 00:00',
    favorite: 120,
    remarks: ['']
  }
]

// 对外暴露接口数组
export default [
  // 用户登录接口
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }: { body: LoginParams }) => {
      const { username, password } = body
      const user = createUserList().find(item => item.username === username && item.password === password)
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
      const user = createUserList().find(item => item.token === token)
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
      const user = createUserList().find(item => item.username === username)

      if (!user) return { code: 201, data: { message: '用户不存在' } }
      if (user.password !== password) return { code: 201, data: { message: '旧密码错误' } }
      if (password === newPassword) return { code: 201, data: { message: '新密码不能与旧密码相同' } }

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
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
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
      const user = createUserList().find(item => item.token === token)
      if (!user || !user.roles.includes('admin')) {
        return { code: 201, data: { message: '无权发布公告' } }
      }

      const { title, content, isImportant } = request.body as PublishNoticeParams
      if (isImportant) {
        mockNotices.forEach(item => (item.isImportant = false))
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
        result = result.filter(name => name.toLowerCase().includes(keyword.toLowerCase()))
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
      if (mockNicknames.includes(newName)) return { code: 201, data: { message: '昵称已存在' } }
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
  },
  // 获取书籍列表
  {
    url: '/api/book/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockBooks,
          message: '获取书籍列表成功'
        }
      }
    }
  },
  // 获取音乐列表
  // 获取番剧列表
  {
    url: '/api/anime/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockAnimes,
          message: '获取番剧列表成功'
        }
      }
    }
  },
  // 获取游戏列表
  {
    url: '/api/game/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockGames,
          message: '获取游戏列表成功'
        }
      }
    }
  },
  // 获取心理列表
  {
    url: '/api/emotion/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockEmotions,
          message: '获取心理列表成功'
        }
      }
    }
  },
  // 获取信条列表
  {
    url: '/api/creed/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockCreeds,
          message: '获取信条列表成功'
        }
      }
    }
  },
  // 获取名言列表
  {
    url: '/api/quote/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockQuotes,
          message: '获取名言列表成功'
        }
      }
    }
  },
  // 获取标签列表
  {
    url: '/api/tag/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockTags,
          message: '获取标签列表成功'
        }
      }
    }
  },
  {
    url: '/api/cognition/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          items: mockCognitions,
          message: '获取认知列表成功'
        }
      }
    }
  }
]
