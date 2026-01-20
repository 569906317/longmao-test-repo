import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 获取仓库名作为 base path（用于 GitHub Pages）
// 本地开发时为 '/'，生产构建时会使用仓库名
const base = process.env.GITHUB_ACTIONS ? '/logmao-test-repo/' : '/'

export default defineConfig({
  plugins: [vue()],
  base,
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
