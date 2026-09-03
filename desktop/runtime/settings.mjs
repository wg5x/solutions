import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export function createDefaultSettings() {
  return {
    providerBaseUrl: '',
    apiKey: '',
    model: '',
    systemPrompt: '你是 DSH desktop 的基础对话助手。',
    temperature: 0.2,
  }
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function normalizeSettings(value = {}) {
  const defaults = createDefaultSettings()
  return {
    providerBaseUrl: cleanText(value.providerBaseUrl) || defaults.providerBaseUrl,
    apiKey: cleanText(value.apiKey) || defaults.apiKey,
    model: cleanText(value.model) || defaults.model,
    systemPrompt: cleanText(value.systemPrompt) || defaults.systemPrompt,
    temperature: toNumber(value.temperature, defaults.temperature),
  }
}

export async function loadSettings(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8')
    return normalizeSettings(JSON.parse(raw))
  } catch (error) {
    if (error?.code === 'ENOENT') return createDefaultSettings()
    throw error
  }
}

export async function saveSettings(filePath, settings) {
  const value = normalizeSettings(settings)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  return value
}
