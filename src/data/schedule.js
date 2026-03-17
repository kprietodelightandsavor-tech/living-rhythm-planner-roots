import { uid } from '../shared/helpers.js'

// ── DEFAULT DAY SCHEDULES ─────────────────────────────────────────────────────
// Edit this file to change the default schedule for each day.
// Each block: { id, time, type, items[], checks{} }

export const makeDefaultSchedules = () => ({
  Monday: [
    { id: uid(), time: '7:30–8:15',  type: 'morning',  items: ['Morning Chores', 'Breakfast'] },
    { id: uid(), time: '8:15–9:00',  type: 'morning',  items: ['Morning Time: Bible', 'Memory Verse', 'Hymn'] },
    { id: uid(), time: '9:00–9:45',  type: 'beauty',   items: ['Beauty Anchor: Composer', 'Picture Study'] },
    { id: uid(), time: '9:45–10:30', type: 'beauty',   items: ['Living Literature', 'Read Aloud'] },
    { id: uid(), time: '10:30–11:30',type: 'nature',   items: ['Outdoor Time & Nature Study'] },
    { id: uid(), time: '11:30–12:15',type: 'language', items: ['Language Arts', 'Copywork'] },
    { id: uid(), time: '12:15–1:00', type: 'math',     items: ['Mathematics'] },
    { id: uid(), time: '1:00–1:45',  type: 'life',     items: ['Lunch & Rest'] },
    { id: uid(), time: '1:45–2:30',  type: 'history',  items: ['History / Timeline'] },
    { id: uid(), time: '2:30–3:15',  type: 'science',  items: ['Science Reading'] },
    { id: uid(), time: '3:15–4:00',  type: 'free',     items: ['Free Afternoon'] },
  ],
  Tuesday: [
    { id: uid(), time: '7:30–8:15',  type: 'morning',  items: ['Morning Chores', 'Breakfast'] },
    { id: uid(), time: '8:15–9:00',  type: 'morning',  items: ['Morning Time: Bible', 'Memory Verse', 'Poetry'] },
    { id: uid(), time: '9:00–9:30',  type: 'coop',     items: ['CHISPA Co-op Prep'] },
    { id: uid(), time: '9:30–2:30',  type: 'coop',     items: ['CHISPA Co-op (Off-site)'] },
    { id: uid(), time: '2:30–3:15',  type: 'nature',   items: ['Outdoor Time'] },
    { id: uid(), time: '3:15–4:00',  type: 'free',     items: ['Free Afternoon'] },
  ],
  Wednesday: [
    { id: uid(), time: '7:30–8:15',  type: 'morning',  items: ['Morning Chores', 'Breakfast'] },
    { id: uid(), time: '8:15–9:00',  type: 'morning',  items: ['Morning Time: Bible', 'Memory Verse', 'Hymn'] },
    { id: uid(), time: '9:00–9:45',  type: 'beauty',   items: ['Beauty Anchor: Art', 'Handicrafts'] },
    { id: uid(), time: '9:45–10:30', type: 'beauty',   items: ['Living Literature', 'Read Aloud'] },
    { id: uid(), time: '10:30–11:30',type: 'nature',   items: ['Outdoor Time & Nature Study'] },
    { id: uid(), time: '11:30–12:15',type: 'language', items: ['Language Arts', 'Narration Practice'] },
    { id: uid(), time: '12:15–1:00', type: 'math',     items: ['Mathematics'] },
    { id: uid(), time: '1:00–1:45',  type: 'life',     items: ['Lunch & Rest'] },
    { id: uid(), time: '1:45–2:30',  type: 'history',  items: ['History Read-Aloud'] },
    { id: uid(), time: '2:30–3:15',  type: 'science',  items: ['Nature Lore or Science'] },
    { id: uid(), time: '3:15–4:00',  type: 'free',     items: ['Free Afternoon'] },
  ],
  Thursday: [
    { id: uid(), time: '7:30–8:15',  type: 'morning',  items: ['Morning Chores', 'Breakfast'] },
    { id: uid(), time: '8:15–9:00',  type: 'morning',  items: ['Morning Time: Bible', 'Memory Verse'] },
    { id: uid(), time: '9:00–9:30',  type: 'coop',     items: ['BACH Co-op Prep'] },
    { id: uid(), time: '9:30–2:30',  type: 'coop',     items: ['BACH Co-op (Off-site)'] },
    { id: uid(), time: '2:30–3:15',  type: 'nature',   items: ['Outdoor Time'] },
    { id: uid(), time: '3:15–4:00',  type: 'free',     items: ['Free Afternoon'] },
  ],
  Friday: [
    { id: uid(), time: '7:30–8:15',  type: 'morning',  items: ['Morning Chores', 'Breakfast'] },
    { id: uid(), time: '8:15–9:00',  type: 'morning',  items: ['Morning Time: Bible', 'Memory Verse', 'Hymn & Folksong'] },
    { id: uid(), time: '9:00–9:45',  type: 'beauty',   items: ['Rise & Shine: Week Review'] },
    { id: uid(), time: '9:45–10:30', type: 'beauty',   items: ['Living Literature', 'Read Aloud'] },
    { id: uid(), time: '10:30–11:30',type: 'nature',   items: ['Outdoor Time & Nature Study'] },
    { id: uid(), time: '11:30–12:15',type: 'language', items: ['Free Writing or Loop Subject'] },
    { id: uid(), time: '12:15–1:00', type: 'math',     items: ['Math Games or Review'] },
    { id: uid(), time: '1:00–1:45',  type: 'life',     items: ['Lunch & Rest'] },
    { id: uid(), time: '1:45–2:30',  type: 'history',  items: ['Handicrafts or Art'] },
    { id: uid(), time: '2:30–3:15',  type: 'free',     items: ['Tea Time & Read Aloud'] },
    { id: uid(), time: '3:15–4:00',  type: 'free',     items: ['Free Afternoon'] },
  ],
})

// ── DEFAULT BEAUTY LOOP ───────────────────────────────────────────────────────
// Edit this file to change the Beauty Loop rotation subjects.
export const defaultBeautyLoop = [
  { id: uid(), subject: 'Composer Study', notes: 'Dvořák — New World Symphony' },
  { id: uid(), subject: 'Picture Study',  notes: 'Constable — landscape series' },
  { id: uid(), subject: 'Hymn Study',     notes: 'How Great Thou Art' },
  { id: uid(), subject: 'Folk Song',      notes: 'Shenandoah' },
  { id: uid(), subject: 'Handicraft',     notes: 'Cross-stitch sampler' },
  { id: uid(), subject: 'Poetry',         notes: 'Robert Frost — seasonal selection' },
]

// ── DEFAULT TERM PLAN ─────────────────────────────────────────────────────────
export const defaultTermPlan = {
  termName: 'Autumn Term',
  startDate: '',
  endDate: '',
  theme: '',
  livingBooks: '',
  historyPeriod: '',
  scienceTopic: '',
  notes: '',
}
