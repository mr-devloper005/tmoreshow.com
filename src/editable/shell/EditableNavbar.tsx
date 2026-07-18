'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const staticLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <nav className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-4 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]/95 px-4 py-3 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:px-6 sm:py-3.5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-5 w-5 object-contain invert" />
          </span>
          <span className="editable-display text-[1.15rem] font-semibold leading-none tracking-[-0.02em]">{SITE_CONFIG.name}</span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {staticLinks.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium tracking-[-0.005em] transition ${
                  active
                    ? 'bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm)] sm:inline-flex"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)] sm:inline-flex"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)] sm:inline-flex"
              >
                Get started
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="mx-auto mt-3 w-full max-w-[var(--editable-container)] rounded-[1.75rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="grid gap-1">
            {staticLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-4 py-3 text-sm font-medium ${
                    active ? 'bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href="/search" onClick={() => setOpen(false)} className="rounded-full px-4 py-3 text-sm font-medium text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-warm)]">
              Search
            </Link>
          </div>
          <div className="mt-4 grid gap-2 border-t border-[var(--editable-border)] pt-4">
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="inline-flex items-center justify-center rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium">
                  Submit
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setOpen(false) }}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-dark-text)]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="inline-flex items-center justify-center rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-dark-text)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
