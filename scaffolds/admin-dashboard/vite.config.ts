import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'tests/browser/**'],
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
