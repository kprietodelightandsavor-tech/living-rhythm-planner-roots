# Living Rhythm Planner

A Charlotte Mason homeschool planning app by [Delight & Savor](https://delightandsavor.com).

## Features

- **Home** — Today's schedule at a glance, term overview, quick navigation
- **Planner** — Term plan, Beauty Loop, and editable day-by-day schedules
- **Narration Coach** — Find It · Follow It · Frame It AI coaching sessions
- **Book Finder** — Curated living books + AI search
- **Consider the Lilies** — Commonplace journal + watercolor/sketch coach
- **Outdoor Time** — Nature study ideas, AI nature guide, observation log
- **Habit Trainer** — Charlotte Mason's top 5 habits with daily check-ins
- **Students** — Student profiles and narration history

---

## How to Edit Individual Pages

Each screen lives in its own file. You only need to open the file for the part you want to change:

| What you want to edit | File to open |
|---|---|
| Home dashboard | `src/components/Home.jsx` |
| Term Planner / Beauty Loop / Day Schedules | `src/components/Planner.jsx` |
| Default schedule data | `src/data/schedule.js` |
| Narration Coach | `src/components/NarrationCoach.jsx` |
| Book Finder + curated book list | `src/components/BookFinder.jsx` |
| Lilies Journal + Watercolor Coach | `src/components/LiliesJournal.jsx` |
| Outdoor Time | `src/components/OutdoorTime.jsx` |
| Habit Tracker | `src/components/HabitTracker.jsx` |
| Students | `src/components/Students.jsx` |
| Colors, fonts, spacing | `src/styles.css` |
| Nav items / screen routing | `src/App.jsx` |
| Shared icons | `src/shared/Icons.jsx` |
| CM Habits, Living Books seed list | `src/shared/constants.js` |

---

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deploy to Netlify

### First time setup:
1. Push this folder to a GitHub repository
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click **Add new site → Import an existing project → GitHub**
4. Select your repository
5. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **Deploy site**

### Every update after that:
1. Make your changes in the relevant file
2. Commit and push to GitHub
3. Netlify auto-deploys — your live site updates in ~60 seconds

---

## Setting Up Your API Key (Required for AI Features)

All AI features — Narration Coach, Watercolor Coach, Book Finder search, Nature Guide — route through a secure Netlify serverless function (`netlify/functions/claude.js`). Your API key **never appears in your code or browser**.

### Step 1 — Get an Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

### Step 2 — Add it to Netlify
1. In Netlify, go to your site → **Site configuration → Environment variables**
2. Click **Add a variable**
3. Key: `ANTHROPIC_API_KEY`
4. Value: paste your key
5. Click **Save**
6. **Redeploy your site** (Deploys → Trigger deploy → Deploy site)

That's it. All AI features will now work on your live site.

### Local development
Create a file called `.env` in the project root (it's in `.gitignore` so it won't be committed):
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Then run `npm run dev` — the Vite dev server will pick it up.

---

## Project Structure

```
living-rhythm-planner/
├── index.html              ← HTML entry point (rarely needs editing)
├── vite.config.js          ← Build config (rarely needs editing)
├── netlify.toml            ← Netlify deployment config
├── package.json
└── src/
    ├── main.jsx            ← React entry point (rarely needs editing)
    ├── App.jsx             ← Root shell: nav, routing, shared state
    ├── styles.css          ← ALL styles — edit here for colors/fonts
    ├── components/         ← ONE FILE PER SCREEN
    │   ├── Home.jsx
    │   ├── Planner.jsx
    │   ├── NarrationCoach.jsx
    │   ├── BookFinder.jsx
    │   ├── LiliesJournal.jsx
    │   ├── OutdoorTime.jsx
    │   ├── HabitTracker.jsx
    │   └── Students.jsx
    ├── data/
    │   └── schedule.js     ← Default schedule & term plan data
    └── shared/
        ├── constants.js    ← CM Habits, Living Books, Nature Ideas
        ├── helpers.js      ← Utility functions, API call helper
        └── Icons.jsx       ← All SVG icons
```
