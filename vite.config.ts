import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
// 引入 Mock 插件
import { viteMockServe } from 'vite-plugin-mock'

const srcDir = path.resolve(__dirname, 'src')

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      visualizer({
        open: true,
        filename: 'stats.html', // 报告会生成在项目根目录
        gzipSize: true,
        brotliSize: true
      }),
      // Mock 插件配置
      viteMockServe({
        mockPath: 'mock',
        enable: false,
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
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true
        }
      }
    }
  }
})
