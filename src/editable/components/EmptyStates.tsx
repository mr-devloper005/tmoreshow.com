import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'New entries will appear here as they are added.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[var(--slot4-radius-card)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)]">
        <SearchX className="h-5 w-5" />
      </div>
      <h2 className="editable-display mt-6 text-[1.75rem] font-semibold tracking-[-0.0225em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-[1.6] text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium transition hover:bg-[var(--slot4-dark-bg)] hover:text-[var(--slot4-dark-text)]">
        {actionLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The page stays ready even when the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
