import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteMockServe } from 'vite-plugin-mock'
import viteCompression from 'vite-plugin-compression' // 新增

const srcDir = path.resolve(__dirname, 'src')

export default defineConfig(({ mode }) => {
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
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: false,
        watchFiles: true
      }),
      // 新增：生成 .gz 压缩文件
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false
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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus']
          }
        }
      },
      // 新增：移除 console 和 debugger
      minify: 'esbuild',
      esbuildOptions: {
        drop: ['console', 'debugger']
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
