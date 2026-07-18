import Link from 'next/link'
import { ArrowUpRight, ArrowRight, BookOpen, Building2, Download, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabel, taskDisplayLabelSingular } from '@/editable/content/task-pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
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

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ─── HERO ──────────────────────────────────────────────────────────── */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const showcase = pool.slice(0, 3)
  const heroCopy = pagesContent.home.hero
  const [line1, line2] = heroCopy.title || ['A local directory —', 'and an open reference library.']
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)] pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10">
        <EditableReveal index={0}>
          <span className={dc.badge.pill}>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent)]" />
            {heroCopy.badge}
          </span>
        </EditableReveal>
        <EditableReveal index={1} as="h1" className={`${dc.type.heroTitle} mt-8 max-w-[18ch]`}>
          <span>{line1}</span>{' '}
          <span className="relative inline-block">
            <span className="relative z-10">{line2}</span>
          </span>
        </EditableReveal>
        <EditableReveal index={2} className="mt-8 max-w-2xl">
          <p className={dc.type.bodyLg}>{heroCopy.description}</p>
        </EditableReveal>

        <EditableReveal index={3} className="mt-10 flex flex-wrap items-center gap-3">
          <Link href={heroCopy.primaryCta.href} className={dc.button.primary}>
            {heroCopy.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href={heroCopy.secondaryCta.href} className={dc.button.secondary}>
            {heroCopy.secondaryCta.label}
          </Link>
        </EditableReveal>

        <EditableReveal index={4} className="mt-10">
          <form action="/search" className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-2 py-2">
            <div className="flex flex-1 items-center gap-3 pl-4">
              <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
              <input name="q" placeholder={heroCopy.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[var(--slot4-muted-text)]" />
            </div>
            <button className="shrink-0 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-accent)] hover:text-[var(--slot4-on-accent)]">Search</button>
          </form>
        </EditableReveal>
      </div>

      {/* Showcase strip — real posts, chip-card treatment */}
      {showcase.length ? (
        <div className="mx-auto mt-20 w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {showcase.map((post, i) => {
              const tones = ['bg-[var(--slot4-accent)]', 'bg-[var(--slot4-mint)]', 'bg-[var(--slot4-pink)]']
              const tone = tones[i % 3]
              return (
                <EditableReveal key={post.id || post.slug} index={i} className={`${tone} rounded-[var(--slot4-radius-card)] p-7 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)]`}>
                  <Link href={postHref(primaryTask, post, primaryRoute)} className="group flex h-full flex-col">
                    <span className="editable-label text-[0.72rem] tracking-[0.14em] text-[var(--slot4-on-accent)]/75">{categoryOf(post) || 'Featured'}</span>
                    <h3 className="editable-display mt-4 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--slot4-on-accent)]">{post.title}</h3>
                    <p className="mt-4 line-clamp-3 text-[0.95rem] leading-[1.55] text-[var(--slot4-on-accent)]/80">{getExcerpt(post, 130)}</p>
                    <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-on-accent)]">
                      Open {taskDisplayLabelSingular(primaryTask).toLowerCase()}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </EditableReveal>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* ─── STORY RAIL → Feature chip cards (Directory + Library + Search) ── */
export function EditableStoryRail(_props: HomeSectionProps) {
  const copy = pagesContent.home.tagline
  const toneMap: Record<string, string> = {
    lime: 'bg-[var(--slot4-accent)] text-[var(--slot4-on-accent)]',
    mint: 'bg-[var(--slot4-mint)] text-[var(--slot4-page-text)]',
    pink: 'bg-[var(--slot4-pink)] text-[var(--slot4-page-text)]',
    dark: 'bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]',
  }
  const iconMap: Record<string, typeof Building2> = {
    directory: Building2,
    library: BookOpen,
    search: Search,
  }
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <EditableReveal index={0}>
            <p className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">{copy.eyebrow}</p>
            <h2 className={`${dc.type.sectionTitle} mt-5`}>{copy.title}</h2>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className={dc.type.bodyLg}>{copy.description}</p>
          </EditableReveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {copy.cards.map((card, i) => {
            const Icon = iconMap[card.key] || Sparkles
            return (
              <EditableReveal key={card.key} index={i} className={`${toneMap[card.tone] || toneMap.lime} group flex flex-col rounded-[var(--slot4-radius-card)] p-8 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)] sm:p-10`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-page-text)]/10">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="editable-label mt-8 text-[0.72rem] tracking-[0.15em] opacity-75">{card.eyebrow}</p>
                <h3 className="editable-display mt-3 text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.02em]">{card.title}</h3>
                <p className="mt-5 flex-1 text-[0.95rem] leading-[1.55] opacity-85">{card.body}</p>
                <Link href={card.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-bg)] transition group-hover:gap-3">
                  {card.ctaLabel} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── MAGAZINE SPLIT → Dark stats band + process steps ─────────────── */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const totalRecords = Math.max(activity.length * 4, 120)
  const totalFiles = Math.max(activity.filter((p) => categoryOf(p)).length, 40)
  const process = pagesContent.home.process
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section}`}>
        {/* Dark stats band */}
        <EditableReveal index={0} className="rounded-[var(--slot4-radius-card)] bg-[var(--slot4-dark-bg)] px-8 py-16 text-[var(--slot4-dark-text)] sm:px-14 sm:py-20 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <p className="editable-label text-[0.72rem] tracking-[0.15em] text-white/55">{pagesContent.home.trust.eyebrow}</p>
              <h2 className={`${dc.type.sectionTitle} mt-5 text-[var(--slot4-dark-text)]`}>
                {pagesContent.home.trust.title}
              </h2>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-[1.6] text-white/65">{pagesContent.home.trust.description}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { value: totalRecords, label: `${taskDisplayLabel('listing')} records`, Icon: MapPin },
                { value: totalFiles, label: `${taskDisplayLabel('pdf')} files`, Icon: Download },
                { value: '100%', label: 'Verified before publish', Icon: ShieldCheck },
              ].map((stat, i) => (
                <EditableReveal key={stat.label} index={i + 1} className="border-t border-white/15 pt-6">
                  <stat.Icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                  <p className="editable-display mt-6 text-[3rem] font-semibold leading-none tracking-[-0.0225em] text-[var(--slot4-accent)] sm:text-[3.5rem]">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-[1.4] text-white/70">{stat.label}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </EditableReveal>

        {/* Process steps */}
        <div className="mt-24">
          <EditableReveal index={0} className="max-w-2xl">
            <p className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">{process.eyebrow}</p>
            <h2 className={`${dc.type.sectionTitle} mt-5`}>{process.title}</h2>
          </EditableReveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.steps.map((step, i) => (
              <EditableReveal key={step.n} index={i} className="rounded-[var(--slot4-radius-card)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <span className="editable-display text-[3rem] font-semibold leading-none tracking-[-0.0225em] text-[var(--slot4-muted-text)]/40">{step.n}</span>
                <h3 className="editable-display mt-8 text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.55] text-[var(--slot4-muted-text)]">{step.body}</p>
              </EditableReveal>
            ))}
          </div>
        </div>

        {/* Recent activity — real posts */}
        {activity.length ? (
          <div className="mt-24">
            <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">Latest</p>
                <h2 className={`${dc.type.sectionTitle} mt-5`}>Newest in the {taskDisplayLabel(primaryTask).toLowerCase()}.</h2>
              </div>
              <Link href={primaryRoute} className={dc.button.secondary}>
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </EditableReveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activity.slice(0, 6).map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i}>
                  <PostChipCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                </EditableReveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function PostChipCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[var(--slot4-radius-card)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        {category ? <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)] px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">{category}</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editable-display line-clamp-2 text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-[1.55] text-[var(--slot4-muted-text)]">{getExcerpt(post, 130)}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
          View <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

/* ─── TIME COLLECTIONS → dense discovery grids (spotlight / browse / index) ── */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last 7 days' },
  browse: { eyebrow: 'Popular', title: 'Trending across the site' },
  index: { eyebrow: 'From the archive', title: 'Older, but still worth a look' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
          { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
          { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sIdx) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        return (
          <section key={section.key} className="bg-[var(--slot4-page-bg)]">
            <div className={`${dc.shell.section} ${dc.shell.sectionYTight}`}>
              <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="editable-label text-[0.72rem] tracking-[0.15em] text-[var(--slot4-muted-text)]">{copy.eyebrow}</p>
                  <h2 className={`${dc.type.sectionTitle} mt-5`}>{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
              <div className={`mt-12 grid gap-6 ${sIdx % 2 === 0 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                {section.posts.slice(0, sIdx % 2 === 0 ? 8 : 6).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <PostChipCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ─── CTA BAND — full-bleed lime ───────────────────────────────────── */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} pb-24 pt-4`}>
        <EditableReveal index={0} className="grid gap-10 rounded-[var(--slot4-radius-card)] bg-[var(--slot4-accent)] px-8 py-16 text-[var(--slot4-on-accent)] sm:px-14 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:px-24">
          <div>
            <p className="editable-label text-[0.72rem] tracking-[0.15em]">{cta.eyebrow}</p>
            <h2 className={`${dc.type.sectionTitle} mt-5 text-[var(--slot4-on-accent)]`}>{cta.title}</h2>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.55] text-[var(--slot4-on-accent)]/80">{cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href={cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-dark-text)] transition hover:bg-[var(--slot4-surface-bg)] hover:text-[var(--slot4-page-text)]">
              {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-dark-bg)]/25 bg-transparent px-7 py-3.5 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-[var(--slot4-dark-text)]">
              {cta.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
