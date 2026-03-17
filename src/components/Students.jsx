// ── STUDENTS SCREEN ───────────────────────────────────────────────────────────
// Edit this file to change the Student profiles and dashboard.

import React, { useState } from 'react'
import { uid, save } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function StudentForm({ onAdd }) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('6')
  const submit = () => {
    if (!name.trim()) return
    onAdd({ id: uid(), name: name.trim(), grade, notes: '', addedDate: new Date().toISOString() })
    setName('')
    setGrade('6')
  }
  return (
    <div className="card">
      <h3 className="card-title">Add a Student</h3>
      <div className="form-grid">
        <label className="form-label">Name
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Student's name" />
        </label>
        <label className="form-label">Grade
          <select className="form-input" value={grade} onChange={e => setGrade(e.target.value)}>
            {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </label>
      </div>
      <button className="btn btn-gold" style={{ marginTop: '0.75rem' }} onClick={submit} disabled={!name.trim()}>
        <Icons.Plus size={14} />&nbsp;Add Student
      </button>
    </div>
  )
}

function StudentCard({ student, narrations, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(student.notes || '')
  const studentNarrations = narrations?.[student.id] || []
  const recent = studentNarrations.slice(-5).reverse()

  const save = () => onUpdate({ ...student, notes })

  return (
    <div className="student-card">
      <div className="student-card-header" onClick={() => setOpen(o => !o)}>
        <div>
          <span className="student-card-name">{student.name}</span>
          <span className="student-card-grade">Grade {student.grade}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="tag">{studentNarrations.length} narrations</span>
          {open ? <Icons.ChevU size={16} /> : <Icons.ChevD size={16} />}
        </div>
      </div>

      {open && (
        <div className="student-card-body">
          <label className="form-label">Notes / Goals
            <textarea className="form-input" rows={3} value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Strengths, areas to develop, current books, goals…" />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="btn btn-gold btn-sm" onClick={save}><Icons.Save size={13} />&nbsp;Save</button>
            <button className="btn btn-outline btn-sm" onClick={() => onRemove(student.id)}>
              <Icons.Trash size={13} />&nbsp;Remove
            </button>
          </div>

          {recent.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 className="habit-section-title">Recent Narrations</h4>
              {recent.map(n => (
                <div key={n.id} className="narration-log-row">
                  <span className="narration-log-date">{n.date}</span>
                  <span className="narration-log-book">{n.book || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Students({ children, setChildren, narrations }) {
  const [showForm, setShowForm] = useState(false)

  const addStudent = (s) => {
    const updated = [...children, s]
    setChildren(updated)
    save('lrp-children', updated)
    setShowForm(false)
  }
  const updateStudent = (updated) => {
    const list = children.map(c => c.id === updated.id ? updated : c)
    setChildren(list)
    save('lrp-children', list)
  }
  const removeStudent = (id) => {
    const list = children.filter(c => c.id !== id)
    setChildren(list)
    save('lrp-children', list)
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Students</h2>
        <p className="screen-sub">Profiles, narration history &amp; notes</p>
      </div>

      {!showForm && (
        <button className="btn btn-gold" style={{ marginBottom: '1rem' }} onClick={() => setShowForm(true)}>
          <Icons.Plus size={16} />&nbsp;Add Student
        </button>
      )}

      {showForm && <StudentForm onAdd={addStudent} />}

      {children.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
          <p>No students yet. Add your first student to get started.</p>
        </div>
      )}

      {children.map(c => (
        <StudentCard
          key={c.id}
          student={c}
          narrations={narrations}
          onUpdate={updateStudent}
          onRemove={removeStudent}
        />
      ))}
    </div>
  )
}
