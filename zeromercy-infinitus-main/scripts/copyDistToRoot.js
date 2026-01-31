const fs = require('fs')
const path = require('path')

const dist = path.resolve(__dirname, '..', 'dist')
const root = path.resolve(__dirname, '..')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest)
    for (const item of fs.readdirSync(src)) {
      copyRecursive(path.join(src, item), path.join(dest, item))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

// Copy built files from dist to repo root (overwrites)
if (!fs.existsSync(dist)) {
  console.error('dist folder not found. Run vite build first.')
  process.exit(1)
}

for (const item of fs.readdirSync(dist)) {
  const src = path.join(dist, item)
  const dest = path.join(root, item)
  // avoid copying node_modules or package.json etc
  copyRecursive(src, dest)
}

console.log('Copied dist/* to project root')
