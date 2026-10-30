import { createReadStream, statSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const unityBuildDirectory = path.resolve('public/games/hunterfoodweb/Build')
const unityBuildUrlPrefix = '/games/hunterfoodweb/Build/'

function unityBrotliAssets() {
  function serveBrotliAsset(request, response, next) {
    let pathname
    try {
      pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
    } catch {
      return next()
    }

    if (!pathname.startsWith(unityBuildUrlPrefix) || !pathname.endsWith('.br')) return next()
    const fileName = path.basename(pathname)
    const filePath = path.join(unityBuildDirectory, fileName)

    let size
    try {
      size = statSync(filePath).size
    } catch {
      return next()
    }

    const contentType = fileName.endsWith('.wasm.br')
      ? 'application/wasm'
      : fileName.endsWith('.js.br')
        ? 'application/javascript'
        : 'application/octet-stream'

    response.statusCode = 200
    response.setHeader('Content-Type', contentType)
    response.setHeader('Content-Encoding', 'br')
    response.setHeader('Content-Length', size)
    response.setHeader('Cache-Control', 'no-cache')
    if (request.method === 'HEAD') return response.end()
    return createReadStream(filePath).pipe(response)
  }

  return {
    name: 'unity-brotli-static-assets',
    configureServer(server) {
      server.middlewares.use(serveBrotliAsset)
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveBrotliAsset)
    },
  }
}

export default defineConfig({
  plugins: [react(), unityBrotliAssets()],
})
