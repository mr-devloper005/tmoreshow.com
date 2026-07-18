'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { taskDisplayLabel } from '@/editable/content/task-pages.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10">
        <div className="grid gap-8 rounded-[2.5rem] bg-[var(--slot4-accent)] px-8 py-14 text-[var(--slot4-on-accent)] sm:grid-cols-[1.4fr_1fr] sm:items-center sm:px-14 sm:py-16 lg:px-20">
          <div>
            <p className="editable-label text-[0.72rem] tracking-[0.15em]">Start here</p>
            <h2 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.0225em] sm:text-[2.75rem] lg:text-[3.25rem]">
              Two clean surfaces. One search bar.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Link href="/listing" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-surface-bg)] hover:text-[var(--slot4-page-text)]">
              Open directory <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-dark-bg)]/25 bg-transparent px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-[var(--slot4-dark-text)]">
              Open library
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-5 pb-8 pt-20 sm:px-6 sm:pt-24 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-[var(--slot4-accent)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-[1.4rem] font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-6 max-w-md text-[0.95rem] leading-[1.6] text-white/65">{globalContent.footer?.description}</p>
        </div>

        <div>
          <h3 className="editable-label text-[0.72rem] text-white/50">Discover</h3>
          <div className="mt-5 grid gap-2.5">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">
                {taskDisplayLabel(task.key)}
              </Link>
            ))}
            <Link href="/search" className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">Search everything</Link>
          </div>
        </div>

        <div>
          <h3 className="editable-label text-[0.72rem] text-white/50">Site</h3>
          <div className="mt-5 grid gap-2.5">
            <Link href="/about" className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">About</Link>
            <Link href="/contact" className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="editable-label text-[0.72rem] text-white/50">Account</h3>
          <div className="mt-5 grid gap-2.5">
            {session ? (
              <>
                <Link href="/create" className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">Submit</Link>
                <button type="button" onClick={logout} className="text-left text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">Sign in</Link>
                <Link href="/signup" className="text-[0.95rem] font-medium text-white/85 transition hover:text-[var(--slot4-accent)]">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--editable-container)] border-t border-white/10 px-5 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-3 text-[0.85rem] text-white/60 sm:flex-row sm:items-center">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="italic text-white/50">{globalContent.footer?.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
