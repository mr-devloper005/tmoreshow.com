import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  displayLabel: string
  displayLabelPlural: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
  emptyTitle: string
  emptyBody: string
  ctaLabel: string
}

/*
  Voice + display labels per task. Display labels are what the user sees
  everywhere in the UI — never the raw task key. Underlying task keys stay
  the same so routes and data fetching keep working.
*/
export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial',
    displayLabel: 'Article',
    displayLabelPlural: 'Articles',
    headline: 'Long-form reads with a calmer editorial pace.',
    description: 'Essays, explainers, and story-led posts written for the community.',
    filterLabel: 'Choose topic',
    secondaryNote: 'Editorial surfaces need space, hierarchy, and few distractions.',
    chips: ['Editorial pace', 'Topic filters', 'Long-read friendly'],
    emptyTitle: 'No stories published yet',
    emptyBody: 'New editorial pieces will appear here as they are published.',
    ctaLabel: 'Read the article',
  },
  classified: {
    eyebrow: 'Notice board',
    displayLabel: 'Notice',
    displayLabelPlural: 'Notices',
    headline: 'Fast-moving offers and time-sensitive posts.',
    description: 'Practical, action-oriented content — quick to scan, easy to reply to.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize urgency, short summaries, and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
    emptyTitle: 'No notices yet',
    emptyBody: 'Fresh notices will appear here once posted.',
    ctaLabel: 'View notice',
  },
  sbm: {
    eyebrow: 'Curated links',
    displayLabel: 'Bookmark',
    displayLabelPlural: 'Bookmarks',
    headline: 'Curated collections of resources and links.',
    description: 'Shelves of useful tools, references, and links worth revisiting.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference'],
    emptyTitle: 'No bookmarks yet',
    emptyBody: 'Curated resources will show up here as they are added.',
    ctaLabel: 'Open bookmark',
  },
  profile: {
    eyebrow: 'People & profiles',
    displayLabel: 'Profile',
    displayLabelPlural: 'Profiles',
    headline: 'Profiles with identity, trust, and reputation cues.',
    description: 'People, brands, and entities — discoverable rather than buried in a feed.',
    filterLabel: 'Filter profile',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Discovery'],
    emptyTitle: 'No profiles listed',
    emptyBody: 'Profiles will appear here as members are added.',
    ctaLabel: 'View profile',
  },
  pdf: {
    eyebrow: 'Reference Library',
    displayLabel: 'Reference file',
    displayLabelPlural: 'Reference Library',
    headline: 'A working reference library — reports, guides, and files.',
    description: 'Downloadable material with proper indexing, previews, and context. Save what you need for later.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Every file is previewed inline and free to download.',
    chips: ['Guides', 'Reports', 'Reference sheets'],
    emptyTitle: 'No files in the library yet',
    emptyBody: 'New reference material will land here as it is added to the library.',
    ctaLabel: 'Open reference',
  },
  listing: {
    eyebrow: 'Local Directory',
    displayLabel: 'Directory record',
    displayLabelPlural: 'Local Directory',
    headline: 'Trusted places and services in the local directory.',
    description: 'Verified records with contact details, hours, and location so you can act — not just browse.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Each record is contactable, checked, and locally sourced.',
    chips: ['Verified', 'Local', 'Contactable'],
    emptyTitle: 'No records in this section yet',
    emptyBody: 'Directory entries will appear here as they are added.',
    ctaLabel: 'View record',
  },
  image: {
    eyebrow: 'Gallery',
    displayLabel: 'Visual',
    displayLabelPlural: 'Gallery',
    headline: 'Image posts with a gallery-first rhythm.',
    description: 'Visual stories, portfolios, and standout imagery.',
    filterLabel: 'Filter category',
    secondaryNote: 'Let images carry the page before text does.',
    chips: ['Visual', 'Gallery', 'Portfolio'],
    emptyTitle: 'No visuals in the gallery yet',
    emptyBody: 'New images and galleries will appear here.',
    ctaLabel: 'View image',
  },
} satisfies Record<TaskKey, TaskPageVoice>

/** Display label for a task — the ONLY thing the user should ever see for a task. */
export function taskDisplayLabel(task: TaskKey): string {
  return taskPageVoices[task]?.displayLabelPlural || task
}

/** Singular display label. */
export function taskDisplayLabelSingular(task: TaskKey): string {
  return taskPageVoices[task]?.displayLabel || task
}
