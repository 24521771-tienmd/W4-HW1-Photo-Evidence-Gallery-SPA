import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The whole stylesheet is ~6 kB, so inline it into index.html in production builds
// to remove the render-blocking CSS request.
function inlineCss() {
  return {
    name: 'inline-css',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html
      return html.replace(/<link rel="stylesheet"[^>]*href="\/?([^"]+\.css)"[^>]*>/g, (tag, file) => {
        const asset = bundle[file]
        if (!asset || asset.type !== 'asset') return tag
        delete bundle[file]
        return `<style>${asset.source}</style>`
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineCss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    passWithNoTests: true,
  },
})
