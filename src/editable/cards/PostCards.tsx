import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

// ── EditorialFeatureCard — dark hero-scale card (lime accent, big display type) ──
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px] lg:p-14">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:opacity-50 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,12,0.15),rgba(12,12,12,0.88))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-accent)]">{label}</span>
          <h3 className="editable-display mt-5 max-w-3xl text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.0225em] sm:text-[3rem] lg:text-[3.75rem]">{post.title}</h3>
          <p className="mt-6 max-w-2xl text-[0.95rem] leading-[1.6] text-white/72 sm:text-[1.05rem]">{getEditableExcerpt(post, 190)}</p>
          <span className={`mt-10 ${dc.button.accent}`}>
            Read more <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── RailPostCard — horizontal-rail portrait card ──
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift} border border-[var(--editable-border)]`}>
      <div className={`${dc.media.frame} ${dc.media.ratioWide} rounded-none`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className={`absolute left-4 top-4 ${dc.badge.darkPill}`}>№ {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-6">
        <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-3 line-clamp-3 text-[1.4rem] font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

// ── CompactIndexCard — small numbered list card (chip surface) ──
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const tones = [dc.surface.soft, dc.surface.card, dc.surface.soft]
  const tone = tones[index % tones.length]
  return (
    <Link href={href} className={`group block min-w-0 ${tone} p-6 ${dc.motion.lift} border border-transparent hover:border-[var(--editable-border)]`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-sm font-medium text-[var(--slot4-dark-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</p>
          <h3 className="editable-display mt-2 line-clamp-2 text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-[1.55] ${pal.mutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

// ── ArticleListCard — wide magazine-style row card ──
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} border border-[var(--editable-border)] p-4 ${dc.motion.lift} sm:grid-cols-[280px_minmax(0,1fr)] sm:gap-8`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[220px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="min-w-0 self-center p-2 sm:py-4 sm:pr-6">
        <p className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--slot4-muted-text)]">№ {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[1.875rem]">{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-[0.95rem] leading-[1.6] ${pal.mutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
          Read more <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
