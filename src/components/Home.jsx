// ── HOME SCREEN ────────────────────────────────────────────────────────────────
// Edit this file to change the Home dashboard layout and content.

import React, { useState } from 'react'
import { BLOCK_TYPES, CM_HABITS } from '../shared/constants.js'
import { todayStr, save, load } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const dayOfWeek = () => {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return days[new Date().getDay()]
}

function TopStrip({ activeHabitNames, narrations, outdoorMins, setOutdoorMins }) {
  const activeHabit = CM_HABITS.find(h => activeHabitNames?.includes(h.name))
  const weekNarrations = Object.values(narrations || {}).flat().filter(n => {
    const d = new Date(n.date); const now = new Date()
    return (now - d) < 7 * 24 * 60 * 60 * 1000
  }).length
  const bump = (amt) => {
    const next = Math.max(0, outdoorMins + amt)
    setOutdoorMins(next)
    save(`lrp-outdoor-mins-${todayStr()}`, next)
  }
  return (
    <div className="top-strip">
      <div className="strip-tile strip-tile-nature">
        <div className="strip-tile-label">Outside Today</div>
        <div className="strip-tile-main">
          <button className="strip-counter-btn" onClick={() => bump(-5)}>−</button>
          <span className="strip-counter-val">{outdoorMins}m</span>
          <button className="strip-counter-btn" onClick={() => bump(5)}>+</button>
        </div>
      </div>
      <div className="strip-tile strip-tile-gold">
        <div className="strip-tile-label">Habit</div>
        <div className="strip-tile-habit">
          {activeHabit ? activeHabit.name : <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>None set</span>}
        </div>
      </div>
      <div className="strip-tile strip-tile-navy">
        <div className="strip-tile-label">This Week</div>
        <div className="strip-tile-num">{weekNarrations}</div>
        <div className="strip-tile-sublabel">narrations</div>
      </div>
    </div>
  )
}

function OutdoorWeeklyCircle({ outdoorMins }) {
  const goalHrs = 15
  const weekMins = (() => {
    let total = outdoorMins
    try {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1))
      weekStart.setHours(0,0,0,0)
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('lrp-outdoor-mins-') && k !== `lrp-outdoor-mins-${todayStr()}`) {
          const dateStr = k.replace('lrp-outdoor-mins-', '')
          const d = new Date(dateStr)
          if (d >= weekStart) total += parseInt(localStorage.getItem(k) || '0')
        }
      })
    } catch {}
    return total
  })()
  const hrs = weekMins / 60
  const pct = Math.min(hrs / goalHrs, 1)
  const r = 48; const circ = 2 * Math.PI * r
  const reached = hrs >= goalHrs
  return (
    <div style={{ background: 'var(--nature-bg)', border: '1px solid var(--nature)', borderRadius: 'var(--r)', padding: '0.85rem 1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
        <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r={r} fill="none" stroke="var(--sage-bg)" strokeWidth="9" />
          <circle cx="55" cy="55" r={r} fill="none" stroke={reached ? 'var(--gold)' : 'var(--nature)'} strokeWidth="9" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--navy)', lineHeight: 1, fontWeight: 700 }}>
            {hrs < 1 ? `${weekMins}m` : `${hrs % 1 === 0 ? hrs : hrs.toFixed(1)}h`}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>of {goalHrs}h</div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
          {reached ? 'Weekly goal reached ✦' : `${(goalHrs - hrs).toFixed(1)}h to go this week`}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          Weekly outdoor goal<br />
          <span style={{ color: 'var(--nature)', fontWeight: 700 }}>{goalHrs} hours</span> — Charlotte Mason standard
        </div>
      </div>
    </div>
  )
}

function TodaySchedule({ daySchedules }) {
  const today = dayOfWeek()
  const blocks = daySchedules?.[today] || []
  const storageKey = `lrp-daily-${todayStr()}`
  const [state, setState] = useState(() => load(storageKey, { checked: {}, notes: {} }))
  const [editingNote, setEditingNote] = useState(null)
  const toggle = (id) => {
    const next = { ...state, checked: { ...state.checked, [id]: !state.checked[id] } }
    setState(next); save(storageKey, next)
  }
  const saveNote = (id, val) => {
    const next = { ...state, notes: { ...state.notes, [id]: val } }
    setState(next); save(storageKey, next)
  }
  if (!blocks.length) return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
      <p style={{ fontStyle: 'italic' }}>No schedule for {today}. Rest well.</p>
    </div>
  )
  const pending = blocks.filter(b => !state.checked[b.id])
  const completed = blocks.filter(b => state.checked[b.id])
  const BlockRow = ({ b, done }) => {
    const bt = BLOCK_TYPES[b.type] || BLOCK_TYPES.custom
    const isEditing = editingNote === b.id
    const note = state.notes[b.id] || ''
    return (
      <div className={`check-block ${done ? 'check-block-done' : ''}`} style={{ borderLeft: `3px solid ${done ? 'var(--sage-lt)' : bt.color}`, background: done ? 'var(--sage-bg)' : bt.bg }}>
        <div className="check-block-row">
          <button className={`check-circle ${done ? 'checked' : ''}`} onClick={() => toggle(b.id)}>
            {done && <Icons.Check size={13} color="white" />}
          </button>
          <span className="check-time">{b.time}</span>
          <div className={`check-items ${done ? 'check-items-done' : ''}`}>
            {b.items.map((item, i) => <span key={i}>{item}</span>)}
          </div>
          <button className="icon-btn" style={{ marginLeft: 'auto', flexShrink: 0 }} onClick={() => setEditingNote(isEditing ? null : b.id)}>
            <Icons.Pen size={13} color={note ? 'var(--gold)' : 'var(--muted)'} />
          </button>
        </div>
        {isEditing && (
          <div className="check-note-area">
            <textarea className="form-input check-note-input" rows={2} autoFocus placeholder="What did we cover? Any notes…" value={note} onChange={e => saveNote(b.id, e.target.value)} onBlur={() => setEditingNote(null)} />
          </div>
        )}
        {!isEditing && note && <p className="check-note-preview" onClick={() => setEditingNote(b.id)}>{note}</p>}
      </div>
    )
  }
  return (
    <div>
      <div className="card" style={{ padding: '0.75rem' }}>
        <h3 className="card-title" style={{ padding: '0 0.25rem', marginBottom: '0.5rem' }}>
          Today — {today}
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--muted)', marginLeft: '0.5rem' }}>{completed.length}/{blocks.length} done</span>
        </h3>
        <div className="progress-bar-outer" style={{ marginBottom: '0.65rem' }}>
          <div className="progress-bar-inner" style={{ width: `${blocks.length ? (completed.length / blocks.length) * 100 : 0}%` }} />
        </div>
        <div className="check-list">
          {pending.map(b => <BlockRow key={b.id} b={b} done={false} />)}
          {pending.length === 0 && <p style={{ textAlign: 'center', color: 'var(--sage)', fontStyle: 'italic', padding: '1rem 0', fontSize: '0.95rem' }}>✦ Everything done for today!</p>}
        </div>
      </div>
      {completed.length > 0 && (
        <div className="card card-sage" style={{ padding: '0.75rem' }}>
          <h3 className="card-title" style={{ padding: '0 0.25rem', marginBottom: '0.5rem', color: 'var(--sage)' }}>Completed ✓</h3>
          <div className="check-list">{completed.map(b => <BlockRow key={b.id} b={b} done={true} />)}</div>
        </div>
      )}
    </div>
  )
}

const DEFAULT_MORNING = [
  { id: 'm1', icon: '✝', label: 'Bible & Prayer', desc: 'Read, narrate, or copy a passage' },
  { id: 'm2', icon: '♪', label: 'Memory Verse / Hymn', desc: 'Recite this week\'s selection' },
  { id: 'm3', icon: '✒', label: 'Copywork', desc: 'One careful line from your copywork passage' },
  { id: 'm4', icon: '◉', label: 'Morning Reading', desc: 'Independent living book reading' },
]

function MorningAnchor() {
  const [open, setOpen] = useState(true)
  const [items] = useState(() => load('lrp-morning-items', DEFAULT_MORNING))
  const [checked, setChecked] = useState(() => load(`lrp-morning-checked-${todayStr()}`, {}))
  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next); save(`lrp-morning-checked-${todayStr()}`, next)
  }
  const doneCount = items.filter(i => checked[i.id]).length
  const allDone = doneCount === items.length && items.length > 0
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0
  return (
    <div style={{ border: '1.5px solid var(--gold-lt)', borderRadius: 'var(--r)', background: 'linear-gradient(135deg, #fdf8ef, #faf6ee)', marginBottom: '0.85rem', overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer' }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--gold-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '1rem', flexShrink: 0 }}>◉</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)' }}>Morning Anchor</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: 'var(--muted)' }}>{allDone ? 'All done ✦' : `${doneCount} of ${items.length} complete`}</div>
        </div>
        <span style={{ color: 'var(--gold)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--gold-lt)' }}>
          <div style={{ height: 4, background: 'var(--gold-lt)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--gold)', width: `${pct}%`, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ padding: '0.5rem 1rem' }}>
            {items.map(item => (
              <div key={item.id} onClick={() => toggle(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0', borderBottom: '1px solid rgba(194,155,97,0.12)', cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${checked[item.id] ? 'var(--gold)' : 'var(--gold-lt)'}`, background: checked[item.id] ? 'var(--gold)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                  {checked[item.id] && <span style={{ color: 'white', fontSize: '0.75rem', lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: 'var(--navy)', textDecoration: checked[item.id] ? 'line-through' : 'none', opacity: checked[item.id] ? 0.5 : 1 }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--muted)', fontStyle: 'italic' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {allDone && <div style={{ padding: '0.6rem 1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '0.88rem', color: 'var(--gold)', fontStyle: 'italic', borderTop: '1px solid var(--gold-lt)' }}>Morning Anchor complete ✦</div>}
        </div>
      )}
    </div>
  )
}

const MOTHER_CULTURE_PROMPTS = [
  'What are you reading for yourself right now — not for school, just for you?',
  '"The mother\'s education is her most priceless gift to her children." — Charlotte Mason. What are you learning this week?',
  'Ten minutes with a real book today. What will you read?',
  'What idea has been living in you lately — from something you\'ve read or heard?',
  'Copy one sentence that struck you this week. Why did it stay with you?',
  '"A mother who keeps herself mentally alive gives her children something no curriculum can." What are you feeding your mind?',
  'Nature observation for you today: find one thing and really look at it for five minutes.',
  'What poem have you read recently? If none — find one today. Just one.',
  'What are you curious about right now? Not for a lesson. For yourself.',
  '"Self-education is the only possible education." — Charlotte Mason. Where are you educating yourself lately?',
  'Is there a book you\'ve been meaning to start? Today is a good day.',
  'What beauty did you notice this week — in nature, in a piece of music, in a face?',
  'Write down one thing you want to remember from your reading this month.',
  'What are you learning about your own habits of mind lately?',
  'Find a passage of Scripture or poetry to copy today. Let your hand slow your mind down.',
  'What conversation has stayed with you this week? Why?',
  '"Education is an atmosphere." What atmosphere are you living in right now?',
  'When did you last sit outside with nothing to do but look? Could you do that today?',
  'What subject — history, science, art, music — are you drawn to explore for yourself right now?',
  'What is one thing you\'ve read in the last month that changed how you see something?',
  'Write one sentence about what matters most to you in your homeschool right now.',
  'What are you grateful for in this season of mothering and teaching?',
  '"The mind feeds on ideas." What ideas are you feeding yours with?',
  'Is there a documentary, lecture, or podcast feeding your mind right now? What is it?',
  'What is your current living book — the one written with genuine delight by someone who loves the subject?',
  'Nature journaling for you: sketch or describe one thing from your yard or walk today.',
  'What habit of your own are you working on this month?',
  '"Never be within doors when you can rightly be without." Did you get outside today?',
  'What would you study if you had one free hour today — just for the love of it?',
  'Write a letter to yourself about what this season of your life is teaching you.',
]

function MotherCulture() {
  const [open, setOpen] = useState(false)
  const prompt = MOTHER_CULTURE_PROMPTS[(new Date().getDate() - 1) % MOTHER_CULTURE_PROMPTS.length]
  const [note, setNote] = useState(() => load(`lrp-mc-${todayStr()}`, ''))
  const saveNote = (val) => { setNote(val); save(`lrp-mc-${todayStr()}`, val) }
  return (
    <div style={{ border: '1.5px solid var(--lilac)', borderRadius: 'var(--r)', background: 'var(--white)', marginBottom: '0.85rem', overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', cursor: 'pointer' }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--lilac)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-lt)', fontSize: '1rem', flexShrink: 0 }}>✦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)' }}>Mother Culture</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: 'var(--muted)', fontStyle: 'italic' }}>Your own reading & attention</div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--lilac)', padding: '0.85rem 1rem' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: 'var(--navy)', fontStyle: 'italic', lineHeight: 1.65, marginBottom: '0.75rem' }}>{prompt}</p>
          <textarea value={note} onChange={e => saveNote(e.target.value)} placeholder="A thought, a sentence you want to keep, what you're reading…" style={{ width: '100%', minHeight: 72, border: '1.5px solid var(--lilac)', borderRadius: 'var(--r-sm)', padding: '0.5rem 0.75rem', fontFamily: 'var(--font-serif)', fontSize: '0.92rem', color: 'var(--ink)', lineHeight: 1.6, resize: 'vertical', outline: 'none', background: 'var(--cream)' }} />
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.3rem', textAlign: 'right' }}>auto-saved · prompt {new Date().getDate()} of 30</div>
        </div>
      )}
    </div>
  )
}

export default function Home({ children, narrations, beautyLoop, termPlan, daySchedules, onNav, activeHabitNames }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const [outdoorMins, setOutdoorMins] = useState(() => load(`lrp-outdoor-mins-${todayStr()}`, 0))
  return (
    <div className="screen">
      <div className="screen-header">
        <div className="ornament">✦</div>
        <h2 className="screen-title">Living <em>Rhythm</em></h2>
        <p className="screen-sub">{today}</p>
      </div>
      <TopStrip activeHabitNames={activeHabitNames} narrations={narrations} outdoorMins={outdoorMins} setOutdoorMins={setOutdoorMins} />
