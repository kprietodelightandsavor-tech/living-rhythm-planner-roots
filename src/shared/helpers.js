// ── UNIQUE ID ─────────────────────────────────────────────────────────────────
export const uid = () => Math.random().toString(36).slice(2, 9)

// ── TODAY STRING ──────────────────────────────────────────────────────────────
export const todayStr = () => new Date().toISOString().slice(0, 10)

// ── FORMAT DATE ───────────────────────────────────────────────────────────────
export const formatDate = (str) => {
  if (!str) return ''
  const d = new Date(str + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
export const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

// ── API KEY STORAGE ───────────────────────────────────────────────────────────
const API_KEY_STORAGE = 'lrp-api-key'

export const getApiKey = () => {
  try { return localStorage.getItem(API_KEY_STORAGE) || null } catch { return null }
}
export const saveApiKey = (key) => {
  try { localStorage.setItem(API_KEY_STORAGE, key) } catch {}
}
export const clearApiKey = () => {
  try { localStorage.removeItem(API_KEY_STORAGE) } catch {}
}

// ── CALL CLAUDE VIA NETLIFY FUNCTION ─────────────────────────────────────────
// All AI calls route through /api/claude (netlify/functions/claude.js)
// The user's own API key is sent in the request — they pay for their own usage.
export const callClaude = async (prompt, systemPrompt = '') => {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_KEY')

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey,
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt || 'You are a warm, knowledgeable Charlotte Mason homeschool guide. Be specific, practical, and encouraging. Keep responses concise.',
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!response.ok) throw new Error('API error')
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.content.map(b => b.text || '').join('')
}

// ── CALL CLAUDE WITH IMAGE (vision) ──────────────────────────────────────────
export const callClaudeWithImage = async ({ base64, mediaType, textPrompt, systemPrompt = '' }) => {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_KEY')

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey,
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: textPrompt },
        ],
      }],
    }),
  })
  if (!response.ok) throw new Error('API error')
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.content.map(b => b.text || '').join('')
}
