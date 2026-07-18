import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabel, taskDisplayLabelSingular } from '@/editable/content/task-pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) =>
  toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(getContent(post).description) ||
    compactRaw(getContent(post).excerpt) ||
    compactRaw(getContent(post).body) ||
    '',
  )

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = task ? taskDisplayLabelSingular(task) : 'Entry'

  return (
    <Link href={href} className="group block overflow-hidden rounded-[var(--slot4-radius-card)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)]">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">{label}</span>
        </div>
      ) : (
        <div className="border-b border-[var(--editable-border)] p-6">
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--slot4-dark-text)]">{label}</span>
        </div>
      )}
      <div className="p-7">
        <h2 className="editable-display line-clamp-3 text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-[0.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Open <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-14 sm:px-6 sm:pt-20 lg:px-10">
          <EditableReveal index={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
              {pagesContent.search.hero.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1} as="h1" className="editable-display mt-8 max-w-3xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[4rem] lg:text-[4.75rem]">
            {pagesContent.search.hero.title}
          </EditableReveal>
          <EditableReveal index={2} className="mt-6 max-w-2xl">
            <p className="text-[1.05rem] leading-[1.55] text-[var(--slot4-muted-text)] sm:text-[1.15rem]">{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3} className="mt-10">
            <form action="/search" className="grid gap-3 rounded-[var(--slot4-radius-card)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <select name="task" defaultValue={task} className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm outline-none">
                <option value="">All surfaces</option>
                {enabledTasks.map((item) => <option key={item.key} value={item.key}>{taskDisplayLabelSingular(item.key)}</option>)}
              </select>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)]">Search</button>
            </form>
          </EditableReveal>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-24 pt-20 sm:px-6 lg:px-10">
          <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">{results.length} results</p>
              <h2 className="editable-display mt-4 text-[2rem] font-semibold tracking-[-0.0225em] sm:text-[2.5rem]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/listing" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--slot4-dark-bg)] hover:text-[var(--slot4-dark-text)]">Browse {taskDisplayLabel('listing').toLowerCase()} <ArrowUpRight className="h-4 w-4" /></Link>
          </EditableReveal>

          {results.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <SearchResultCard post={post} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <EditableReveal index={0} className="mt-10 rounded-[var(--slot4-radius-card)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-14 text-center">
              <p className="editable-display text-[1.75rem] font-semibold tracking-[-0.0225em]">Nothing matched.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, surface, or category.</p>
            </EditableReveal>
          )}

          <div className="mt-14 overflow-hidden rounded-[var(--slot4-radius-card)]">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
