import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { packageMacGreen, patchInfoPlist } from '../scripts/package-mac-green.mjs'

async function tempRoot() {
  return mkdtemp(join(tmpdir(), 'dsh-mac-package-'))
}

async function makeElectronTemplate(root) {
  const template = join(root, 'Electron.app')
  await mkdir(join(template, 'Contents', 'MacOS'), { recursive: true })
  await mkdir(join(template, 'Contents', 'Frameworks'), { recursive: true })
  await mkdir(join(template, 'Contents', 'Resources'), { recursive: true })
  await writeFile(join(template, 'Contents', 'MacOS', 'Electron'), 'electron-binary')
  await writeFile(join(template, 'Contents', 'Resources', 'electron.icns'), 'icon')
  await writeFile(join(template, 'Contents', 'Info.plist'), [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<plist version="1.0">',
    '<dict>',
    '  <key>CFBundleDisplayName</key><string>Electron</string>',
    '  <key>CFBundleExecutable</key><string>Electron</string>',
    '  <key>CFBundleIdentifier</key><string>org.electronjs.electron</string>',
    '  <key>CFBundleName</key><string>Electron</string>',
    '  <key>CFBundleVersion</key><string>1.0.0</string>',
    '</dict>',
    '</plist>',
    '',
  ].join('\n'))
  return template
}

test('patchInfoPlist rewrites the macOS bundle identity', async () => {
  const root = await tempRoot()
  const plist = join(root, 'Info.plist')
  await writeFile(plist, '<plist version="1.0"><dict></dict></plist>')

  await patchInfoPlist(plist, {
    appName: 'DSH Desktop',
    bundleId: 'com.example.dsh.desktop',
  })

  const text = await readFile(plist, 'utf8')
  assert.match(text, /CFBundleDisplayName.*DSH Desktop/s)
  assert.match(text, /CFBundleExecutable.*DSH Desktop/s)
  assert.match(text, /CFBundleIdentifier.*com\.example\.dsh\.desktop/s)
})

test('packageMacGreen copies the app source into a macOS green bundle', async () => {
  const root = await tempRoot()
  const template = await makeElectronTemplate(root)
  const appRoot = join(root, 'app-root')
  const outputApp = join(root, 'release', 'DSH Desktop.app')

  await mkdir(join(appRoot, 'app', 'renderer'), { recursive: true })
  await mkdir(join(appRoot, 'runtime'), { recursive: true })
  await writeFile(join(appRoot, 'package.json'), '{"name":"desktop"}')
  await writeFile(join(appRoot, 'app', 'main.mjs'), 'export {}')
  await writeFile(join(appRoot, 'app', 'preload.cjs'), 'module.exports = {}')
  await writeFile(join(appRoot, 'app', 'renderer', 'index.html'), '<!doctype html>')
  await writeFile(join(appRoot, 'runtime', 'settings.mjs'), 'export {}')

  const result = await packageMacGreen({
    electronAppTemplate: template,
    appRoot,
    outputApp,
    signApp: async () => undefined,
  })

  assert.equal(result.outputApp, outputApp)
  assert.equal(await readFile(join(outputApp, 'Contents', 'MacOS', 'DSH Desktop'), 'utf8'), 'electron-binary')
  assert.match(await readFile(join(outputApp, 'Contents', 'Info.plist'), 'utf8'), /DSH Desktop/)
  assert.equal(await readFile(join(outputApp, 'Contents', 'Resources', 'app', 'package.json'), 'utf8'), '{"name":"desktop"}')
  assert.equal(await readFile(join(outputApp, 'Contents', 'Resources', 'app', 'app', 'main.mjs'), 'utf8'), 'export {}')
  assert.equal(await readFile(join(outputApp, 'Contents', 'Resources', 'app', 'app', 'preload.cjs'), 'utf8'), 'module.exports = {}')
  assert.equal(await readFile(join(outputApp, 'Contents', 'Resources', 'app', 'runtime', 'settings.mjs'), 'utf8'), 'export {}')
})

test('run script prefers the green bundle and falls back to electron', async () => {
  const script = await readFile('/Users/wgxxx/solutions/desktop/run-dsh-desktop.command', 'utf8')
  assert.match(script, /APP_PATH="release\/mac-green\/DSH Desktop\.app"/)
  assert.match(script, /open -a "\$APP_PATH"/)
  assert.match(script, /node_modules\/electron\/dist\/Electron\.app\/Contents\/MacOS\/Electron/)
})
