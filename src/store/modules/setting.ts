import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  // 控制扩缩
  const isCollapse = ref(false)
  // 控制主题
  const themeColor = ref('#409EFF') // 初始值务必用 Hex
  const predefineColors = ref([
    '#409EFF',
    '#A0cfff',
    '#B3e19d',
    '#ffccaa',
    '#D9BBFF',
    '#82E1E1',
    '#95de64',
    '#ADD8E6'
  ])

  // 控制刷新
  const isRefresh = ref(false)

  // 扩缩函数
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 主题相关函数
  const mix = (color: string, weight: number) => {
    if (!color.startsWith('#')) return color

    let c = color.replace('#', '')
    // 处理简写 Hex 如 #f00
    if (c.length === 3) {
      c = c
        .split('')
        .map((char) => char + char)
        .join('')
    }

    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)

    // 计算并限制范围在 0-255，最后转为 16 进制
    const convert = (val: number) => {
      const mixed = Math.round(val * (1 - weight) + 255 * weight)
      const clamped = Math.max(0, Math.min(255, mixed))
      return clamped.toString(16).padStart(2, '0')
    }

    return `#${convert(r)}${convert(g)}${convert(b)}`
  }
  const setThemeColor = (color: string | null) => {
    if (!color) return
    themeColor.value = color
    const el = document.documentElement

    // 注入全局变量
    el.style.setProperty('--el-color-primary', color)
    el.style.setProperty('--el-color-primary-light-3', mix(color, 0.3))
    el.style.setProperty('--el-color-primary-light-9', mix(color, 0.5))

    // 同时也补全 Element 默认的其他梯度，确保所有组件正常
    for (let i = 1; i <= 9; i++) {
      el.style.setProperty(`--el-color-primary-light-${i}`, mix(color, i / 10))
    }
  }

  // 刷新相关函数
  const refresh = () => {
    isRefresh.value = !isRefresh.value
  }

  return {
    isCollapse,
    themeColor,
    predefineColors,
    isRefresh,
    toggleCollapse,
    setThemeColor,
    refresh
  }
})
