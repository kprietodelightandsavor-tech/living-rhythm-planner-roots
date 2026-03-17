// ── APP.JSX ───────────────────────────────────────────────────────────────────
// This is the root app shell. It holds all shared state and renders the nav.
// To add a new screen: import it, add it to SCREENS, add a nav entry.

import React, { useState } from 'react'
import { load, save } from './shared/helpers.js'
import { makeDefaultSchedules, defaultBeautyLoop, defaultTermPlan } from './data/schedule.js'
import * as Icons from './shared/Icons.jsx'

// ── SCREENS ───────────────────────────────────────────────────────────────────
import Home          from './components/Home.jsx'
import Planner       from './components/Planner.jsx'
import NarrationCoach from './components/NarrationCoach.jsx'
import BookFinder    from './components/BookFinder.jsx'
import LiliesJournal from './components/LiliesJournal.jsx'
import OutdoorTime   from './components/OutdoorTime.jsx'
import HabitTracker  from './components/HabitTracker.jsx'
import Students      from './components/Students.jsx'
import DSAgent       from './components/DSAgent.jsx'
import Settings, { ApiKeyGate } from './components/Settings.jsx'

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
// To reorder nav items, change the order here.
// To add a new screen, add an entry: [id, label, <Icon />]
const NAV = [
  ['home',      'Home',      <Icons.Home />],
  ['planner',   'Planner',   <Icons.Cal />],
  ['narration', 'Narration', <Icons.Pen />],
  ['books',     'Books',     <Icons.Book />],
  ['lilies',    'Lilies',    <Icons.Leaf />],
  ['outdoor',   'Outdoors',  <Icons.Sun />],
  ['habits',    'Habits',    <Icons.Sprout />],
  ['students',  'Students',  <Icons.Users />],
  ['agent',     'D&S',       <Icons.Star />],
  ['settings',  'Settings',  <Icons.Info />],
]

// ── APP LOGO ──────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="90" fill="#2c3650"/>
      <circle cx="90" cy="90" r="70" fill="none" stroke="#C29B61" strokeWidth="2"/>
      <text x="90" y="82" fontFamily="Georgia,serif" fontSize="36" fontWeight="bold" fill="#C29B61" textAnchor="middle">LR</text>
      <text x="90" y="112" fontFamily="Georgia,serif" fontSize="13" fill="#faf6ee" textAnchor="middle" fontStyle="italic">Living Rhythm</text>
    </svg>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home')

  // ── Shared state (persisted to localStorage) ──────────────────────────────
  const [children, setChildren]       = useState(() => load('lrp-children', []))
  const [narrations, setNarrations]   = useState(() => load('lrp-narrations', {}))
  const [termPlan, setTermPlan]       = useState(() => load('lrp-term', defaultTermPlan))
  const [beautyLoop, setBeautyLoop]   = useState(() => load('lrp-beauty', defaultBeautyLoop))
  const [activeHabitNames]            = useState(() => load('lrp-habits', []))
  const [yearPlan, setYearPlan]       = useState(() => load('lrp-year-plan', { schoolWeeks: {}, offDays: {}, terms: [] }))
  const [daySchedules, setDaySchedules] = useState(() => {
    const saved = {}
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday']
    const defaults = makeDefaultSchedules()
    days.forEach(d => {
      const v = localStorage.getItem(`lrp-sched-${d}`)
      saved[d] = v ? JSON.parse(v) : defaults[d]
    })
    return saved
  })

  // Auto-save children and narrations when they change
  const handleSetChildren = (v) => { setChildren(v); save('lrp-children', v) }
  const handleSetNarrations = (v) => { setNarrations(v); save('lrp-narrations', v) }

  return (
    <div className="app-shell">
      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="app-header-brand">
          <Logo />
          <span className="app-header-title">Living <em>Rhythm</em></span>
        </div>
        <a href="https://delightandsavor.com" target="_blank" rel="noreferrer" className="app-header-link">
          Delight &amp; Savor ✦
        </a>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="app-main">
        {screen === 'home'      && <Home children={children} narrations={narrations} beautyLoop={beautyLoop} termPlan={termPlan} daySchedules={daySchedules} onNav={setScreen} activeHabitNames={activeHabitNames} />}
        {screen === 'planner'   && <Planner termPlan={termPlan} setTermPlan={setTermPlan} beautyLoop={beautyLoop} setBeautyLoop={setBeautyLoop} daySchedules={daySchedules} setDaySchedules={setDaySchedules} yearPlan={yearPlan} setYearPlan={setYearPlan} />}
        {screen === 'narration' && <ApiKeyGate featureName="Narration Coach"><NarrationCoach children={children} narrations={narrations} setNarrations={handleSetNarrations} /></ApiKeyGate>}
        {screen === 'books'     && <ApiKeyGate featureName="Living Book Finder"><BookFinder /></ApiKeyGate>}
        {screen === 'lilies'    && <LiliesJournal />}
        {screen === 'outdoor'   && <OutdoorTime />}
        {screen === 'habits'    && <HabitTracker />}
        {screen === 'students'  && <Students children={children} setChildren={handleSetChildren} narrations={narrations} />}
        {screen === 'agent'     && <ApiKeyGate featureName="Delight & Savor Agent"><DSAgent /></ApiKeyGate>}
        {screen === 'settings'  && <Settings />}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav className="app-nav">
        {NAV.map(([id, label, icon]) => (
          <button key={id} className={`nav-btn ${screen === id ? 'active' : ''}`} onClick={() => setScreen(id)}>
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
