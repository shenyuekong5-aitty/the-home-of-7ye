import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入 Mock 插件
import { viteMockServe } from 'vite-plugin-mock'

const srcDir = path.resolve(__dirname, 'src')

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      // Mock 插件配置
      viteMockServe({
        // 重点：设置为 true 才会读取项目根目录下的 /mock 文件夹
        mockPath: 'mock',
        // 保证在开发环境（npm run dev）时启用
        enable: mode === 'development',
        // 这样配置后，所有的 mock 接口也会自动带上 /api 前缀，保持与环境变量一致
        watchFiles: true // 监视文件更改，热更新 mock
      })
    ],
    resolve: {
      alias: {
        '@': srcDir
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${path.resolve(srcDir, 'styles/variable.scss').replace(/\\/g, '/')}";`,
          silenceDeprecations: ['import']
        }
      }
    },
    server: {
      // 当 Mock 开启时，通常不需要配置 proxy 也能工作
      // 但保留这个结构方便你以后切换到真实接口
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
