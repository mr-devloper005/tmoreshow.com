import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" /> {copy.badge}
            </span>
            <h1 className="editable-display mt-8 max-w-xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[3.5rem]">{copy.title}</h1>
            <p className="mt-6 max-w-lg text-[1.05rem] leading-[1.6] text-[var(--slot4-muted-text)]">{copy.description}</p>
          </div>
          <div className="rounded-[var(--slot4-radius-card)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
            <h2 className="editable-display text-[1.5rem] font-semibold tracking-[-0.02em]">{copy.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              New here? <Link href="/signup" className="font-medium text-[var(--slot4-page-text)] underline decoration-[var(--slot4-accent)] decoration-2 underline-offset-4">{copy.createCta}</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
