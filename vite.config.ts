import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // When NODE_ENV=production globally, @vitejs/plugin-react skips the refresh
  // preamble but OXC still injects $RefreshReg$ — disable refresh to match.
  ...(command === 'serve' && process.env.NODE_ENV === 'production'
    ? { oxc: { jsx: { refresh: false } } }
    : {}),
}))
