'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabelSingular } from '@/editable/content/task-pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'w-full rounded-[1rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle(''); setCategory(''); setSummary(''); setUrl(''); setImage(''); setBody('')
  }

  if (!session) {
    const lock = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className="mx-auto grid max-w-4xl gap-8 px-5 py-20 sm:px-6 lg:px-10">
            <div className="rounded-[var(--slot4-radius-card)] bg-[var(--slot4-surface-bg)] p-10 sm:p-14">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)]">
                <Lock className="h-7 w-7" />
              </div>
              <p className="editable-label mt-8 text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">{lock.badge}</p>
              <h1 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.0225em] sm:text-[3rem]">{lock.title}</h1>
              <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.6] text-[var(--slot4-muted-text)]">{lock.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)]">Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-7 py-3.5 text-sm font-medium">Create account</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">{hero.badge}</p>
              <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.0225em] sm:text-[3.5rem]">{hero.title}</h1>
              <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.6] text-[var(--slot4-muted-text)]">{hero.description}</p>
              <div className="mt-10 grid gap-3">
                {enabledTasks.map((item) => {
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-[1.25rem] p-5 text-left transition ${active ? 'bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]' : 'bg-[var(--slot4-surface-bg)] hover:bg-[var(--slot4-warm)]'}`}
                    >
                      <p className="editable-label text-[0.68rem] tracking-[0.14em] opacity-70">Submit to</p>
                      <p className="editable-display mt-2 text-[1.25rem] font-semibold tracking-[-0.02em]">{taskDisplayLabelSingular(item.key)}</p>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[var(--slot4-radius-card)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="editable-display text-[1.75rem] font-semibold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                <span className="rounded-full bg-[var(--slot4-accent)] px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--slot4-on-accent)]">{session.name}</span>
              </div>
              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Website / source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full details" required />
              </div>

              {created ? (
                <div className="mt-6 flex items-center gap-2 rounded-[1rem] bg-[var(--slot4-accent-soft)] px-5 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4" /> {pagesContent.create.successTitle}: {created.title}
                </div>
              ) : null}

              <button type="submit" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-4 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
