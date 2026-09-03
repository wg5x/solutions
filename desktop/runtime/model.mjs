function cleanBaseUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('请先配置模型服务地址')
  }
  return value.trim().replace(/\/+$/, '')
}

export function resolveChatCompletionsUrl(providerBaseUrl) {
  const baseUrl = cleanBaseUrl(providerBaseUrl)
  if (/\/v1$/i.test(baseUrl)) return `${baseUrl}/chat/completions`
  if (/\/chat\/completions$/i.test(baseUrl)) return baseUrl
  return `${baseUrl}/v1/chat/completions`
}

export function buildChatRequest(settings, messages) {
  if (!settings?.apiKey?.trim()) throw new Error('请先配置模型 API Key')
  if (!settings?.model?.trim()) throw new Error('请先配置模型名称')
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('至少需要一条对话消息')
  }

  const systemPrompt = settings.systemPrompt?.trim()
  const requestMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages

  return {
    url: resolveChatCompletionsUrl(settings.providerBaseUrl),
    init: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.apiKey.trim()}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model.trim(),
        messages: requestMessages,
        temperature: settings.temperature,
        stream: false,
      }),
    },
  }
}

function readReply(payload) {
  const content = payload?.choices?.[0]?.message?.content
  if (typeof content === 'string' && content.trim() !== '') return content
  throw new Error('模型没有返回可显示的内容')
}

export async function sendChatCompletion({ settings, messages, fetchFn = fetch }) {
  const request = buildChatRequest(settings, messages)
  const response = await fetchFn(request.url, request.init)
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = payload?.error?.message ?? `HTTP ${response.status}`
    throw new Error(`模型请求失败：${detail}`)
  }
  return readReply(payload)
}
