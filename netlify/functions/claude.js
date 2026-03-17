// netlify/functions/claude.js
// ─────────────────────────────────────────────────────────────────────────────
// Proxies requests from the app to the Anthropic API.
// The user's own API key is passed in the request body — each user
// pays for their own usage and your key is never needed here.
// ─────────────────────────────────────────────────────────────────────────────

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    })
  }

  // Use the key from the request body (user's own key)
  const apiKey = body.apiKey
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'No API key provided. Add your Anthropic key in Settings.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: body.model || 'claude-sonnet-4-20250514',
      max_tokens: body.max_tokens || 1000,
      system: body.system || '',
      messages: body.messages || [],
    }),
  })

  const data = await anthropicRes.json()

  return new Response(JSON.stringify(data), {
    status: anthropicRes.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const config = {
  path: '/api/claude',
}
