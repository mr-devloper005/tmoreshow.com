import Link from 'next/link'
import { ArrowUpRight, BookOpen, Building2, ChevronDown, Download, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices, taskDisplayLabel, taskDisplayLabelSingular } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;/gi, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 md:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Shared premium surface — soft-rounded borderless card, hover lift.
const cardBase = 'group block rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const displayLabel = taskDisplayLabel(task)
  const displaySingular = taskDisplayLabelSingular(task)
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* HEADER */}
        <header className="pt-14 sm:pt-20">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10">
            <EditableReveal index={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--tk-accent)]" />
                {theme.kicker}
              </span>
            </EditableReveal>
            <EditableReveal index={1} as="h1" className="editable-display mt-8 max-w-4xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[4rem] lg:text-[4.75rem]">
              {voice?.headline || `Browse the ${displayLabel.toLowerCase()}`}
            </EditableReveal>
            <EditableReveal index={2} className="mt-8 max-w-2xl">
              <p className="text-[1.05rem] leading-[1.6] text-[var(--tk-muted)] sm:text-[1.15rem]">{voice?.description || theme.note}</p>
            </EditableReveal>

            {voice?.chips?.length ? (
              <EditableReveal index={3} className="mt-10 flex flex-wrap gap-2">
                {voice.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[0.75rem] font-medium text-[var(--tk-muted)]">{chip}</span>
                ))}
              </EditableReveal>
            ) : null}

            {/* Filter bar */}
            <EditableReveal index={4} className="mt-14 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--tk-muted)]">
                <span className="font-medium text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-text)] px-6 text-sm font-medium text-[var(--tk-bg)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]">Apply</button>
              </form>
            </EditableReveal>
          </div>
        </header>

        {/* PDF ARCHIVE — ad in header */}
        {task === 'pdf' ? (
          <div className="mx-auto mt-14 max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10">
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel />
          </div>
        ) : null}

        {/* GRID */}
        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-10">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => {
                // Listing archive — inject in-feed ad after position 5
                const showListingAd = task === 'listing' && index === 5
                return (
                  <div key={post.id || post.slug} className={task === 'image' ? 'mb-6 break-inside-avoid' : ''}>
                    <EditableReveal index={Math.min(index, 8)}>
                      <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                    </EditableReveal>
                    {showListingAd ? (
                      <div className="mt-6">
                        <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <EditableReveal index={0} className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-10 py-20 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-[1.75rem] font-semibold tracking-[-0.0225em]">{voice?.emptyTitle || `No ${displayLabel.toLowerCase()} yet`}</h2>
              <p className="mt-3 text-sm leading-[1.55] text-[var(--tk-muted)]">{voice?.emptyBody || `Try another category, or check back for new ${displaySingular.toLowerCase()} entries.`}</p>
            </EditableReveal>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] px-6 py-3 font-medium transition hover:border-[var(--tk-text)]">Previous</Link> : null}
              <span className="rounded-full bg-[var(--tk-surface)] border border-[var(--tk-line)] px-6 py-3 font-medium text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] px-6 py-3 font-medium transition hover:border-[var(--tk-text)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Read')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden p-4`}>
      <div className="aspect-[4/3] overflow-hidden rounded-[var(--slot4-radius-soft)] bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="p-4 pt-6">
        <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-muted)]">
          {category} · № {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="editable-display mt-3 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[0.95rem] leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read more" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} p-6 sm:p-7`}>
      <div className="flex gap-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] bg-[var(--tk-raised)]">
          {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-9 w-9 text-[var(--tk-muted)]" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-muted)]">Directory record</p>
          <h2 className="editable-display mt-2 truncate text-[1.5rem] font-semibold tracking-[-0.02em]">{post.title}</h2>
          <p className="mt-2 line-clamp-1 text-sm leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        {location ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1"><MapPin className="h-3.5 w-3.5" /> {location}</span> : null}
        {phone ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1"><Phone className="h-3.5 w-3.5" /> {phone}</span> : null}
        {website ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1"><Globe className="h-3.5 w-3.5" /> Website</span> : null}
      </div>
      <CardArrow label="View record" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[2.5rem] font-semibold leading-none tracking-[-0.0225em]">{price || 'Open'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--tk-text)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-6 text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className={`${cardBase} block overflow-hidden`}>
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(12,12,12,0.78))]" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-display line-clamp-2 text-[1.15rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/75">View <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-7`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent)] text-[var(--tk-on-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-muted)]">Saved · {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-2 text-[1.15rem] font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-medium text-[var(--tk-muted)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tk-accent)] text-[var(--tk-on-accent)]"><BookOpen className="h-6 w-6" /></div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-8 text-[1.4rem] font-semibold leading-[1.1] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">Open reference <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-6 text-[1.15rem] font-semibold tracking-[-0.02em]">{post.title}</h2>
      {role ? <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-[1.55] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

