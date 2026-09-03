import { createRequire } from 'node:module'
import { cp, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appName = 'DSH Desktop'
const bundleId = 'com.wg5x.dsh.desktop'

async function pathExists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function replacePlistValue(plist, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const pattern = new RegExp(`(<key>${key}</key>\\s*<string>)[^<]*(</string>)`)
  if (pattern.test(plist)) return plist.replace(pattern, `$1${escaped}$2`)
  return plist.replace('</dict>', `  <key>${key}</key><string>${escaped}</string>\n</dict>`)
}

function ensurePlistValue(plist, key, value) {
  if (new RegExp(`<key>${key}</key>`).test(plist)) return plist
  return plist.replace('</dict>', `  <key>${key}</key><string>${value}</string>\n</dict>`)
}

export async function patchInfoPlist(plistPath, options = {}) {
  const appNameValue = options.appName ?? appName
  const bundleIdValue = options.bundleId ?? bundleId
  let plist
  try {
    plist = await readFile(plistPath, 'utf8')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
    plist = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      '<plist version="1.0">',
      '<dict>',
      '  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>',
      '  <key>CFBundlePackageType</key><string>APPL</string>',
      '  <key>CFBundleVersion</key><string>0.1.0</string>',
      '  <key>CFBundleShortVersionString</key><string>0.1.0</string>',
      '</dict>',
      '</plist>',
      '',
    ].join('\n')
  }
  plist = replacePlistValue(plist, 'CFBundleDisplayName', appNameValue)
  plist = replacePlistValue(plist, 'CFBundleExecutable', appNameValue)
  plist = replacePlistValue(plist, 'CFBundleIdentifier', bundleIdValue)
  plist = replacePlistValue(plist, 'CFBundleName', appNameValue)
  plist = ensurePlistValue(plist, 'CFBundleInfoDictionaryVersion', '6.0')
  plist = ensurePlistValue(plist, 'CFBundlePackageType', 'APPL')
  plist = ensurePlistValue(plist, 'CFBundleShortVersionString', '0.1.0')
  plist = ensurePlistValue(plist, 'CFBundleVersion', '0.1.0')
  await writeFile(plistPath, plist, 'utf8')
}

async function copyInto(source, destination, options = {}) {
  await cp(source, destination, { recursive: true, verbatimSymlinks: true, ...options })
}

async function copyAppSource(appRoot, resourcesDir) {
  const appDir = join(resourcesDir, 'app')
  await rm(appDir, { recursive: true, force: true })
  await mkdir(appDir, { recursive: true })
  await copyInto(join(appRoot, 'package.json'), join(appDir, 'package.json'))
  await copyInto(join(appRoot, 'app'), join(appDir, 'app'))
  await copyInto(join(appRoot, 'runtime'), join(appDir, 'runtime'))
}

export async function packageMacGreen({
  electronAppTemplate,
  appRoot = scriptRoot,
  outputApp = join(scriptRoot, 'release', 'mac-green', `${appName}.app`),
  signApp = async () => undefined,
} = {}) {
  if (typeof electronAppTemplate !== 'string' || electronAppTemplate.trim() === '') throw new TypeError('electronAppTemplate is required')
  if (typeof appRoot !== 'string' || appRoot.trim() === '') throw new TypeError('appRoot is required')
  if (typeof outputApp !== 'string' || outputApp.trim() === '') throw new TypeError('outputApp is required')

  await rm(outputApp, { recursive: true, force: true })
  await mkdir(dirname(outputApp), { recursive: true })
  await copyInto(electronAppTemplate, outputApp)

  const contentsDir = join(outputApp, 'Contents')
  const resourcesDir = join(contentsDir, 'Resources')
  const electronExecutable = join(contentsDir, 'MacOS', 'Electron')
  const appExecutable = join(contentsDir, 'MacOS', appName)

  if (await pathExists(electronExecutable)) await rename(electronExecutable, appExecutable)
  await patchInfoPlist(join(contentsDir, 'Info.plist'))
  await rm(join(resourcesDir, 'default_app.asar'), { recursive: true, force: true })
  await copyAppSource(appRoot, resourcesDir)
  await signApp(outputApp)

  return { outputApp }
}

export function resolveElectronAppTemplate({ appRoot = scriptRoot } = {}) {
  const electronPackageRoot = dirname(require.resolve('electron/package.json', { paths: [appRoot] }))
  return join(electronPackageRoot, 'dist', 'Electron.app')
}

async function main() {
  const electronAppTemplate = resolveElectronAppTemplate({ appRoot: scriptRoot })
  const result = await packageMacGreen({ electronAppTemplate, appRoot: scriptRoot })
  process.stdout.write(`assembled DSH Desktop macOS green app at ${result.outputApp}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  await main()
}
