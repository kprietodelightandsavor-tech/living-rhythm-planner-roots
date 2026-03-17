// ── CONSIDER THE LILIES JOURNAL ────────────────────────────────────────────────
// Edit this file to change the Commonplace Journal and Watercolor Coach.

import React, { useState, useRef } from 'react'
import { uid, todayStr, save, load, callClaude, callClaudeWithImage } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const JOURNAL_KEY = 'lrp-lilies'

// Layers for a commonplace entry
const LAYERS = [
  { key: 'place',   label: 'The Place',   placeholder: 'Where are you? What do you see, hear, smell? Set the scene in a sentence or two.' },
  { key: 'moment',  label: 'The Moment',  placeholder: 'What caught your attention? What made you stop and look more closely?' },
  { key: 'thought', label: 'The Wonder',  placeholder: 'What does it make you think or wonder? What question does it raise?' },
]

const COACHING_SYSTEM = `You are a gentle watercolor and nature sketch coach in the tradition of Anna Botsford Comstock and Charlotte Mason.
The student has shared a photo or description of something in nature they want to draw or paint.
Give specific, encouraging coaching in three stages:
1. SKETCHING: How to observe and lay down the basic shape — proportions, gesture, key details to notice first
2. REFINING: How to add texture, value, and botanical/natural detail
3. PAINTING: Watercolor technique — color mixing suggestions, wet-on-wet vs dry brush, where to leave white
Be specific to what they are actually looking at. Avoid generic advice. Speak warmly, like a mentor at your side.`

// ── JOURNAL ENTRY FORM ────────────────────────────────────────────────────────
function NewEntry({ onSave }) {
  const [entry, setEntry] = useState({ place: '', moment: '', thought: '', date: todayStr() })
  const update = (k, v) => setEntry(e => ({ ...e, [k]: v }))
  const handleSave = () => {
    if (!entry.moment.trim()) return
    onSave({ ...entry, id: uid() })
    setEntry({ place: '', moment: '', thought: '', date: todayStr() })
  }
  return (
    <div className="card">
      <h3 className="card-title">New Entry — {entry.date}</h3>
      {LAYERS.map(l => (
        <label key={l.key} className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
          <span className="layer-label">{l.label}</span>
          <textarea className="form-input" rows={3} value={entry[l.key]} onChange={e => update(l.key, e.target.value)} placeholder={l.placeholder} />
        </label>
      ))}
      <button className="btn btn-gold" onClick={handleSave} disabled={!entry.moment.trim()}>
        <Icons.Save size={14} />&nbsp;Save Entry
      </button>
    </div>
  )
}

// ── WATERCOLOR COACH ──────────────────────────────────────────────────────────
function WatercolorCoach() {
  const [imageData, setImageData] = useState(null)
  const [description, setDescription] = useState('')
  const [coaching, setCoaching] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageData(reader.result)
    reader.readAsDataURL(file)
  }

  const getCoaching = async () => {
    setLoading(true)
    setError('')
    setCoaching('')
    try {
      let text
      if (imageData) {
        const base64 = imageData.split(',')[1]
        const mediaType = imageData.split(';')[0].split(':')[1]
        text = await callClaudeWithImage({
          base64,
          mediaType,
          textPrompt: description
            ? `Additional context: ${description}\n\nPlease give me specific watercolor and sketching coaching for this subject.`
            : 'Please give me specific watercolor and sketching coaching for this subject.',
          systemPrompt: COACHING_SYSTEM,
        })
      } else if (description.trim()) {
        text = await callClaude(
          `I want to sketch and paint this from nature: ${description}\n\nGive me specific coaching for sketching and watercolor painting this subject.`,
          COACHING_SYSTEM
        )
      }
      setCoaching(text || '')
    } catch {
      setError('Coaching unavailable right now. Check your connection or API key setup.')
    }
    setLoading(false)
  }

  return (
    <div className="card">
      <h3 className="card-title">Paint &amp; Sketch Coach</h3>
      <p className="card-note" style={{ marginBottom: '1rem' }}>Upload a photo from nature or describe what you want to sketch, and the coach will give you specific step-by-step guidance.</p>

      <div className="coach-upload-area" onClick={() => fileRef.current?.click()}>
        {imageData
          ? <img src={imageData} alt="Your subject" className="coach-preview-img" />
          : <>
              <Icons.Upload size={28} color="var(--muted)" />
              <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Tap to upload a photo</p>
            </>
        }
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      <label className="form-label" style={{ marginTop: '1rem' }}>
        Or describe your subject
        <textarea className="form-input" rows={2} value={description} onChange={e => setDescription(e.target.value)}
          placeholder="e.g. a dried oak leaf with curled edges, brown and russet, about 4 inches long" />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button className="btn btn-gold" style={{ marginTop: '0.75rem' }}
        onClick={getCoaching}
        disabled={loading || (!imageData && !description.trim())}>
        {loading ? 'Getting coaching…' : 'Get Coaching →'}
      </button>

      {coaching && (
        <div className="coaching-result">
          {coaching.split('\n').filter(l => l.trim()).map((line, i) => (
            <p key={i} className={line.startsWith('#') || /^[1-3]\./.test(line) || /SKETCH|REFIN|PAINT/.test(line.toUpperCase())
              ? 'coaching-heading' : 'coaching-line'}>
              {line.replace(/^#+\s*/, '')}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ── ENTRY LIST ────────────────────────────────────────────────────────────────
function EntryList({ entries, onDelete }) {
  if (!entries.length) return (
    <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
      <p>Your journal is waiting. Begin with one observation.</p>
    </div>
  )
  return entries.map(e => (
    <div key={e.id} className="journal-entry-card">
      <div className="journal-entry-date">{e.date}</div>
      {LAYERS.map(l => e[l.key] && (
        <div key={l.key} className={`journal-layer journal-layer-${l.key}`}>
          <span className="layer-tag">{l.label}</span>
          <p>{e[l.key]}</p>
        </div>
      ))}
      <button className="icon-btn" style={{ marginTop: '0.5rem' }} onClick={() => onDelete(e.id)}>
        <Icons.Trash size={13} />
      </button>
    </div>
  ))
}

// ── SETUP GUIDE ────────────────────────────────────────────────────────────────
function SetupGuide() {
  const [open, setOpen] = useState(false)
  return (
    <div className="card">
      <button className="collapsible-btn" onClick={() => setOpen(o => !o)}>
        <span>What is Consider the Lilies?</span>
        {open ? <Icons.ChevU size={16} /> : <Icons.ChevD size={16} />}
      </button>
      {open && (
        <div className="guide-content">
          <p>The <em>Consider the Lilies</em> commonplace journal is rooted in Charlotte Mason's conviction that the habit of attention begins outdoors — with one small thing, truly seen.</p>
          <h4>The Three Layers</h4>
          <p><strong>The Place</strong> — Ground yourself. Write two sentences about where you are. The smells, sounds, light. This is not description for its own sake; it anchors attention.</p>
          <p><strong>The Moment</strong> — What caught your eye? One thing. The caterpillar on the milkweed. The way the cedar bark peels. This is your observation.</p>
          <p><strong>The Wonder</strong> — What does it make you think or ask? This is where attention becomes thought.</p>
          <h4>Physical Journal</h4>
          <p>We designed a companion print-and-bind journal for this practice. <a href="https://delightandsavor.com" target="_blank" rel="noreferrer" className="inline-link">Find it at Delight &amp; Savor →</a></p>
        </div>
      )}
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function LiliesJournal() {
  const [entries, setEntries] = useState(() => load(JOURNAL_KEY, []))
  const [tab, setTab] = useState('new')

  const handleSave = (entry) => {
    const updated = [entry, ...entries]
    setEntries(updated)
    save(JOURNAL_KEY, updated)
    setTab('entries')
  }
  const handleDelete = (id) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    save(JOURNAL_KEY, updated)
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="ornament">✦</div>
        <h2 className="screen-title">Consider the <em>Lilies</em></h2>
        <p className="screen-sub">Commonplace Journal &amp; Nature Sketchbook</p>
      </div>

      <SetupGuide />

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'new' ? 'active' : ''}`} onClick={() => setTab('new')}>New Entry</button>
        <button className={`tab-btn ${tab === 'paint' ? 'active' : ''}`} onClick={() => setTab('paint')}>Paint &amp; Sketch</button>
        <button className={`tab-btn ${tab === 'entries' ? 'active' : ''}`} onClick={() => setTab('entries')}>My Entries ({entries.length})</button>
      </div>

      <div className="tab-content">
        {tab === 'new' && <NewEntry onSave={handleSave} />}
        {tab === 'paint' && <WatercolorCoach />}
        {tab === 'entries' && <EntryList entries={entries} onDelete={handleDelete} />}
      </div>
    </div>
  )
}
