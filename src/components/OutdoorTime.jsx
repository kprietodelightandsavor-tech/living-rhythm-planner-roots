// ── OUTDOOR TIME SCREEN ───────────────────────────────────────────────────────
// Edit this file to change the Nature Study / Outdoor Time content.

import React, { useState } from 'react'
import { NATURE_IDEAS } from '../shared/constants.js'
import { uid, todayStr, save, load, callClaude } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const LOG_KEY = 'lrp-outdoor-log'

const SYSTEM = `You are a Charlotte Mason nature study guide in the tradition of Anna Botsford Comstock.
When a student or parent describes what they observed outdoors, give a warm, specific 2–3 paragraph response that:
1. Validates and deepens their observation with one natural history fact specific to what they saw
2. Asks one wondering question to draw them back outside
3. Suggests one simple sketching or journaling practice for what they found
Never be generic. Be specific to exactly what they described.`

function NaturePrompt() {
  const [obs, setObs] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ask = async () => {
    if (!obs.trim()) return
    setLoading(true)
    setError('')
    try {
      const text = await callClaude(`We observed: ${obs}`, SYSTEM)
      setResponse(text)
    } catch {
      setError('Could not reach the nature guide. Check your connection.')
    }
    setLoading(false)
  }

  return (
    <div className="card">
      <h3 className="card-title">Nature Guide</h3>
      <p className="card-note" style={{ marginBottom: '0.75rem' }}>Tell the guide what you found outdoors today and get specific natural history and journaling coaching.</p>
      <textarea className="form-input" rows={3} value={obs} onChange={e => setObs(e.target.value)}
        placeholder="We found a red-tailed hawk feather near the fence line, about 8 inches long…" />
      {error && <p className="error-text">{error}</p>}
      <button className="btn btn-gold" style={{ marginTop: '0.5rem' }} onClick={ask} disabled={loading || !obs.trim()}>
        {loading ? 'Thinking…' : 'Ask the Guide →'}
      </button>
      {response && (
        <div className="coach-bubble" style={{ marginTop: '1rem' }}>
          {response.split('\n').filter(l => l.trim()).map((line, i) => (
            <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function NatureLog() {
  const [logs, setLogs] = useState(() => load(LOG_KEY, []))
  const [form, setForm] = useState({ date: todayStr(), observation: '', sketch: false })

  const add = () => {
    if (!form.observation.trim()) return
    const updated = [{ ...form, id: uid() }, ...logs]
    setLogs(updated)
    save(LOG_KEY, updated)
    setForm({ date: todayStr(), observation: '', sketch: false })
  }
  const remove = (id) => {
    const updated = logs.filter(l => l.id !== id)
    setLogs(updated)
    save(LOG_KEY, updated)
  }

  return (
    <div>
      <div className="card">
        <h3 className="card-title">Log an Observation</h3>
        <div className="form-grid">
          <label className="form-label">Date
            <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </label>
          <label className="form-label" style={{ gridColumn: '1 / -1' }}>What We Observed
            <textarea className="form-input" rows={3} value={form.observation}
              onChange={e => setForm(f => ({ ...f, observation: e.target.value }))}
              placeholder="One specific thing you noticed, described in detail…" />
          </label>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.sketch} onChange={e => setForm(f => ({ ...f, sketch: e.target.checked }))} />
          <span style={{ fontSize: '0.9rem' }}>We sketched this</span>
        </label>
        <button className="btn btn-gold" style={{ marginTop: '0.75rem' }} onClick={add} disabled={!form.observation.trim()}>
          Log It →
        </button>
      </div>

      {logs.length > 0 && (
        <div>
          <h3 className="section-label">Observation Log</h3>
          {logs.map(l => (
            <div key={l.id} className="log-row">
              <div className="log-date">{l.date}</div>
              <div className="log-obs">{l.observation}</div>
              {l.sketch && <span className="tag tag-sage">sketched</span>}
              <button className="icon-btn" onClick={() => remove(l.id)}><Icons.Trash size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OutdoorTime() {
  const [tab, setTab] = useState('ideas')

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Outdoor Time</h2>
        <p className="screen-sub">Nature study, observation & the living world</p>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'ideas' ? 'active' : ''}`} onClick={() => setTab('ideas')}>Ideas</button>
        <button className={`tab-btn ${tab === 'guide' ? 'active' : ''}`} onClick={() => setTab('guide')}>Nature Guide</button>
        <button className={`tab-btn ${tab === 'log' ? 'active' : ''}`} onClick={() => setTab('log')}>Log</button>
      </div>

      <div className="tab-content">
        {tab === 'ideas' && (
          <div>
            <p className="card-note" style={{ marginBottom: '1rem', fontStyle: 'italic' }}>
              "Never be within doors when you can rightly be without." — Charlotte Mason
            </p>
            {NATURE_IDEAS.map((idea, i) => (
              <div key={i} className="card card-nature">
                <h3 className="card-title">{idea.title}</h3>
                <p className="card-body">{idea.desc}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'guide' && <NaturePrompt />}
        {tab === 'log' && <NatureLog />}
      </div>
    </div>
  )
}
