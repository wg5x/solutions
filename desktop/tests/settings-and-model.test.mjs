import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import {
  createDefaultSettings,
  loadSettings,
  saveSettings,
} from '../runtime/settings.mjs'
import {
  buildChatRequest,
  resolveChatCompletionsUrl,
  sendChatCompletion,
} from '../runtime/model.mjs'

async function tempRoot() {
  return mkdtemp(join(tmpdir(), 'dsh-desktop-'))
}

test('createDefaultSettings returns a usable empty model config', () => {
  assert.deepEqual(createDefaultSettings(), {
    providerBaseUrl: '',
    apiKey: '',
    model: '',
    systemPrompt: '你是 DSH desktop 的基础对话助手。',
    temperature: 0.2,
  })
})

test('loadSettings falls back to defaults and saveSettings writes readable json', async () => {
  const root = await tempRoot()
  const file = join(root, 'settings.json')

  assert.deepEqual(await loadSettings(file), createDefaultSettings())

  const saved = {
    providerBaseUrl: 'https://api.deepseek.com',
    apiKey: 'secret-token',
    model: 'deepseek-chat',
    systemPrompt: '你是一个简洁助手。',
    temperature: 0.4,
  }
  await saveSettings(file, saved)

  assert.match(await readFile(file, 'utf8'), /"providerBaseUrl": "https:\/\/api\.deepseek\.com"/)
  assert.deepEqual(await loadSettings(file), saved)
})

test('resolveChatCompletionsUrl appends the standard chat endpoint', () => {
  assert.equal(
    resolveChatCompletionsUrl('https://api.deepseek.com'),
    'https://api.deepseek.com/v1/chat/completions',
  )
  assert.equal(
    resolveChatCompletionsUrl('https://api.deepseek.com/'),
    'https://api.deepseek.com/v1/chat/completions',
  )
})

test('buildChatRequest includes the system prompt, model, and temperature', () => {
  const request = buildChatRequest({
    providerBaseUrl: 'https://api.deepseek.com',
    apiKey: 'secret-token',
    model: 'deepseek-chat',
    systemPrompt: '你是一个简洁助手。',
    temperature: 0.4,
  }, [
    { role: 'user', content: '你好' },
  ])

  assert.equal(request.url, 'https://api.deepseek.com/v1/chat/completions')
  assert.equal(request.init.method, 'POST')
  assert.equal(request.init.headers.Authorization, 'Bearer secret-token')
  assert.equal(request.init.headers['content-type'], 'application/json')

  const body = JSON.parse(request.init.body)
  assert.deepEqual(body.messages, [
    { role: 'system', content: '你是一个简洁助手。' },
    { role: 'user', content: '你好' },
  ])
  assert.equal(body.model, 'deepseek-chat')
  assert.equal(body.temperature, 0.4)
})

test('sendChatCompletion posts to the model endpoint and returns the assistant reply', async () => {
  let captured
  const reply = await sendChatCompletion({
    settings: {
      providerBaseUrl: 'https://api.deepseek.com',
      apiKey: 'secret-token',
      model: 'deepseek-chat',
      systemPrompt: '你是一个简洁助手。',
      temperature: 0.2,
    },
    messages: [
      { role: 'user', content: '请说你好' },
    ],
    fetchFn: async (url, init) => {
      captured = { url, init }
      return new Response(JSON.stringify({
        choices: [{ message: { content: '你好' } }],
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    },
  })

  assert.equal(reply, '你好')
  assert.equal(captured.url, 'https://api.deepseek.com/v1/chat/completions')
  assert.equal(captured.init.headers.Authorization, 'Bearer secret-token')
})
