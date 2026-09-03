const api = window.dshDesktop

const state = {
  settings: null,
  messages: [],
  busy: false,
}

const els = {
  status: document.getElementById('status'),
  settingsForm: document.getElementById('settings-form'),
  providerBaseUrl: document.getElementById('provider-base-url'),
  apiKey: document.getElementById('api-key'),
  model: document.getElementById('model'),
  systemPrompt: document.getElementById('system-prompt'),
  temperature: document.getElementById('temperature'),
  conversation: document.getElementById('conversation'),
  chatForm: document.getElementById('chat-form'),
  messageInput: document.getElementById('message-input'),
}

function setStatus(text, tone = 'idle') {
  els.status.dataset.tone = tone
  els.status.textContent = text
}

function readSettingsFromForm() {
  return {
    providerBaseUrl: els.providerBaseUrl.value.trim(),
    apiKey: els.apiKey.value,
    model: els.model.value.trim(),
    systemPrompt: els.systemPrompt.value.trim(),
    temperature: Number(els.temperature.value) || 0,
  }
}

function fillSettingsForm(settings) {
  els.providerBaseUrl.value = settings.providerBaseUrl ?? ''
  els.apiKey.value = settings.apiKey ?? ''
  els.model.value = settings.model ?? ''
  els.systemPrompt.value = settings.systemPrompt ?? ''
  els.temperature.value = String(settings.temperature ?? 0.2)
}

function renderConversation() {
  if (state.messages.length === 0) {
    els.conversation.innerHTML = '<div class="empty-state">还没有对话，先配置模型再发送消息。</div>'
    return
  }

  els.conversation.innerHTML = state.messages.map(message => {
    const roleClass = message.role === 'user' ? 'message-user' : 'message-assistant'
    const label = message.role === 'user' ? '你' : 'DSH'
    return `
      <article class="message ${roleClass}">
        <span class="message-label">${label}</span>
        <div class="message-body"></div>
      </article>
    `
  }).join('')

  const bodies = els.conversation.querySelectorAll('.message-body')
  state.messages.forEach((message, index) => {
    bodies[index].textContent = message.content
  })
}

function setBusy(nextBusy) {
  state.busy = nextBusy
  els.chatForm.querySelector('button[type="submit"]').disabled = nextBusy
  els.settingsForm.querySelector('button[type="submit"]').disabled = nextBusy
}

async function loadSettings() {
  const settings = await api.getSettings()
  state.settings = settings
  fillSettingsForm(settings)
  setStatus('配置已载入', 'ready')
}

els.settingsForm.addEventListener('submit', async event => {
  event.preventDefault()
  setBusy(true)
  try {
    const saved = await api.saveSettings(readSettingsFromForm())
    state.settings = saved
    setStatus('配置已保存', 'ready')
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), 'error')
  } finally {
    setBusy(false)
  }
})

els.chatForm.addEventListener('submit', async event => {
  event.preventDefault()
  const content = els.messageInput.value.trim()
  if (!content || state.busy) return

  const settings = readSettingsFromForm()
  state.messages.push({ role: 'user', content })
  els.messageInput.value = ''
  renderConversation()
  setBusy(true)
  setStatus('正在请求模型...', 'busy')

  try {
    const reply = await api.sendChat({
      settings,
      messages: state.messages,
    })
    state.messages.push({ role: 'assistant', content: reply })
    renderConversation()
    setStatus('回复已生成', 'ready')
  } catch (error) {
    state.messages.push({
      role: 'assistant',
      content: error instanceof Error ? error.message : String(error),
    })
    renderConversation()
    setStatus('请求失败', 'error')
  } finally {
    setBusy(false)
  }
})

await loadSettings()
renderConversation()
