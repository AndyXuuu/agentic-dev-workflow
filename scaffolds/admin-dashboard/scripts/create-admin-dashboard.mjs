import { cpSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('..', import.meta.url))
const argument = process.argv[2]

if (!argument || argument === '--help') {
  console.log('Usage: npm run create -- /absolute/or/relative/target-directory')
  process.exit(argument === '--help' ? 0 : 1)
}

const target = isAbsolute(argument) ? resolve(argument) : resolve(process.cwd(), argument)
const fromSource = relative(sourceRoot, target)
if (target === sourceRoot || (!fromSource.startsWith(`..${sep}`) && fromSource !== '..')) {
  throw new Error('Target must be outside the scaffold source directory')
}
if (existsSync(target)) throw new Error(`Target already exists: ${target}`)

const parent = dirname(target)
mkdirSync(parent, { recursive: true })
const temporary = mkdtempSync(join(parent, `.${basename(target)}.tmp-`))
const excluded = new Set(['node_modules', 'dist', '.git', '.DS_Store'])
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

try {
  cpSync(sourceRoot, temporary, {
    recursive: true,
    filter(source) {
      const path = relative(sourceRoot, source)
      const firstSegment = path.split(sep)[0]
      return path === '' || !excluded.has(firstSegment)
    },
  })

  for (const args of [['ci'], ['run', 'verify']]) {
    const result = spawnSync(npmCommand, args, { cwd: temporary, stdio: 'inherit' })
    if (result.status !== 0) throw new Error(`Validation failed: npm ${args.join(' ')}`)
  }

  rmSync(join(temporary, 'node_modules'), { force: true, recursive: true })
  rmSync(join(temporary, 'dist'), { force: true, recursive: true })
  renameSync(temporary, target)
  console.log(`Created verified admin dashboard scaffold at ${target}`)
} catch (error) {
  rmSync(temporary, { force: true, recursive: true })
  throw error
}
