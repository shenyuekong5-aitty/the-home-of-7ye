import { defineStore } from 'pinia'

// 定义 State 的类型接口
interface RouteState {
  matched: string[]
}

export const useRouteStore = defineStore('route', {
  state: (): RouteState => {
    return {
      matched: [] // 初始为空字符串数组
    }
  },
  actions: {
    /**
     * 设置匹配的路由信息
     * @param matched 必须是字符串数组
     */
    setMatched(matched: string[]) {
      this.matched = matched
    }
  }
})
