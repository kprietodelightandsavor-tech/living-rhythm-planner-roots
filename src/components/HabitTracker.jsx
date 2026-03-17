// ── HABIT TRACKER SCREEN ──────────────────────────────────────────────────────
// Edit this file to change the Charlotte Mason Habit Tracker content.

import React, { useState } from 'react'
import { CM_HABITS } from '../shared/constants.js'
import { uid, todayStr, save, load } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const HABITS_KEY = 'lrp-habits'
const LOG_KEY    = 'lrp-habit-log'

function HabitCard({ habit, isActive, onToggle, logEntry }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`habit-card ${isActive ? 'habit-active' : ''}`}>
      <div className="habit-card-header" onClick={() => setOpen(o => !o)}>
        <div className="habit-card-title">
          <span className="habit-name">{habit.name}</span>
          <span className="habit-category">{habit.category}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className={`btn btn-sm ${isActive ? 'btn-sage' : 'btn-outline'}`}
            onClick={e => { e.stopPropagation(); onToggle() }}>
            {isActive ? 'Active ✓' : 'Focus'}
          </button>
          {open ? <Icons.ChevU size={16} /> : <Icons.ChevD size={16} />}
        </div>
      </div>
      {open && (
        <div className="habit-detail">
          <p className="habit-why"><em>"{habit.why}"</em></p>
          <h4 className="habit-section-title">How to Introduce</h4>
          <p className="habit-text">{habit.introduce}</p>
          <h4 className="habit-section-title">How to Reinforce</h4>
          <p className="habit-text">{habit.reinforce}</p>
        </div>
      )}
    </div>
  )
}

function DailyCheck({ activeHabits }) {
  const [log, setLog] = useState(() => load(LOG_KEY, {}))
  const today = todayStr()
  const todayLog = log[today] || {}

  const toggle = (habitName) => {
    const updated = {
      ...log,
      [today]: { ...todayLog, [habitName]: !todayLog[habitName] }
    }
    setLog(updated)
    save(LOG_KEY, updated)
  }

  if (!activeHabits.length) return (
    <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
      <p>Choose habits to focus on from the list below, then check them off each day here.</p>
    </div>
  )

  const done = activeHabits.filter(h => todayLog[h.name]).length

  return (
    <div className="card">
      <h3 className="card-title">Today's Habits</h3>
      <p className="card-note" style={{ marginBottom: '0.75rem' }}>{done} of {activeHabits.length} practiced today</p>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${(done / activeHabits.length) * 100}%` }} />
      </div>
      {activeHabits.map(h => (
        <button
          key={h.name}
          className={`habit-check-row ${todayLog[h.name] ? 'checked' : ''}`}
          onClick={() => toggle(h.name)}>
          <div className={`habit-check-box ${todayLog[h.name] ? 'checked' : ''}`}>
            {todayLog[h.name] && <Icons.Check size={14} color="white" />}
          </div>
          <div>
            <div className="habit-check-name">{h.name}</div>
            <div className="habit-check-cat">{h.category}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default function HabitTracker() {
  const [activeHabitNames, setActiveHabitNames] = useState(() => load(HABITS_KEY, []))
  const [tab, setTab] = useState('today')

  const activeHabits = CM_HABITS.filter(h => activeHabitNames.includes(h.name))

  const toggleHabit = (name) => {
    const updated = activeHabitNames.includes(name)
      ? activeHabitNames.filter(n => n !== name)
      : [...activeHabitNames, name]
    setActiveHabitNames(updated)
    save(HABITS_KEY, updated)
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Habit Trainer</h2>
        <p className="screen-sub">Charlotte Mason's science of habit formation</p>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>Today</button>
        <button className={`tab-btn ${tab === 'habits' ? 'active' : ''}`} onClick={() => setTab('habits')}>CM Habits</button>
      </div>

      <div className="tab-content">
        {tab === 'today' && <DailyCheck activeHabits={activeHabits} />}

        {tab === 'habits' && (
          <div>
            <div className="card card-sage" style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--ink)' }}>
                "The mother who takes pains to endow her children with good habits secures for herself smooth and easy days."
                <br /><strong style={{ fontStyle: 'normal' }}>— Charlotte Mason</strong>
              </p>
            </div>
            {CM_HABITS.map(h => (
              <HabitCard
                key={h.name}
                habit={h}
                isActive={activeHabitNames.includes(h.name)}
                onToggle={() => toggleHabit(h.name)}
                logEntry={null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
