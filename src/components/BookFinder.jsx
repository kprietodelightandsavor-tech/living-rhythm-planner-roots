// ── BOOK FINDER SCREEN ────────────────────────────────────────────────────────
// Edit this file to change the Living Book Finder content and seed list.

import React, { useState } from 'react'
import { SEED_BOOKS } from '../shared/constants.js'
import { callClaude } from '../shared/helpers.js'
import * as Icons from '../shared/Icons.jsx'

const GRADES = ['All Grades', 'K–3', '3–6', '4–7', '5–8', '6–9', '7–12', '9–12', '10–12']
const TAGS = ['All', 'narrative form', 'living language', 'author excitement', 'historical', 'nature', 'character', 'faith', 'literary']

const SYSTEM = `You are a Charlotte Mason curriculum specialist who recommends living books.
A living book is written by someone who loves the subject, has a narrative or conversational quality, and treats the child as an intelligent person.
When recommending books, give 3–5 specific titles with author names, appropriate grade range, and one sentence explaining why it qualifies as a living book.
Format each as: Title by Author (Grades X–X) — reason it's a living book.`

export default function BookFinder() {
  const [gradeFilter, setGradeFilter] = useState('All Grades')
  const [tagFilter, setTagFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [myList, setMyList] = useState([])

  const filtered = SEED_BOOKS.filter(b => {
    const gradeOk = gradeFilter === 'All Grades' || b.grade === gradeFilter
    const tagOk = tagFilter === 'All' || b.tags.includes(tagFilter)
    return gradeOk && tagOk
  })

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      const text = await callClaude(
        `Recommend Charlotte Mason living books for: ${query}`,
        SYSTEM
      )
      setResults(text.split('\n').filter(l => l.trim()))
    } catch {
      setError('Search unavailable right now. Browse the curated list below.')
    }
    setLoading(false)
  }

  const toggleList = (book) => {
    setMyList(l => l.find(b => b.title === book.title)
      ? l.filter(b => b.title !== book.title)
      : [...l, book]
    )
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Living Book Finder</h2>
        <p className="screen-sub">Books that are alive — written with delight, read with attention</p>
      </div>

      {/* AI Search */}
      <div className="card">
        <h3 className="card-title">Find Books</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-input" style={{ flex: 1 }} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Colonial America, nature study, ancient history…"
            onKeyDown={e => e.key === 'Enter' && search()} />
          <button className="btn btn-gold" onClick={search} disabled={loading}>
            {loading ? '…' : <Icons.Search size={16} />}
          </button>
        </div>
        {error && <p className="error-text" style={{ marginTop: '0.5rem' }}>{error}</p>}
        {results.length > 0 && (
          <div className="ai-results">
            {results.map((r, i) => r && (
              <p key={i} className="ai-result-line">{r}</p>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filter-row">
        <select className="form-input filter-select" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
          {GRADES.map(g => <option key={g}>{g}</option>)}
        </select>
        <select className="form-input filter-select" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          {TAGS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Curated List */}
      <h3 className="section-label">Curated Living Books ({filtered.length})</h3>
      {filtered.map(b => (
        <div key={b.title} className="book-card">
          <div className="book-info">
            <span className="book-title">{b.title}</span>
            <span className="book-author">{b.author}</span>
            <span className="book-grade">Grades {b.grade}</span>
            <div className="tag-list" style={{ marginTop: '0.25rem' }}>
              {b.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <button
            className={`icon-btn ${myList.find(l => l.title === b.title) ? 'icon-btn-active' : ''}`}
            onClick={() => toggleList(b)}
          >
            <Icons.Star size={16} />
          </button>
        </div>
      ))}

      {/* My List */}
      {myList.length > 0 && (
        <div className="card card-gold" style={{ marginTop: '1.5rem' }}>
          <h3 className="card-title">My Reading List ({myList.length})</h3>
          {myList.map(b => (
            <div key={b.title} className="book-list-row">
              <span>{b.title}</span>
              <button className="icon-btn" onClick={() => toggleList(b)}><Icons.X size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
