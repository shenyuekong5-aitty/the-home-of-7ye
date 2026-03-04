import { createApp } from 'vue'
import './styles/index.scss'
import App from './App.vue'
import router from './router/index'

// 1. 导入 Element Plus 主组件
import ElementPlus from 'element-plus'
// 2. 导入 Element Plus 全局样式（关键！）
import 'element-plus/dist/index.css'

// 3. 创建 Pinia 实例
import pinia from './store/index'

// 4. 创建全局组件
import globalComponent from '@/components'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.use(globalComponent)
app.mount('#app')
