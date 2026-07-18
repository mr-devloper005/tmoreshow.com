import Link from 'next/link'
import { ArrowUpRight, BookOpen, Building2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-14 sm:px-6 sm:pt-20 lg:px-10">
          <EditableReveal index={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" /> {about.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1} as="h1" className="editable-display mt-8 max-w-4xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[4rem] lg:text-[4.75rem]">
            {about.title}
          </EditableReveal>
          <EditableReveal index={2} className="mt-8 max-w-2xl">
            <p className="text-[1.15rem] leading-[1.6] text-[var(--slot4-muted-text)]">{about.description}</p>
          </EditableReveal>
        </section>

        <section className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div className="space-y-6">
            {about.paragraphs.map((paragraph, i) => (
              <EditableReveal key={i} index={i}>
                <p className="text-[1.05rem] leading-[1.75] text-[var(--slot4-muted-text)]">{paragraph}</p>
              </EditableReveal>
            ))}
          </div>
          <div className="grid gap-5">
            {about.values.map((value, i) => (
              <EditableReveal key={value.title} index={i} className="rounded-[var(--slot4-radius-card)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
                <h2 className="editable-display text-[1.35rem] font-semibold tracking-[-0.02em]">{value.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-[var(--slot4-muted-text)]">{value.description}</p>
              </EditableReveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-24 sm:px-6 lg:px-10">
          <EditableReveal index={0} className="grid gap-8 rounded-[var(--slot4-radius-card)] bg-[var(--slot4-dark-bg)] px-8 py-14 text-[var(--slot4-dark-text)] sm:px-14 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-20">
            <div>
              <p className="editable-label text-[0.72rem] tracking-[0.15em] text-white/55">Start using it</p>
              <h2 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.0225em] sm:text-[2.75rem]">
                Open {SITE_CONFIG.name} — get on with your day.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/listing" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:bg-white hover:text-[var(--slot4-page-text)]"><Building2 className="h-4 w-4" /> Directory <ArrowUpRight className="h-4 w-4" /></Link>
              <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-[var(--slot4-page-text)]"><BookOpen className="h-4 w-4" /> Library</Link>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
