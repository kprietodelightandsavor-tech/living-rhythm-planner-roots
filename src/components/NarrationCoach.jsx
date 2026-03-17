// ── NARRATION COACH SCREEN ────────────────────────────────────────────────────
// Edit this file to change the Find It · Follow It · Frame It narration flow.

import React, { useState } from 'react'
import { uid, todayStr, save, callClaude } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const STAGES = ['Find It', 'Follow It', 'Frame It']

const SYSTEM = `You are a Charlotte Mason narration coach using the Find It · Follow It · Frame It framework.
Find It: Help the student identify the most important moment, image, or idea from what they read.
Follow It: Ask one probing question that helps them go deeper — trace a thread, notice a pattern, ask why.
Frame It: Help them craft one beautiful sentence or thesis that captures what they discovered.
Be warm, specific, and brief. Reference the student's actual words. Never lecture. Ask, don't tell.`

function NarrationSession({ student, onDone }) {
  const [stage, setStage] = useState(0)
  const [text, setText] = useState('')
  const [book, setBook] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [finalNarration, setFinalNarration] = useState('')

  const submit = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const context = responses.map((r, i) => `${STAGES[i]}: ${r.user}\nCoach: ${r.coach}`).join('\n\n')
      const prompt = stage === 0
        ? `Student: ${student.name || 'the student'}\nBook/passage: ${book}\n\nThe student's narration:\n"${text}"\n\nThis is the Find It stage. Ask them to identify the most important moment or image. Be specific to what they actually said.`
        : stage === 1
        ? `${context}\n\nStudent's response: "${text}"\n\nThis is Follow It. Ask one probing question to go deeper. Be specific.`
        : `${context}\n\nStudent's response: "${text}"\n\nThis is Frame It. Help them write one powerful thesis sentence using what they discovered. Offer a draft they can refine.`
      const coach = await callClaude(prompt, SYSTEM)
      const newResponses = [...responses, { user: text, coach }]
      setResponses(newResponses)
      setText('')
      if (stage < 2) {
        setStage(s => s + 1)
      } else {
        setFinalNarration(coach)
      }
    } catch (e) {
      if (e.message === 'NO_KEY') {
        setError('No API key found. Go to the Settings tab and add your Anthropic API key to use the coach.')
      } else {
        setError('Could not reach the coach. Check your internet connection and try again.')
      }
    }
    setLoading(false)
  }

  if (finalNarration) return (
    <div className="card card-gold">
      <h3 className="card-title">Narration Complete ✦</h3>
      <div className="narration-final">
        <p className="narration-final-label">Frame It — {student.name}'s Thesis:</p>
        <p className="narration-final-text">{responses[2]?.user}</p>
        <div className="coach-bubble">{finalNarration}</div>
      </div>
      <button className="btn btn-gold" style={{ marginTop: '1rem' }} onClick={onDone}>New Session</button>
    </div>
  )

  return (
    <div>
      {responses.length === 0 && (
        <div className="card">
          <label className="form-label">Book / Passage
            <input className="form-input" value={book} onChange={e => setBook(e.target.value)} placeholder="What did you just read or hear?" />
          </label>
        </div>
      )}

      <div className="stage-progress">
        {STAGES.map((s, i) => (
          <div key={s} className={`stage-dot ${i < stage ? 'done' : i === stage ? 'active' : ''}`}>
            <span className="stage-dot-label">{s}</span>
          </div>
        ))}
      </div>

      {responses.map((r, i) => (
        <div key={i} className="exchange">
          <div className="student-bubble">{r.user}</div>
          <div className="coach-bubble">{r.coach}</div>
        </div>
      ))}

      <div className="card">
        <p className="stage-heading">{STAGES[stage]}</p>
        <textarea
          className="form-input"
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={
            stage === 0 ? `${student.name || 'Student'}, tell me what happened — or what stays with you from what you just read…`
            : stage === 1 ? 'Follow that thread further…'
            : 'Now try to say it in one sentence…'
          }
        />
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-gold" onClick={submit} disabled={loading || !text.trim()}>
          {loading ? 'Thinking…' : stage === 2 ? 'Frame It →' : 'Submit →'}
        </button>
      </div>
    </div>
  )
}

export default function NarrationCoach({ children, narrations, setNarrations }) {
  const [student, setStudent] = useState(null)
  const [inSession, setInSession] = useState(false)

  const handleDone = () => setInSession(false)

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Narration Coach</h2>
        <p className="screen-sub">Find It · Follow It · Frame It</p>
      </div>

      {!inSession ? (
        <div>
          <div className="card">
            <h3 className="card-title">Choose a Student</h3>
            {(!children || children.length === 0) ? (
              <p className="card-note">Add students in the Students tab first.</p>
            ) : (
              <div className="student-select-grid">
                {children.map(c => (
                  <button key={c.id} className={`student-chip ${student?.id === c.id ? 'active' : ''}`}
                    onClick={() => setStudent(c)}>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {student && (
            <div className="card card-sage">
              <h3 className="card-title">Ready, {student.name}?</h3>
              <p className="card-note">This session uses the three-stage narration method from Delight &amp; Savor: Find It → Follow It → Frame It. Have your book open.</p>
              <button className="btn btn-gold" style={{ marginTop: '1rem' }} onClick={() => setInSession(true)}>
                Begin Session →
              </button>
            </div>
          )}

          {narrations && Object.entries(narrations).map(([sId, nArr]) => {
            const sc = children?.find(c => c.id === sId)
            if (!sc || !nArr?.length) return null
            return (
              <div key={sId} className="card">
                <h3 className="card-title">{sc.name} — Recent Narrations</h3>
                {nArr.slice(-3).reverse().map(n => (
                  <div key={n.id} className="narration-log-row">
                    <span className="narration-log-date">{n.date}</span>
                    <span className="narration-log-book">{n.book}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <NarrationSession student={student} onDone={handleDone} />
      )}
    </div>
  )
}
