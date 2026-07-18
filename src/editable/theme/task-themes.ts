import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task themes — one shared Montera-inspired visual language for every task.
  Palette is unified; only kicker/note copy varies per task so each surface
  still has a little voice. Tokens delivered via CSS variables (--tk-*).
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  fontLabel: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
  radiusPill: string
}

const DISPLAY = "'Inter Display', 'Inter', system-ui, -apple-system, sans-serif"
const LABEL = "'Inter Tight', 'Inter', system-ui, sans-serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  fontLabel: LABEL,
  bg: '#f6f6f6',
  surface: '#ffffff',
  raised: '#f0f0f0',
  text: '#0c0c0c',
  muted: '#86868b',
  line: 'rgba(0,0,0,0.10)',
  accent: '#d0ff52',
  accentSoft: '#f2ffcc',
  onAccent: '#0c0c0c',
  glow: 'rgba(208,255,82,0.20)',
  radius: '1.875rem',
  radiusPill: '5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Editorial', note: 'Long-form reads and analysis worth your time.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Trusted places and businesses near you.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers, updated daily.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual feed of standout imagery.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Curated links worth saving.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Downloadable guides, reports, and reference material.' },
  profile: { ...base, kicker: 'People', note: 'Creators, businesses, and profiles worth knowing.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--tk-radius-pill': t.radiusPill,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    '--editable-font-label': t.fontLabel,
    fontFamily: t.fontBody,
  } as CSSProperties
}
