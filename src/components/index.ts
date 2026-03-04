import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type { App } from 'vue'

export default {
  install(app: App) {
    // 将 element-plus 提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
