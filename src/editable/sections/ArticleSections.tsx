import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14 sm:pt-20`}>
        <EditableReveal index={0}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" /> {voice.eyebrow}
          </span>
        </EditableReveal>
        <EditableReveal index={1} as="h1" className={`${dc.type.heroTitle} mt-8 max-w-4xl`}>
          {voice.headline}
        </EditableReveal>
        <EditableReveal index={2} className="mt-6 max-w-2xl">
          <p className={dc.type.bodyLg}>{voice.description}</p>
        </EditableReveal>
        <EditableReveal index={3} className="mt-10">
          <form action={basePath} className="flex max-w-xl flex-col gap-3 sm:flex-row">
            <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3 text-sm font-medium text-[var(--slot4-dark-text)]">Filter</button>
          </form>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index}>
                <ArticleListCard post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-10 text-center`}>
            <h2 className="editable-display text-[1.75rem] font-semibold tracking-[-0.0225em]">No entries found</h2>
            <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try another category or return to all entries.</p>
          </div>
        )}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--editable-border)] px-6 py-3 text-sm font-medium">Previous</Link> : null}
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-dark-text)]">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--editable-border)] px-6 py-3 text-sm font-medium">Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14 sm:pt-20`}>
        <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-medium"><ChevronLeft className="h-4 w-4" /> Back</Link>
        <p className={`${dc.type.eyebrow} mt-10 text-[var(--slot4-muted-text)]`}>{voice.eyebrow}</p>
        <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl`}>{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
        <div className={`${dc.surface.soft} mt-14 p-10`}>
          <p className={dc.type.body}>{post?.summary || `Article content for ${slug} will render through the editable detail page.`}</p>
          <Link href="/contact" className={`${dc.button.primary} mt-8`}>Contact <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  )
}
