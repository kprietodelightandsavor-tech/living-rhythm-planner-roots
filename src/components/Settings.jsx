// ── SETTINGS SCREEN ───────────────────────────────────────────────────────────
// Edit this file to change the Settings page and API key onboarding flow.

import React, { useState } from 'react'
import { getApiKey, saveApiKey, clearApiKey } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

// ── API KEY GATE ──────────────────────────────────────────────────────────────
// Wrap any AI-powered screen with this component.
// First time: shows full walkthrough. After key is saved: shows children.
// Usage: <ApiKeyGate featureName="Narration Coach">{...your screen...}</ApiKeyGate>

export function ApiKeyGate({ featureName, children }) {
  const [key, setKey] = useState(() => getApiKey())
  const [draft, setDraft] = useState('')
  const [step, setStep] = useState('prompt') // prompt | walkthrough | enter
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  if (key) return children

  const handleSave = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      setError('Please paste your API key first.')
      return
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('That doesn\'t look like an Anthropic key. It should start with sk-ant- and is found at console.anthropic.com under API Keys.')
      return
    }
    saveApiKey(trimmed)
    setKey(trimmed)
    setSaved(true)
  }

  // ── Initial prompt ────────────────────────────────────────────────────────
  if (step === 'prompt') return (
    <div className="screen">
      <div style={{ textAlign: 'center', padding: '2rem 0 1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✦</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
          {featureName}
        </h2>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
          This feature uses AI — you'll need your own Anthropic API key to use it.
        </p>
      </div>

      <div className="card card-gold">
        <h3 className="card-title">What is an API key?</h3>
        <p className="card-body" style={{ marginBottom: '0.75rem' }}>
          Think of it like a personal account with Anthropic (the company that makes Claude AI). Your key connects this app to Claude on your behalf — you're billed directly for your own usage, typically just a few dollars a month for daily family use.
        </p>
        <p className="card-note">Your key is stored only on your device and never shared with anyone.</p>
      </div>

      <div className="card">
        <h3 className="card-title">What does it cost?</h3>
        <p className="card-body">
          Anthropic charges per use — not a subscription. For a homeschool family using narration coaching, watercolor coaching, and book search daily, expect roughly <strong>$1–3 per month</strong>. You only pay for what you actually use.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
        <button className="btn btn-gold" style={{ justifyContent: 'center', padding: '0.85rem' }}
          onClick={() => setStep('walkthrough')}>
          Show me how to get a key →
        </button>
        <button className="btn btn-outline" style={{ justifyContent: 'center' }}
          onClick={() => setStep('enter')}>
          I already have a key
        </button>
      </div>
    </div>
  )

  // ── Walkthrough ───────────────────────────────────────────────────────────
  if (step === 'walkthrough') return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Get Your API Key</h2>
        <p className="screen-sub">Takes about 2 minutes</p>
      </div>

      {[
        {
          n: '1',
          title: 'Create a free Anthropic account',
          body: 'Go to console.anthropic.com in your browser. Click "Sign up" and create a free account with your email.',
          note: 'Anthropic is the company that makes Claude — the same AI behind this app.',
        },
        {
          n: '2',
          title: 'Add a credit card',
          body: 'Once logged in, go to Billing and add a payment method. You won\'t be charged until you actually use the AI features.',
          note: 'Set a usage limit if you want — $5/month is plenty for a family.',
        },
        {
          n: '3',
          title: 'Create your API key',
          body: 'Click "API Keys" in the left sidebar, then "Create Key." Give it any name (like "Living Rhythm Planner"). Copy the key — it starts with sk-ant-',
          note: 'You only see the key once, so copy it before closing that screen.',
        },
        {
          n: '4',
          title: 'Paste it here',
          body: 'Come back to this app and paste your key below. It saves to your device only.',
          note: null,
        },
      ].map((s, i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, flexShrink: 0,
          }}>{s.n}</div>
          <div style={{ flex: 1 }}>
            <h3 className="card-title" style={{ marginBottom: '0.35rem' }}>{s.title}</h3>
            <p className="card-body" style={{ marginBottom: s.note ? '0.4rem' : 0 }}>{s.body}</p>
            {s.note && <p className="card-note">{s.note}</p>}
          </div>
        </div>
      ))}

      <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
        className="btn btn-gold" style={{ justifyContent: 'center', padding: '0.85rem', textDecoration: 'none', display: 'flex', marginBottom: '0.65rem' }}>
        Open console.anthropic.com ↗
      </a>

      <button className="btn btn-outline" style={{ justifyContent: 'center', width: '100%' }}
        onClick={() => setStep('enter')}>
        I have my key — paste it now →
      </button>
    </div>
  )

  // ── Enter key ─────────────────────────────────────────────────────────────
  if (step === 'enter') return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Paste Your Key</h2>
        <p className="screen-sub">Saved only to this device</p>
      </div>

      <div className="card">
        <label className="form-label">
          Anthropic API Key
          <input
            className="form-input"
            value={draft}
            onChange={e => { setDraft(e.target.value); setError('') }}
            placeholder="sk-ant-..."
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }}
          />
        </label>
        {error && <p className="error-text" style={{ marginTop: '0.4rem' }}>{error}</p>}
        <p className="card-note" style={{ marginTop: '0.5rem' }}>
          Your key is stored on your device only. It's never sent to anyone except Anthropic when you use an AI feature.
        </p>
      </div>

      <button className="btn btn-gold" style={{ justifyContent: 'center', padding: '0.85rem', width: '100%' }}
        onClick={handleSave} disabled={!draft.trim()}>
        Save Key & Continue →
      </button>

      <button className="btn btn-outline" style={{ justifyContent: 'center', width: '100%', marginTop: '0.65rem' }}
        onClick={() => setStep('walkthrough')}>
        ← Back to walkthrough
      </button>
    </div>
  )

  return null
}

// ── SETTINGS SCREEN ───────────────────────────────────────────────────────────
export default function Settings() {
  const [currentKey, setCurrentKey] = useState(() => getApiKey())
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const handleSave = () => {
    const trimmed = draft.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Anthropic keys start with sk-ant- — check that you copied the full key.')
      return
    }
    saveApiKey(trimmed)
    setCurrentKey(trimmed)
    setDraft('')
    setError('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleClear = () => {
    clearApiKey()
    setCurrentKey(null)
    setDraft('')
    setConfirmClear(false)
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Settings</h2>
      </div>

      {/* API Key section */}
      <div className="card">
        <h3 className="card-title">Anthropic API Key</h3>

        {currentKey ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: 'var(--sage-bg)', borderRadius: 'var(--r-sm)', marginBottom: '0.75rem' }}>
              <Icons.Check size={16} color="var(--sage)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--sage)' }}>Key saved</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                  {currentKey.slice(0, 12)}••••••••••••
                </div>
              </div>
            </div>

            <p className="card-note" style={{ marginBottom: '0.75rem' }}>
              AI features are active. To update your key, paste a new one below.
            </p>

            <label className="form-label">
              Update Key
              <input className="form-input" value={draft} onChange={e => { setDraft(e.target.value); setError('') }}
                placeholder="sk-ant-..." style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }} />
            </label>
            {error && <p className="error-text">{error}</p>}

            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <button className={`btn ${saved ? 'btn-sage' : 'btn-gold'}`} onClick={handleSave} disabled={!draft.trim()}>
                <Icons.Save size={14} />&nbsp;{saved ? 'Saved ✓' : 'Update Key'}
              </button>
              {!confirmClear
                ? <button className="btn btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => setConfirmClear(true)}>Remove Key</button>
                : <button className="btn btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={handleClear}>Confirm Remove</button>
              }
            </div>
          </div>
        ) : (
          <div>
            <p className="card-body" style={{ marginBottom: '0.75rem' }}>
              No key saved. AI features (narration coach, watercolor coach, book search, D&S agent) need an Anthropic API key to work.
            </p>
            <label className="form-label">
              Paste Your Key
              <input className="form-input" value={draft} onChange={e => { setDraft(e.target.value); setError('') }}
                placeholder="sk-ant-..." style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.04em' }} />
            </label>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-gold" style={{ marginTop: '0.75rem' }} onClick={handleSave} disabled={!draft.trim()}>
              <Icons.Save size={14} />&nbsp;Save Key
            </button>
            <p className="card-note" style={{ marginTop: '0.65rem' }}>
              Don't have a key? <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>Get one at console.anthropic.com ↗</a>
            </p>
          </div>
        )}
      </div>

      {/* About section */}
      <div className="card">
        <h3 className="card-title">About Living Rhythm Planner</h3>
        <p className="card-body" style={{ marginBottom: '0.5rem' }}>
          A Charlotte Mason homeschool planning app by Delight &amp; Savor.
        </p>
        <a href="https://delightandsavor.com" target="_blank" rel="noreferrer"
          className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
          Visit delightandsavor.com ↗
        </a>
      </div>

      {/* Privacy note */}
      <div className="card card-sage">
        <h3 className="card-title">Your Privacy</h3>
        <p className="card-body">
          Your API key, schedule, journal entries, and all app data are stored only on your device. Nothing is sent to any server except your direct API calls to Anthropic when you use an AI feature.
        </p>
      </div>
    </div>
  )
}
