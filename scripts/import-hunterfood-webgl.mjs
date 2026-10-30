import { brotliCompressSync, constants } from 'node:zlib'
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceDirectory = process.argv[2]
if (!sourceDirectory) {
  throw new Error('Indica la carpeta del build WebGL de HunterFoodWeb.')
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryDirectory = path.resolve(scriptDirectory, '..')
const sourceBuildDirectory = path.join(sourceDirectory, 'Build')
const sourceTemplateDirectory = path.join(sourceDirectory, 'TemplateData')
const targetDirectory = path.join(repositoryDirectory, 'public/games/hunterfoodweb')
const targetBuildDirectory = path.join(targetDirectory, 'Build')
const targetTemplateDirectory = path.join(targetDirectory, 'TemplateData')

const buildFiles = ['HunterFoodWeb.wasm', 'HunterFoodWeb.data', 'HunterFoodWeb.framework.js']
for (const file of [...buildFiles, 'HunterFoodWeb.loader.js']) {
  if (!existsSync(path.join(sourceBuildDirectory, file))) {
    throw new Error(`No se encontró ${file} dentro de ${sourceBuildDirectory}`)
  }
}
if (!existsSync(sourceTemplateDirectory)) {
  throw new Error(`No se encontró TemplateData dentro de ${sourceDirectory}`)
}

mkdirSync(targetBuildDirectory, { recursive: true })
mkdirSync(targetTemplateDirectory, { recursive: true })
copyFileSync(path.join(sourceBuildDirectory, 'HunterFoodWeb.loader.js'), path.join(targetBuildDirectory, 'HunterFoodWeb.loader.js'))

for (const entry of readdirSync(sourceTemplateDirectory, { withFileTypes: true })) {
  if (entry.name === '.DS_Store' || entry.name === 'style.css') continue
  cpSync(path.join(sourceTemplateDirectory, entry.name), path.join(targetTemplateDirectory, entry.name), { recursive: true })
}

let totalCompressedBytes = 0
for (const file of buildFiles) {
  const compressed = brotliCompressSync(readFileSync(path.join(sourceBuildDirectory, file)), {
    params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
  })
  writeFileSync(path.join(targetBuildDirectory, `${file}.br`), compressed)
  totalCompressedBytes += compressed.byteLength
  process.stdout.write(`${file}: ${(compressed.byteLength / 1024 / 1024).toFixed(1)} MB Brotli\n`)
}

process.stdout.write(`Build WebGL importado (${(totalCompressedBytes / 1024 / 1024).toFixed(1)} MB comprimidos).\n`)
