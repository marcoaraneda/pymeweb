import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')

const generatedPaths = [
  path.join(publicDir, '_nuxt'),
  path.join(publicDir, '_payload.json'),
  path.join(publicDir, 'index.html'),
  path.join(publicDir, '200.html'),
  path.join(publicDir, '404.html'),
]

for (const targetPath of generatedPaths) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true })
    console.log(`Removed ${path.relative(projectRoot, targetPath)}`)
  }
}