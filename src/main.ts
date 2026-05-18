import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'
import router from './router/index'

// .创建 Pinia 实例
import pinia from './store/index'

// 创建全局组件
import globalComponent from '@/components'

// 引入路由守卫（权限校验逻辑）
import './permission'

// 引入自定义指令
import { permission } from '@/directives/permission'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(globalComponent)
app.directive('permission', permission)
app.mount('#app')
