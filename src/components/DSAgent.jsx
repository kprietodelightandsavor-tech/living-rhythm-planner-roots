// ── DELIGHT & SAVOR AGENT ─────────────────────────────────────────────────────
// Edit this file to change the AI assistant modes, prompts, or suggestions.
// All AI calls route through /api/claude (the Netlify serverless function).

import React, { useState, useRef, useEffect } from 'react'

const DS_MODES = [
  {
    id: 'curriculum',
    label: 'Curriculum',
    icon: '📖',
    color: '#4a6741',
    bg: '#eef2ea',
    prompt: `You are a Charlotte Mason literature and language arts curriculum assistant for Delight & Savor, a high school homeschool curriculum brand (grades 9–12) founded by Kim. Help design, write, and refine curriculum materials grounded in Charlotte Mason's philosophy — living books, narration, attention, whole-person formation. You know the DELIGHT and SAVOR frameworks, narration as the backbone of learning, "ideas before craft," and the warm-but-rigorous Brave Writer approach. Help with: student handouts, teacher's guides, lesson arcs, reading companions, discussion questions, writing prompts, honors track extensions, assessment rubrics, and sequencing across a 15-week term. Tone: literary, warm, intellectually alive.`,
  },
  {
    id: 'planning',
    label: 'Day & Term Planning',
    icon: '🌿',
    color: '#5a7a6e',
    bg: '#eef4f2',
    prompt: `You are a Charlotte Mason homeschool planning assistant for Delight & Savor. Help families plan days, weeks, and terms with intention and rhythm. You know: 5-weeks-on/2-weeks-off term structure, Morning Anchor / Beauty Loop / Living Literature blocks, loop scheduling, three co-op days plus two home days, nature study across four days. Help families build weekly schedules, plan terms, sequence subjects, create loop schedules, and balance feast days with focused work. Tone: warm guide, not productivity guru.`,
  },
  {
    id: 'qa',
    label: 'Student & Parent Q&A',
    icon: '💬',
    color: '#7a5c6e',
    bg: '#f5eff3',
    prompt: `You are a friendly assistant representing Delight & Savor, a Charlotte Mason literature curriculum for high school homeschoolers (grades 9–12). Answer questions from students and parents about: using the curriculum, what narration is, approaching difficult texts, high school Charlotte Mason education, grading narration, the DELIGHT and SAVOR frameworks, and general homeschool encouragement. Tone: warm, accessible, reassuring.`,
  },
  {
    id: 'writing',
    label: 'Writing Coach',
    icon: '✍️',
    color: '#6b5d3f',
    bg: '#fdf5e8',
    prompt: `You are a writing coach for Delight & Savor helping high school homeschool students (grades 9–12) develop as writers through a Charlotte Mason lens. Philosophy: ideas before craft. Help students brainstorm, develop ideas, organize thinking, write and revise thesis statements, craft topic sentences, work through introductions and conclusions, and give feedback on drafts. Tone: encouraging, specific, never vague. Praise what works, name what doesn't, offer a concrete next step.`,
  },
]

const DS_SUGGESTIONS = {
  curriculum: [
    'Help me build a 3-week unit on Macbeth for 10th graders',
    'Write a narration prompt for The Old Man and the Sea',
    'Create discussion questions using the DELIGHT framework',
    'Design an honors track extension for a poetry unit',
  ],
  planning: [
    'Help me plan a 5-week term schedule',
    'How do I structure Morning Anchor for high schoolers?',
    'Design a loop schedule for 3 kids ages 8–14',
    'Help me plan nature study into our week',
  ],
  qa: [
    'What is narration and how do I grade it?',
    'My student hates writing — where do I start?',
    'How is D&S different from a traditional literature class?',
    'Can I use this if my child isn\'t a strong reader?',
  ],
  writing: [
    'Help me write a thesis about Wuthering Heights',
    'My introduction isn\'t working — can you help?',
    'What\'s the difference between summary and analysis?',
    'Give me feedback on this paragraph I wrote',
  ],
}

export default function DSAgent() {
  const [mode, setMode] = useState(DS_MODES[0])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const bottomRef = useRef(null)
  const taRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const switchMode = (m) => {
    setMode(m)
    setMessages([])
    setHistory([])
    setInput('')
    if (taRef.current) taRef.current.style.height = '44px'
  }

  const handleSend = async (text) => {
    const userText = (text !== undefined ? text : input).trim()
    if (!userText || loading) return
    setInput('')
    if (taRef.current) taRef.current.style.height = '44px'

    const newHistory = [...history, { role: 'user', content: userText }]
    setMessages(p => [...p, { type: 'user', text: userText }])
    setLoading(true)

    try {
      const resp = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: mode.prompt,
          messages: newHistory,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error?.message || `HTTP ${resp.status}`)
      const reply = data?.content?.filter(b => b.type === 'text').map(b => b.text).join('') || 'No response received.'
      setHistory([...newHistory, { role: 'assistant', content: reply }])
      setMessages(p => [...p, { type: 'assistant', text: reply }])
    } catch (err) {
      setMessages(p => [...p, { type: 'error', text: `Could not reach the assistant. Check your API key setup. (${err.message})` }])
    }
    setLoading(false)
  }

  const accent = mode.color
  const accentBg = mode.bg

  const modeDesc = {
    curriculum: 'Handouts, teacher\'s guides, reading companions, and more.',
    planning: 'Design days with intention. Terms with rhythm.',
    qa: 'Questions answered warmly and clearly.',
    writing: 'Ideas before craft. Let\'s find what you want to say.',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 54px - 60px)', overflow: 'hidden' }}>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 12px', overflowX: 'auto', background: 'var(--cream)', borderBottom: '1px solid var(--sage-bg)', flexShrink: 0 }}>
        {DS_MODES.map(m => (
          <button key={m.id} onClick={() => switchMode(m)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 9, border: `1.5px solid ${mode.id === m.id ? m.color : '#ddd8ce'}`, background: mode.id === m.id ? m.bg : 'var(--white)', fontFamily: "'Cormorant Garamond',serif", fontSize: '.9rem', color: mode.id === m.id ? m.color : 'var(--muted)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s', fontWeight: mode.id === m.id ? 600 : 400 }}>
            <span>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 8px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--cream)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '12px 0 16px' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{mode.icon}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: accent, marginBottom: 6, fontWeight: 500 }}>{mode.label}</h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '.92rem', color: 'var(--muted)', maxWidth: 340, margin: '0 auto 16px', lineHeight: 1.65, fontStyle: 'italic' }}>
              {modeDesc[mode.id]}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
              {DS_SUGGESTIONS[mode.id].map(s => (
                <button key={s} onClick={() => handleSend(s)}
                  style={{ background: 'var(--white)', border: `1px solid ${accent}44`, borderRadius: 20, padding: '7px 13px', fontFamily: "'Cormorant Garamond',serif", fontSize: '.88rem', color: accent, cursor: 'pointer', transition: 'all .15s', textAlign: 'left', lineHeight: 1.35 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
            background: msg.type === 'user' ? accent : msg.type === 'error' ? '#fff5f5' : 'var(--white)',
            color: msg.type === 'user' ? 'white' : msg.type === 'error' ? '#8b2020' : 'var(--ink)',
            borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            padding: '11px 15px',
            maxWidth: '85%',
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: '.95rem',
            lineHeight: 1.7,
            boxShadow: '0 2px 10px rgba(0,0,0,.07)',
            border: msg.type === 'assistant' ? '1px solid #e8e4dc' : 'none',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}>{msg.text}</div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--white)', borderRadius: '16px 16px 16px 4px', padding: '14px 18px', border: '1px solid #e8e4dc', boxShadow: '0 2px 10px rgba(0,0,0,.07)', display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: accent, display: 'inline-block', animation: `dsagent-bounce 1.1s ${i * 0.15}s ease-in-out infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--sage-bg)', padding: '10px 12px 14px', display: 'flex', gap: 9, alignItems: 'flex-end', background: 'var(--white)', flexShrink: 0 }}>
        <textarea ref={taRef}
          value={input}
          onChange={e => {
            setInput(e.target.value)
            e.target.style.height = '44px'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder={`Ask your ${mode.label.toLowerCase()} question…`}
          style={{ flex: 1, border: `1.5px solid ${input ? '#ddd8ce' : '#e8e4dc'}`, borderRadius: 10, padding: '10px 13px', fontFamily: "'Cormorant Garamond',serif", fontSize: '.95rem', color: 'var(--ink)', background: 'var(--cream)', resize: 'none', outline: 'none', lineHeight: 1.5, height: '44px', maxHeight: '120px', transition: 'border-color .2s' }}
        />
        <button onClick={() => handleSend()} disabled={!input.trim() || loading}
          style={{ width: 42, height: 42, borderRadius: 10, border: 'none', background: input.trim() && !loading ? accent : '#ddd8ce', color: 'white', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style>{`@keyframes dsagent-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}
