import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function ContactPage() {
  const copy = pagesContent.contact
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-14 sm:px-6 sm:pt-20 lg:px-10">
          <EditableReveal index={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" /> {copy.eyebrow}
            </span>
          </EditableReveal>
          <EditableReveal index={1} as="h1" className="editable-display mt-8 max-w-4xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[4rem] lg:text-[4.75rem]">
            {copy.title}
          </EditableReveal>
          <EditableReveal index={2} className="mt-8 max-w-2xl">
            <p className="text-[1.15rem] leading-[1.6] text-[var(--slot4-muted-text)]">{copy.description}</p>
          </EditableReveal>
        </section>

        <section className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:px-10">
          <div className="space-y-5">
            {copy.channels.map((channel, i) => (
              <EditableReveal key={channel.title} index={i} className="rounded-[var(--slot4-radius-card)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7">
                <h2 className="editable-display text-[1.25rem] font-semibold tracking-[-0.02em]">{channel.title}</h2>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-[var(--slot4-muted-text)]">{channel.body}</p>
              </EditableReveal>
            ))}
          </div>

          <EditableReveal index={0} className="rounded-[var(--slot4-radius-card)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <h2 className="editable-display text-[1.75rem] font-semibold tracking-[-0.02em]">{copy.formTitle}</h2>
            <EditableContactLeadForm />
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
