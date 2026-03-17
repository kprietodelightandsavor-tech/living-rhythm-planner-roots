// ── PLANNER SCREEN ────────────────────────────────────────────────────────────
// Edit this file to change the Term Planner, Year Calendar, and Beauty Loop.

import React, { useState } from 'react'
import { BLOCK_TYPES, DAYS } from '../shared/constants.js'
import { uid, save } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

// ── BEAUTY LOOP SUBJECTS ──────────────────────────────────────────────────────
const BEAUTY_LOOP_SUBJECTS = [
  { id: 'composer',    label: 'Composer Study',   prompt: 'e.g. Dvořák — New World Symphony' },
  { id: 'picture',     label: 'Picture Study',    prompt: 'e.g. Constable — landscape series' },
  { id: 'hymn',        label: 'Hymn Study',       prompt: 'e.g. How Great Thou Art' },
  { id: 'folksong',    label: 'Folk Song',        prompt: 'e.g. Shenandoah' },
  { id: 'handicraft',  label: 'Handicraft',       prompt: 'e.g. Cross-stitch, knitting, watercolor' },
  { id: 'poetry',      label: 'Poetry',           prompt: 'e.g. Robert Frost — seasonal selection' },
  { id: 'recitation',  label: 'Recitation',       prompt: 'e.g. Psalm 23, a Shakespeare sonnet' },
  { id: 'naturelore',  label: 'Nature Lore',      prompt: 'e.g. Comstock — insects chapter' },
  { id: 'shakespeare', label: 'Shakespeare',      prompt: 'e.g. A Midsummer Night\'s Dream' },
  { id: 'fables',      label: 'Fables & Tales',   prompt: 'e.g. Aesop, fairy tales, folk tales' },
  { id: 'habits',      label: 'Habit Study',      prompt: 'e.g. Attention — this term\'s focus habit' },
  { id: 'geography',   label: 'Geography',        prompt: 'e.g. Map study — South America' },
]

const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS  = ['S','M','T','W','T','F','S']
const TERM_COLORS = ['#C29B61','#7a8f6f','#4a5f73','#8a5a3a','#6b4c8a','#5a7a6e']

function dateKey(date) { return date.toISOString().slice(0, 10) }

function getWeeksInYear(year) {
  const weeks = []
  const jan1 = new Date(year, 0, 1)
  const startDay = jan1.getDay()
  const d = new Date(year, 0, 1 - (startDay === 0 ? 6 : startDay - 1))
  let weekNum = 1
  while (true) {
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    if (days.some(day => day.getFullYear() === year)) {
      weeks.push({ weekNum, days })
      weekNum++
    }
    if (d.getFullYear() > year) break
  }
  return weeks
}

// ── YEAR CALENDAR ─────────────────────────────────────────────────────────────
function YearCalendar({ yearPlan, setYearPlan }) {
  const year = new Date().getFullYear()
  const weeks = getWeeksInYear(year)
  const [focusedTermId, setFocusedTermId] = useState(null)

  const schoolWeeks = yearPlan.schoolWeeks || {}
  const offDays     = yearPlan.offDays     || {}
  const terms       = yearPlan.terms       || []

  const schoolWeekCount = Object.values(schoolWeeks).filter(Boolean).length
  const offDayCount     = Object.values(offDays).filter(Boolean).length

  function persist(patch) {
    const next = { ...yearPlan, ...patch }
    setYearPlan(next)
    save('lrp-year-plan', next)
  }

  function toggleWeek(weekNum) {
    persist({ schoolWeeks: { ...schoolWeeks, [weekNum]: !schoolWeeks[weekNum] } })
  }

  function toggleDay(key) {
    persist({ offDays: { ...offDays, [key]: !offDays[key] } })
  }

  function addTerm() {
    const next = [...terms, { id: uid(), name: `Term ${terms.length + 1}`, weekNums: [], color: TERM_COLORS[terms.length % TERM_COLORS.length], theme: '', books: '' }]
    persist({ terms: next })
  }

  function updateTerm(id, k, v) {
    persist({ terms: terms.map(t => t.id === id ? { ...t, [k]: v } : t) })
  }

  function removeTerm(id) {
    persist({ terms: terms.filter(t => t.id !== id) })
    if (focusedTermId === id) setFocusedTermId(null)
  }

  function toggleWeekInTerm(termId, weekNum) {
    persist({
      terms: terms.map(t => {
        if (t.id !== termId) return t
        const wns = t.weekNums.includes(weekNum)
          ? t.weekNums.filter(w => w !== weekNum)
          : [...t.weekNums, weekNum].sort((a, b) => a - b)
        return { ...t, weekNums: wns }
      })
    })
  }

  // Group weeks by month
  const weeksByMonth = {}
  weeks.forEach(week => {
    const m = week.days[4].getMonth() // Thursday
    if (!weeksByMonth[m]) weeksByMonth[m] = []
    weeksByMonth[m].push(week)
  })

  const focusedTerm = terms.find(t => t.id === focusedTermId)

  // ── Term detail view ───────────────────────────────────────────────────────
  if (focusedTerm) {
    const termWeeks = weeks.filter(w => focusedTerm.weekNums.includes(w.weekNum))
    const termDayCount = termWeeks.reduce((s, w) =>
      s + w.days.filter(d => d.getDay() >= 1 && d.getDay() <= 5 && !offDays[dateKey(d)]).length, 0)
    const schoolWeeksList = weeks.filter(w => schoolWeeks[w.weekNum])

    return (
      <div>
        <button className="btn btn-outline btn-sm" style={{ marginBottom: '1rem' }} onClick={() => setFocusedTermId(null)}>
          ← Back to Year
        </button>

        <div className="card" style={{ borderLeft: `4px solid ${focusedTerm.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input className="form-input" style={{ flex: 1, fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 600, border: 'none', padding: 0, background: 'transparent', color: 'var(--navy)' }}
              value={focusedTerm.name} onChange={e => updateTerm(focusedTerm.id, 'name', e.target.value)} />
            <button className="icon-btn" onClick={() => removeTerm(focusedTerm.id)}><Icons.Trash size={14} /></button>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <div className="stat-card" style={{ flex: 1 }}>
              <div className="stat-num" style={{ color: focusedTerm.color }}>{focusedTerm.weekNums.length}</div>
              <div className="stat-label">Weeks</div>
            </div>
            <div className="stat-card" style={{ flex: 1 }}>
              <div className="stat-num" style={{ color: 'var(--gold)' }}>{termDayCount}</div>
              <div className="stat-label">School Days</div>
            </div>
          </div>

          <label className="form-label">Term Theme
            <input className="form-input" value={focusedTerm.theme || ''} onChange={e => updateTerm(focusedTerm.id, 'theme', e.target.value)} placeholder="e.g. Colonial America…" />
          </label>
          <label className="form-label" style={{ marginTop: '0.5rem' }}>Living Books
            <textarea className="form-input" rows={2} value={focusedTerm.books || ''} onChange={e => updateTerm(focusedTerm.id, 'books', e.target.value)} placeholder="Main living books for this term…" />
          </label>
        </div>

        <h3 className="section-label">Assign School Weeks to This Term</h3>
        {schoolWeeksList.length === 0 && (
          <p className="card-note">Go back to Year view and tap week numbers to mark your school weeks first.</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {schoolWeeksList.map(w => {
            const inTerm = focusedTerm.weekNums.includes(w.weekNum)
            const mon = w.days[1]
            return (
              <button key={w.weekNum}
                onClick={() => toggleWeekInTerm(focusedTerm.id, w.weekNum)}
                style={{
                  padding: '0.35rem 0.65rem', borderRadius: 'var(--r-sm)',
                  border: `2px solid ${inTerm ? focusedTerm.color : '#ddd8ce'}`,
                  background: inTerm ? focusedTerm.color : 'var(--white)',
                  color: inTerm ? 'white' : 'var(--muted)',
                  fontFamily: 'var(--font-sans)', fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                Wk {w.weekNum} · {mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Year view ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-num" style={{ color: 'var(--sage)' }}>{schoolWeekCount}</div>
          <div className="stat-label">School Weeks</div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-num" style={{ color: 'var(--red)' }}>{offDayCount}</div>
          <div className="stat-label">Days Off</div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div className="stat-num" style={{ color: 'var(--navy)' }}>{terms.length}</div>
          <div className="stat-label">Terms</div>
        </div>
      </div>

      <div className="card card-sage" style={{ marginBottom: '0.85rem', padding: '0.75rem 1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--ink)', lineHeight: 1.6 }}>
          <strong>Tap a week number</strong> to mark it as a school week (highlighted).
          <strong> Tap a school day</strong> to mark it as a day off (red).
          Then create terms below and assign weeks to them.
        </p>
      </div>

      {/* Month grids */}
      {Object.entries(weeksByMonth).map(([monthIdx, monthWeeks]) => (
        <div key={monthIdx} style={{ marginBottom: '1.1rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 600, marginBottom: '0.3rem' }}>
            {MONTH_FULL[monthIdx]}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
            <div />
            {DAY_LABELS.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '0.55rem', color: 'var(--muted)', fontWeight: 700 }}>{d}</div>
            ))}
          </div>
          {monthWeeks.map(week => {
            const isSchool = !!schoolWeeks[week.weekNum]
            const termForWeek = terms.find(t => t.weekNums.includes(week.weekNum))
            return (
              <div key={week.weekNum} style={{ display: 'grid', gridTemplateColumns: '28px repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
                <button onClick={() => toggleWeek(week.weekNum)}
                  style={{
                    background: isSchool ? (termForWeek?.color || 'var(--sage)') : 'var(--sage-bg)',
                    border: 'none', borderRadius: 3, cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: '0.52rem', fontWeight: 700,
                    color: isSchool ? 'white' : 'var(--muted)', lineHeight: 1,
                    padding: '2px 1px', transition: 'all 0.15s',
                  }}>
                  {week.weekNum}
                </button>
                {week.days.map((day, di) => {
                  const isThisYear = day.getFullYear() === year
                  const isWeekend = di === 0 || di === 6
                  const key = dateKey(day)
                  const isOff = !!offDays[key]
                  const isToday = key === dateKey(new Date())
                  return (
                    <button key={di}
                      onClick={() => isThisYear && isSchool && !isWeekend && toggleDay(key)}
                      style={{
                        aspectRatio: '1', borderRadius: 3, padding: 0, minWidth: 0,
                        border: isToday ? '2px solid var(--gold)' : '1px solid transparent',
                        background: !isThisYear ? 'transparent'
                          : isOff ? '#fdecea'
                          : isSchool && !isWeekend ? (termForWeek ? termForWeek.color + '30' : 'var(--sage-bg)')
                          : isWeekend ? 'var(--lilac)'
                          : '#f5f2ee',
                        cursor: isThisYear && isSchool && !isWeekend ? 'pointer' : 'default',
                        fontFamily: 'var(--font-sans)', fontSize: '0.58rem',
                        color: !isThisYear ? 'transparent'
                          : isOff ? 'var(--red)'
                          : isToday ? 'var(--gold)'
                          : isWeekend ? '#ccc'
                          : isSchool ? 'var(--navy)' : '#bbb',
                        fontWeight: isToday ? 700 : 400,
                        transition: 'all 0.12s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      {isThisYear ? day.getDate() : ''}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      ))}

      {/* Terms list */}
      <h3 className="section-label" style={{ marginTop: '1.5rem' }}>Terms</h3>
      {terms.map(term => (
        <div key={term.id} className="card"
          style={{ borderLeft: `4px solid ${term.color}`, cursor: 'pointer', marginBottom: '0.5rem' }}
          onClick={() => setFocusedTermId(term.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--navy)', fontWeight: 600 }}>{term.name}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>
                {term.weekNums.length} weeks{term.theme ? ` · ${term.theme}` : ''} · tap to edit
              </div>
            </div>
            <Icons.ChevD size={16} color="var(--muted)" />
          </div>
        </div>
      ))}
      <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.4rem' }} onClick={addTerm}>
        <Icons.Plus size={14} />&nbsp;Add Term
      </button>
    </div>
  )
}

// ── BEAUTY LOOP EDITOR ────────────────────────────────────────────────────────
function BeautyLoopEditor({ beautyLoop, setBeautyLoop }) {
  const [saved, setSaved] = useState(false)

  const loopData = beautyLoop.length > 0
    ? beautyLoop
    : BEAUTY_LOOP_SUBJECTS.map(s => ({ id: s.id, subject: s.label, notes: '', active: true }))

  function persist(next) { setBeautyLoop(next); save('lrp-beauty', next) }

  function update(id, k, v)   { persist(loopData.map(b => b.id === id ? { ...b, [k]: v } : b)) }
  function toggleActive(id)    { persist(loopData.map(b => b.id === id ? { ...b, active: !b.active } : b)) }
  function addCustom()         { persist([...loopData, { id: uid(), subject: '', notes: '', active: true, custom: true }]) }
  function removeCustom(id)    { persist(loopData.filter(b => b.id !== id)) }

  const activeCount = loopData.filter(b => b.active).length

  return (
    <div>
      <div className="card card-gold" style={{ marginBottom: '0.85rem' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.65, fontStyle: 'italic' }}>
          These subjects rotate through your week in the Beauty Anchor block. If you use{' '}
          <strong style={{ fontStyle: 'normal' }}>A Gentle Feast</strong>, your loop is already planned —
          just type in which composer, artist, or hymn you're studying this term.
          Toggle off any subjects you're not currently using.
        </p>
      </div>

      {loopData.map(b => {
        const preset = BEAUTY_LOOP_SUBJECTS.find(s => s.id === b.id)
        return (
          <div key={b.id} style={{ opacity: b.active ? 1 : 0.45, transition: 'opacity 0.15s', marginBottom: '0.5rem' }}>
            <div className="card" style={{ padding: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: b.active ? '0.45rem' : 0 }}>
                <button onClick={() => toggleActive(b.id)}
                  style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, border: `2px solid ${b.active ? 'var(--sage)' : '#ddd8ce'}`, background: b.active ? 'var(--sage)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {b.active && <Icons.Check size={11} color="white" />}
                </button>
                {b.custom
                  ? <input className="form-input" style={{ flex: 1, padding: '0.25rem 0.5rem' }} value={b.subject} onChange={e => update(b.id, 'subject', e.target.value)} placeholder="Subject name…" />
                  : <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 600 }}>{b.subject}</span>
                }
                {b.custom && <button className="icon-btn" onClick={() => removeCustom(b.id)}><Icons.X size={13} /></button>}
              </div>
              {b.active && (
                <input className="form-input" value={b.notes || ''} onChange={e => update(b.id, 'notes', e.target.value)}
                  placeholder={preset?.prompt || 'What are you studying this term?'} style={{ fontSize: '0.88rem' }} />
              )}
            </div>
          </div>
        )
      })}

      <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.75rem' }}>
        <button className="btn btn-outline" onClick={addCustom}><Icons.Plus size={14} />&nbsp;Add Subject</button>
        <button className={`btn ${saved ? 'btn-sage' : 'btn-gold'}`} onClick={() => { save('lrp-beauty', loopData); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
          <Icons.Save size={14} />&nbsp;{saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
        {activeCount} active subjects
      </p>
    </div>
  )
}

// ── DAY SCHEDULE EDITOR ───────────────────────────────────────────────────────
function DayScheduleEditor({ day, blocks, setBlocks }) {
  const [saved, setSaved] = useState(false)

  const update      = (id, k, v) => setBlocks(bl => bl.map(b => b.id === id ? { ...b, [k]: v } : b))
  const updateItem  = (id, i, v) => setBlocks(bl => bl.map(b => b.id === id ? { ...b, items: b.items.map((x, j) => j === i ? v : x) } : b))
  const addItem     = (id)       => setBlocks(bl => bl.map(b => b.id === id ? { ...b, items: [...b.items, ''] } : b))
  const removeItem  = (id, i)    => setBlocks(bl => bl.map(b => b.id === id ? { ...b, items: b.items.filter((_, j) => j !== i) } : b))
  const addBlock    = ()         => setBlocks(bl => [...bl, { id: uid(), time: '', type: 'custom', items: [''] }])
  const removeBlock = (id)       => setBlocks(bl => bl.filter(b => b.id !== id))
  const moveBlock   = (id, dir)  => setBlocks(bl => {
    const i = bl.findIndex(b => b.id === id), j = i + dir
    if (j < 0 || j >= bl.length) return bl
    const n = [...bl]; [n[i], n[j]] = [n[j], n[i]]; return n
  })

  return (
    <div>
      {blocks.map((b, bi) => {
        const bt = BLOCK_TYPES[b.type] || BLOCK_TYPES.custom
        return (
          <div key={b.id} className="day-block" style={{ borderLeft: `3px solid ${bt.color}`, background: bt.bg }}>
            <div className="day-block-header">
              <div className="day-block-move">
                <button className="icon-btn icon-btn-xs" onClick={() => moveBlock(b.id, -1)} disabled={bi === 0}><Icons.ChevU size={12} /></button>
                <button className="icon-btn icon-btn-xs" onClick={() => moveBlock(b.id, 1)} disabled={bi === blocks.length - 1}><Icons.ChevD size={12} /></button>
              </div>
              <input className="form-input block-time-input" value={b.time} onChange={e => update(b.id, 'time', e.target.value)} placeholder="8:00–9:00" />
              <select className="form-input block-type-select" value={b.type} onChange={e => update(b.id, 'type', e.target.value)}>
                {Object.entries(BLOCK_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button className="icon-btn" onClick={() => removeBlock(b.id)}><Icons.Trash size={13} /></button>
            </div>
            <div className="block-items">
              {b.items.map((item, i) => (
                <div key={i} className="block-item-row">
                  <input className="form-input" value={item} onChange={e => updateItem(b.id, i, e.target.value)} placeholder="Activity…" />
                  {b.items.length > 1 && <button className="icon-btn icon-btn-xs" onClick={() => removeItem(b.id, i)}><Icons.X size={12} /></button>}
                </div>
              ))}
              <button className="text-btn" onClick={() => addItem(b.id)}>+ item</button>
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
        <button className="btn btn-outline" onClick={addBlock}><Icons.Plus size={14} />&nbsp;Add Block</button>
        <button className={`btn ${saved ? 'btn-sage' : 'btn-gold'}`} onClick={() => { save(`lrp-sched-${day}`, blocks); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
          <Icons.Save size={14} />&nbsp;{saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ── MAIN PLANNER ──────────────────────────────────────────────────────────────
export default function Planner({ termPlan, setTermPlan, beautyLoop, setBeautyLoop, daySchedules, setDaySchedules, yearPlan, setYearPlan }) {
  const [activeTab, setActiveTab] = useState('year')

  const setDayBlocks = (day) => (fn) =>
    setDaySchedules(ds => ({ ...ds, [day]: typeof fn === 'function' ? fn(ds[day] || []) : fn }))

  const TABS = [
    { id: 'year',      label: 'Year' },
    { id: 'beauty',    label: 'Beauty Loop' },
    { id: 'Monday',    label: 'Mon' },
    { id: 'Tuesday',   label: 'Tue' },
    { id: 'Wednesday', label: 'Wed' },
    { id: 'Thursday',  label: 'Thu' },
    { id: 'Friday',    label: 'Fri' },
  ]

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Planner</h2>
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'year'   && <YearCalendar yearPlan={yearPlan || {}} setYearPlan={setYearPlan || (() => {})} />}
        {activeTab === 'beauty' && <BeautyLoopEditor beautyLoop={beautyLoop} setBeautyLoop={setBeautyLoop} />}
        {DAYS.map(d => activeTab === d && (
          <DayScheduleEditor key={d} day={d} blocks={daySchedules[d] || []} setBlocks={setDayBlocks(d)} />
        ))}
      </div>
    </div>
  )
}
