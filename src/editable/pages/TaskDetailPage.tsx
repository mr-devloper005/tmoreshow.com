import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Clock, Download, ExternalLink, FileText, Globe2, Hash, Layers, Mail, MapPin, Phone, ShieldCheck, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { taskDisplayLabel, taskDisplayLabelSingular } from '@/editable/content/task-pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const tagsOf = (post: SitePost) => Array.from(new Set([...(Array.isArray(post.tags) ? post.tags : [])])).filter(Boolean).slice(0, 8)
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--tk-accent)]" />
      {children}
    </span>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskDisplayLabel(task).toLowerCase()}
    </Link>
  )
}

/* ───────────── ARTICLE ───────────── */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20">
        <BackLink task="article" />
        <EditableReveal index={0} className="mt-10">
          <Kicker>{categoryOf(post, 'Article')}</Kicker>
        </EditableReveal>
        <EditableReveal index={1} as="h1" className="editable-display mt-6 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[3.5rem] lg:text-[4rem]">
          {post.title}
        </EditableReveal>
        {images[0] ? <EditableReveal index={2}><img src={images[0]} alt="" className="mt-12 aspect-[16/9] w-full rounded-[var(--tk-radius)] object-cover" /></EditableReveal> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ───────────── LISTING — premium directory record ───────────── */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0]
  const gallery = images.slice(1)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'schedule'])
  const category = categoryOf(post, 'Local')
  const tags = tagsOf(post)
  const mapSrc = mapSrcFor(post)

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-14 sm:px-6 sm:pt-20 lg:px-10">
        <EditableReveal index={0}><BackLink task="listing" /></EditableReveal>

        {/* Title block */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <EditableReveal index={1}><Kicker>Directory record · {category}</Kicker></EditableReveal>
            <EditableReveal index={2} as="h1" className="editable-display mt-6 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[4rem] lg:text-[4.5rem]">
              {post.title}
            </EditableReveal>
            {leadText(post) ? (
              <EditableReveal index={3} className="mt-6 max-w-2xl">
                <p className="text-[1.15rem] leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p>
              </EditableReveal>
            ) : null}
          </div>
        </div>

        {/* Hero image — 21:9 wide */}
        {heroImage ? (
          <EditableReveal index={4} className="mt-12 overflow-hidden rounded-[var(--tk-radius)]">
            <img src={heroImage} alt={post.title} className="aspect-[21/9] w-full object-cover" />
          </EditableReveal>
        ) : (
          <EditableReveal index={4} className="mt-12 flex aspect-[21/9] w-full items-center justify-center rounded-[var(--tk-radius)] bg-[var(--tk-raised)]">
            <Building2 className="h-16 w-16 text-[var(--tk-muted)]" />
          </EditableReveal>
        )}

        {/* Quick-facts strip */}
        <EditableReveal index={5} className="mt-8 flex flex-wrap gap-3">
          {address ? <FactChip icon={MapPin} label={address} /> : null}
          {phone ? <FactChip icon={Phone} label={phone} /> : null}
          {hours ? <FactChip icon={Clock} label={hours} /> : null}
          <FactChip icon={ShieldCheck} label="Verified" tone="accent" />
        </EditableReveal>

        {/* Body + sidebar */}
        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal index={0} as="h2" className="editable-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.0225em] sm:text-[2.5rem]">
              About this record
            </EditableReveal>
            <BodyContent post={post} />

            {tags.length ? (
              <EditableReveal index={1} className="mt-10 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--tk-raised)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--tk-text)]">#{tag}</span>
                ))}
              </EditableReveal>
            ) : null}

            {gallery.length ? (
              <EditableReveal index={2} className="mt-14">
                <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-muted)]">Photo gallery</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {gallery.slice(0, 6).map((image, idx) => (
                    <img key={`${image}-${idx}`} src={image} alt="" className="aspect-[4/3] w-full rounded-[var(--tk-radius)] object-cover" />
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            {mapSrc ? (
              <EditableReveal index={3} className="mt-14">
                <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-muted)]">Location</p>
                <div className="mt-5 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-[420px] w-full border-0" />
                </div>
              </EditableReveal>
            ) : null}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <EditableReveal index={0}>
              <div className="rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] p-7">
                <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-muted)]">Get in touch</p>
                <div className="mt-5 grid gap-1">
                  {address ? <ContactRow icon={MapPin} label="Address" value={address} /> : null}
                  {phone ? <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                  {email ? <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                  {website ? <ContactRow icon={Globe2} label="Website" value={website} href={website} external /> : null}
                  {hours ? <ContactRow icon={Clock} label="Hours" value={hours} /> : null}
                </div>
                {website || phone ? (
                  <Link
                    href={website || `tel:${phone}`}
                    target={website ? '_blank' : undefined}
                    rel={website ? 'noreferrer' : undefined}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-[var(--tk-bg)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]"
                  >
                    {website ? 'Visit website' : 'Call now'} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[var(--tk-radius)] bg-[var(--tk-accent-soft)] p-7">
                <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-text)]">Trust & safety</p>
                <div className="mt-5 grid gap-3">
                  <TrustRow label="Verified before publish" />
                  <TrustRow label="Contact details confirmed" />
                  <TrustRow label="Kept up to date by editors" />
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <div className="rounded-[var(--tk-radius)] overflow-hidden">
                <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
              </div>
            </EditableReveal>
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

/* ───────────── PDF — document workspace, no images anywhere in article ───────────── */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const fileSize = getField(post, ['fileSize', 'size'])
  const pages = getField(post, ['pages', 'pageCount'])
  const uploader = getField(post, ['uploader', 'uploadedBy', 'author', 'submittedBy'])
  const filename = getField(post, ['filename', 'fileName']) || `${post.slug || 'document'}.pdf`
  const category = categoryOf(post, 'Reference')
  const tags = tagsOf(post)
  const lead = leadText(post)
  const sections = extractInsideList(getBody(post))
  const displaySingular = taskDisplayLabelSingular('pdf')

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 pt-14 sm:px-6 sm:pt-20 lg:px-10">
        <EditableReveal index={0}><BackLink task="pdf" /></EditableReveal>

        {/* Chip row */}
        <EditableReveal index={1} className="mt-10 flex flex-wrap gap-2">
          <Kicker>{displaySingular}</Kicker>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--tk-on-accent)]">
            <FileText className="h-3.5 w-3.5" /> Reference file
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)]">
            <Hash className="h-3.5 w-3.5" /> {category}
          </span>
        </EditableReveal>

        {/* Huge title */}
        <EditableReveal index={2} as="h1" className="editable-display mt-8 text-balance text-[2.75rem] font-semibold leading-[1] tracking-[-0.0225em] sm:text-[4.5rem] lg:text-[5.25rem]">
          {post.title}
        </EditableReveal>

        {/* Pull-quote lead */}
        {lead ? (
          <EditableReveal index={3} className="mt-10 max-w-3xl">
            <blockquote className="border-l-4 border-[var(--tk-accent)] pl-6">
              <p className="editable-display text-[1.35rem] font-medium italic leading-[1.4] tracking-[-0.01em] text-[var(--tk-text)] sm:text-[1.65rem]">
                {lead}
              </p>
            </blockquote>
          </EditableReveal>
        ) : null}

        {/* CTA row */}
        <EditableReveal index={4} className="mt-10 flex flex-wrap gap-3">
          {fileUrl ? (
            <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-medium text-[var(--tk-bg)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]">
              Download <Download className="h-4 w-4" />
            </Link>
          ) : null}
          {fileUrl ? (
            <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-transparent px-7 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]">
              Open in new tab <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
        </EditableReveal>

        {/* Quick-facts strip */}
        <EditableReveal index={5} className="mt-10 flex flex-wrap gap-3">
          {pages ? <FactChip icon={Layers} label={`${pages} pages`} /> : null}
          {fileSize ? <FactChip icon={FileText} label={fileSize} /> : null}
          <FactChip icon={Tag} label="Reference file" />
          {uploader ? <FactChip icon={UserRound} label={uploader} /> : null}
        </EditableReveal>

        {/* PDF preview iframe — hero */}
        {fileUrl ? (
          <EditableReveal index={6} className="mt-14 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={post.title}
              className="h-[85vh] w-full bg-[var(--tk-raised)]"
            />
          </EditableReveal>
        ) : (
          <EditableReveal index={6} className="mt-14 flex h-[60vh] items-center justify-center rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)]">
            <div className="text-center">
              <FileText className="mx-auto h-14 w-14 text-[var(--tk-muted)]" />
              <p className="mt-4 text-sm text-[var(--tk-muted)]">Preview is not available yet.</p>
            </div>
          </EditableReveal>
        )}

        {/* Two-col body */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <EditableReveal index={0} as="h2" className="editable-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.0225em] sm:text-[2.75rem]">
              What this reference covers
            </EditableReveal>
            <BodyContent post={post} />

            {tags.length ? (
              <EditableReveal index={1} className="mt-10 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--tk-raised)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--tk-text)]">#{tag}</span>
                ))}
              </EditableReveal>
            ) : null}

            {/* Repeated CTA callout at bottom of article */}
            {fileUrl ? (
              <EditableReveal index={2} className="mt-14 rounded-[var(--tk-radius)] bg-[var(--tk-accent)] p-8 text-[var(--tk-on-accent)] sm:p-10">
                <p className="editable-label text-[0.72rem] tracking-[0.14em]">Ready when you are</p>
                <p className="editable-display mt-4 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.0225em] sm:text-[2.25rem]">
                  Download the full reference and keep it for later.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-medium text-[var(--tk-bg)] transition hover:bg-[var(--tk-surface)] hover:text-[var(--tk-text)]">
                    Download <Download className="h-4 w-4" />
                  </Link>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-text)]/25 px-7 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]">
                    Open in new tab <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>
            ) : null}

            {/* Article-bottom ad — inside article, before related strip */}
            <EditableReveal index={3} className="mt-14 overflow-hidden rounded-[var(--tk-radius)]">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </EditableReveal>
          </article>

          {/* Sidebar — document identity + What's inside */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <EditableReveal index={0}>
              <div className="rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] p-7">
                <div className="flex h-32 w-full items-center justify-center rounded-[1.25rem] bg-[var(--tk-accent)]">
                  <FileText className="h-16 w-16 text-[var(--tk-on-accent)]" strokeWidth={1.5} />
                </div>
                <p className="mt-6 break-all font-mono text-[0.85rem] text-[var(--tk-text)]">{filename}</p>
                <div className="mt-6 grid gap-3 border-t border-[var(--tk-line)] pt-5 text-sm">
                  <MetaRow label="Category" value={category} />
                  {pages ? <MetaRow label="Pages" value={pages} /> : null}
                  {fileSize ? <MetaRow label="File size" value={fileSize} /> : null}
                  {uploader ? <MetaRow label="Uploaded by" value={uploader} /> : null}
                </div>
                {fileUrl ? (
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-[var(--tk-bg)] transition hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]">
                    Download <Download className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-[var(--tk-radius)] bg-[var(--tk-accent-soft)] p-7">
                <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--tk-text)]">What's inside</p>
                <ul className="mt-5 grid gap-2.5 text-sm text-[var(--tk-text)]">
                  {sections.length ? sections.map((section) => (
                    <li key={section} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tk-text)]" />
                      <span>{section}</span>
                    </li>
                  )) : (
                    <>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tk-text)]" /><span>Overview and summary</span></li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tk-text)]" /><span>Key sections</span></li>
                      <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tk-text)]" /><span>References and appendix</span></li>
                    </>
                  )}
                </ul>
              </div>
            </EditableReveal>
          </aside>
        </div>
      </section>

      <PdfRelatedStrip related={related} />
    </>
  )
}

// Extract short section list from body content — first few lines/headings/li.
function extractInsideList(body: string): string[] {
  const text = stripHtml(body)
  const parts = text.split(/[·•\-–]|\n|\.\s+/).map((p) => p.trim()).filter((p) => p.length > 3 && p.length < 90)
  return Array.from(new Set(parts)).slice(0, 5)
}

/* ───────────── CLASSIFIED, IMAGE, BOOKMARK, PROFILE — kept lean, no ads ───────────── */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] p-7">
            <Kicker>Notice</Kicker>
            <h1 className="editable-display mt-6 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em]">{post.title}</h1>
            <p className="editable-display mt-6 text-[3rem] font-semibold leading-none tracking-[-0.0225em] text-[var(--tk-text)]">{price || 'Open'}</p>
            <div className="mt-6 grid gap-2.5">
              {condition ? <MetaRow label="Condition" value={condition} /> : null}
              {location ? <MetaRow label="Location" value={location} /> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-2.5 text-sm font-medium text-[var(--tk-bg)]"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.slice(0, 4).map((image, i) => <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] w-full rounded-[var(--tk-radius)] object-cover" />)}
            </div>
          ) : null}
          <BodyContent post={post} />
          {website ? (
            <div className="mt-10">
              <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-medium text-[var(--tk-bg)] hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]">Visit website <ExternalLink className="h-4 w-4" /></Link>
            </div>
          ) : null}
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-10">
        <BackLink task="image" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Kicker><Camera className="h-3.5 w-3.5" /> Gallery</Kicker>
            <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.0225em] sm:text-[3.25rem]">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-[1.05rem] leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tk-accent)] text-[var(--tk-on-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker>Bookmark</Kicker></div>
        <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.0225em] sm:text-[3.25rem]">{post.title}</h1>
        {leadText(post) ? <p className="mt-6 text-[1.15rem] leading-[1.55] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-medium text-[var(--tk-bg)] hover:bg-[var(--tk-accent)] hover:text-[var(--tk-on-accent)]">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-10">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-[1.75rem] font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{role}</p> : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-2.5 text-sm font-medium text-[var(--tk-bg)]">Website <ExternalLink className="h-4 w-4" /></Link> : null}
                {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium"><Mail className="h-4 w-4" /> Email</a> : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker>Profile</Kicker>
            <BodyContent post={post} />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ───────────── Shared building blocks ───────────── */

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-[1.6]' : 'text-[1.0625rem] leading-[1.75]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function FactChip({ icon: Icon, label, tone = 'default' }: { icon: typeof MapPin; label: string; tone?: 'default' | 'accent' }) {
  const cls =
    tone === 'accent'
      ? 'inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-sm font-medium text-[var(--tk-on-accent)]'
      : 'inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-sm font-medium text-[var(--tk-text)]'
  return (
    <span className={cls}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  )
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof MapPin; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tk-raised)] text-[var(--tk-text)]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="editable-label block text-[0.68rem] tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
        <span className="mt-0.5 block break-words text-sm font-medium leading-snug text-[var(--tk-text)] [overflow-wrap:anywhere]">{value}</span>
      </span>
    </>
  )
  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-[var(--tk-raised)]">
        {inner}
      </a>
    )
  }
  return <div className="flex items-center gap-3 px-3 py-2.5">{inner}</div>
}

function TrustRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-[var(--tk-text)]">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

/* ───────────── Related strips ───────────── */

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const displayLabel = taskDisplayLabel(task)
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-10">
        <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="editable-display text-[2rem] font-semibold tracking-[-0.0225em] sm:text-[2.5rem]">
            More from the {displayLabel.toLowerCase()}
          </h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]">
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <RelatedCard task={task} post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
      <div className="aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
      </div>
      <div className="p-5">
        <h3 className="editable-display line-clamp-2 text-base font-semibold leading-[1.2] tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.55] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

/* PDF related — NO photography; document glyph + title + size chip */
function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  const displayLabel = taskDisplayLabel('pdf')
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-10">
        <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="editable-display text-[2rem] font-semibold tracking-[-0.0225em] sm:text-[2.5rem]">
            More from the {displayLabel.toLowerCase()}
          </h2>
          <Link href={taskConfig?.route || '/pdf'} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-bg)]">
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </EditableReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => {
            const fileSize = getField(item, ['fileSize', 'size']) || 'Reference'
            const href = `${taskConfig?.route || '/pdf'}/${item.slug}`
            return (
              <EditableReveal key={item.id || item.slug} index={i}>
                <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] bg-[var(--tk-surface)] border border-[var(--tk-line)] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
                  <div className="flex h-32 w-full items-center justify-center rounded-[1.25rem] bg-[var(--tk-accent)]">
                    <FileText className="h-12 w-12 text-[var(--tk-on-accent)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="editable-display mt-5 line-clamp-2 text-base font-semibold leading-[1.2] tracking-[-0.01em]">{item.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">
                    <FileText className="h-3.5 w-3.5" /> {fileSize}
                  </span>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
