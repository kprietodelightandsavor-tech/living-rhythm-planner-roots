// ── BLOCK TYPES ───────────────────────────────────────────────────────────────
export const BLOCK_TYPES = {
  morning:  { label: 'Morning Time',    color: '#7a8f6f', bg: '#eef2ea' },
  beauty:   { label: 'Beauty Anchor',   color: '#C29B61', bg: '#fdf5e8' },
  nature:   { label: 'Nature Study',    color: '#5a8a5a', bg: '#e8f0e8' },
  language: { label: 'Language Arts',   color: '#2c3e50', bg: '#e8edf3' },
  math:     { label: 'Mathematics',     color: '#6b4c8a', bg: '#f0ebf8' },
  history:  { label: 'History',         color: '#8a5a3a', bg: '#f5ede4' },
  science:  { label: 'Science',         color: '#3a7a6a', bg: '#e4f2ee' },
  coop:     { label: 'Co-op',           color: '#c0392b', bg: '#fdecea' },
  life:     { label: 'Life / Lunch',    color: '#7a7163', bg: '#f5f2ee' },
  free:     { label: 'Free Time',       color: '#b5c4a8', bg: '#f2f5ef' },
  custom:   { label: 'Custom',          color: '#4a5f73', bg: '#edf1f5' },
}

// ── CHARLOTTE MASON HABITS ────────────────────────────────────────────────────
export const CM_HABITS = [
  {
    name: 'Attention',
    why: 'The habit of attention is the foundation of all learning. A mind that can attend is a mind that can know.',
    category: 'Mind',
    introduce: 'Begin with short, rich lessons — 10–15 minutes — and end before the child loses focus. Point out what is interesting rather than demanding attention.',
    reinforce: 'Narration is attention made visible. After every lesson, ask the child to tell back what they heard or saw. No attention, no narration.',
  },
  {
    name: 'Narration',
    why: '"The mind of the child is ready for its proper work." Narration externalizes knowing and makes it the child\'s own.',
    category: 'Language',
    introduce: 'Start oral, not written. Ask "Tell me about what we just read" after every living book passage. Accept the first attempts warmly.',
    reinforce: 'Vary the form: draw it, act it, write it, map it. The content is the same; the mode deepens the knowing.',
  },
  {
    name: 'Obedience',
    why: 'Mason believed obedience — joyful, prompt, and willing — frees a child rather than constrains. It is the habit that makes all other habits possible.',
    category: 'Character',
    introduce: 'Give one clear instruction at a time. Follow through every time. Never repeat an instruction before it has been obeyed.',
    reinforce: 'Celebrate prompt obedience visibly. Name it: "You came right away — that is the habit of obedience growing in you."',
  },
  {
    name: 'Truthfulness',
    why: '"A lie is an attempt to get something for nothing." Truthfulness is the habit of intellectual and moral integrity.',
    category: 'Character',
    introduce: 'Make truth safe to tell. Never trap a child into a lie by asking a question you already know the answer to.',
    reinforce: 'Read aloud characters who tell hard truths. Discuss the cost and freedom of honesty. Model it yourself.',
  },
  {
    name: 'Perfect Execution',
    why: 'Whatever is worth doing at all is worth doing well. Mason called this "the way of the will" — finishing what you begin, doing it fully.',
    category: 'Will',
    introduce: 'Short tasks done completely rather than long tasks done sloppily. Copywork is perfect practice: one line, beautifully.',
    reinforce: 'Name the standard before the task, not after. "We do this once, and we do it well." Applaud completion over quantity.',
  },
]

// ── LIVING BOOKS SEED LIST ────────────────────────────────────────────────────
export const SEED_BOOKS = [
  { title: 'Understood Betsy', author: 'Dorothy Canfield Fisher', grade: '3–6', tags: ['narrative form', 'living language', 'character growth'] },
  { title: 'The Witch of Blackbird Pond', author: 'Elizabeth George Speare', grade: '6–9', tags: ['historical', 'author excitement', 'moral complexity'] },
  { title: 'Carry On, Mr. Bowditch', author: 'Jean Lee Latham', grade: '5–8', tags: ['narrative form', 'living language', 'inspiring'] },
  { title: 'The Hiding Place', author: 'Corrie ten Boom', grade: '7–12', tags: ['memoir', 'moral courage', 'faith'] },
  { title: 'My Antonia', author: 'Willa Cather', grade: '9–12', tags: ['literary', 'living language', 'place & memory'] },
  { title: 'Amos Fortune, Free Man', author: 'Elizabeth Yates', grade: '5–8', tags: ['historical', 'character', 'Newbery'] },
  { title: 'Men of Iron', author: 'Howard Pyle', grade: '5–8', tags: ['adventure', 'medieval', 'narrative form'] },
  { title: 'The Story of Ferdinand', author: 'Munro Leaf', grade: 'K–3', tags: ['picture book', 'gentle', 'character'] },
  { title: 'Little Pilgrim\'s Progress', author: 'Helen L. Taylor', grade: '4–7', tags: ['allegory', 'faith', 'adapted classic'] },
  { title: 'The Door in the Wall', author: 'Marguerite de Angeli', grade: '4–7', tags: ['historical', 'Newbery', 'courage'] },
  { title: 'Ronia the Robber\'s Daughter', author: 'Astrid Lindgren', grade: '4–7', tags: ['nature', 'family', 'living language'] },
  { title: 'Pilgrim at Tinker Creek', author: 'Annie Dillard', grade: '10–12', tags: ['nature writing', 'attention', 'literary'] },
]

// ── NATURE STUDY IDEAS ────────────────────────────────────────────────────────
export const NATURE_IDEAS = [
  { title: 'Object Lesson', desc: 'Bring one natural object indoors for close observation — a pinecone, feather, or seed pod. Sketch it from multiple angles in your nature journal.' },
  { title: 'Nature Walk', desc: 'Walk slowly. Stop often. Let the child lead the pace. Collect nothing; observe everything.' },
  { title: 'Nature Journal', desc: 'Date your page. Draw what you saw. Add a label or a question. One good sketch is worth more than a field guide entry.' },
  { title: 'Nature Lore', desc: 'Read one passage from a nature writer — Comstock, Burroughs, Fabre, or Dillard. Let the prose do its work.' },
  { title: 'Weather Record', desc: 'Record temperature, cloud type, wind, and any precipitation. Over weeks, patterns emerge.' },
  { title: 'Sit Spot', desc: 'Go to the same spot outdoors every day for a week. Observe what changes. This is CM attention made physical.' },
]

// ── DAYS ─────────────────────────────────────────────────────────────────────
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
