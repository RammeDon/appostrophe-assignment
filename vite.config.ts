import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],

  
  ...(command === 'serve' && process.env.NODE_ENV === 'production'
    ? { oxc: { jsx: { refresh: false } } }
    : {}),
}))
