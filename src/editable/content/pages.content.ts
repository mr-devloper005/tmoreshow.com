import { slot4BrandConfig } from '@/editable/theme/brand.config'

const brandName = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'Local Directory & Reference Library',
      description: `${brandName} — a working local directory plus an open reference library. Find trusted places, download useful guides, and act on what you find.`,
      openGraphTitle: `${brandName} — Directory + Reference Library`,
      openGraphDescription: 'One place for the businesses you visit and the papers you consult.',
      keywords: ['local directory', 'reference library', 'business directory', 'downloadable guides', 'community resources', brandName],
    },
    hero: {
      badge: `Welcome to ${brandName}`,
      title: ['A local directory —', 'and an open reference library.'],
      accentWord: 'directory',
      description: 'Find trusted places, read a verified profile, or download the report you actually need. All in one calm, searchable place.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search places, guides, categories…',
      stats: [
        { value: 'Verified', label: 'Local records' },
        { value: 'Free', label: 'Reference downloads' },
        { value: 'Daily', label: 'Directory updates' },
      ],
    },
    tagline: {
      eyebrow: 'What you can do here',
      title: 'Two utilities. One clean surface.',
      description: 'Skip the noisy feeds. Look something up, save it for later, and get on with your day.',
      cards: [
        {
          key: 'directory',
          tone: 'lime',
          eyebrow: 'Local Directory',
          title: 'Trusted places, cleanly listed.',
          body: 'Verified records with contact details, hours, and clear location — every entry is checked before it is published.',
          href: '/listing',
          ctaLabel: 'Explore records',
        },
        {
          key: 'library',
          tone: 'mint',
          eyebrow: 'Reference Library',
          title: 'Guides, reports, and reference files.',
          body: 'Downloadable material with proper indexing and inline preview — never a login gate, never a paywall.',
          href: '/pdf',
          ctaLabel: 'Open the library',
        },
        {
          key: 'search',
          tone: 'pink',
          eyebrow: 'Search everything',
          title: 'One search, both surfaces.',
          body: 'A single search bar covers the entire directory and library — no bouncing between tabs.',
          href: '/search',
          ctaLabel: 'Start searching',
        },
      ],
    },
    intro: {
      badge: 'What you can do here',
      title: 'Two utilities. One clean surface.',
      paragraphs: [
        'Skip the noisy feeds. Look something up, save it for later, and get on with your day.',
        `${brandName} keeps the directory and library on one calm surface — search once, act fast.`,
      ],
    },
    process: {
      eyebrow: 'How it works',
      title: 'A quiet workflow — look up, save, act.',
      steps: [
        { n: '01', title: 'Search or browse', body: 'Filter by category, or type what you need into the search bar.' },
        { n: '02', title: 'Read the record', body: 'Every entry shows the details you need to decide — nothing you don\'t.' },
        { n: '03', title: 'Save or download', body: 'Bookmark a place, download a guide, or contact directly from the page.' },
        { n: '04', title: 'Come back later', body: 'The library and directory are updated regularly — check back for what\'s new.' },
      ],
    },
    trust: {
      eyebrow: 'By the numbers',
      title: 'A useful surface, kept up to date.',
      description: 'Real records, real files — kept current by editors and the community.',
    },
    cta: {
      eyebrow: 'Start here',
      title: 'One place for the places you visit and the papers you keep.',
      description: 'Open the directory, browse the library, or search across both.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
    },
  },
  about: {
    badge: `About ${brandName}`,
    title: `Why ${brandName} is a directory and a library — nothing else.`,
    description: `${brandName} does two things well: it lists trusted local places, and it hosts a working reference library. That's it. No feed, no ads-first mess.`,
    paragraphs: [
      `${brandName} started because looking something up online had become slower than it needed to be. A local directory should just tell you the phone number, the hours, and whether the business is real. A reference library should let you download the file, without ten redirects.`,
      'We keep this site small on purpose. Every record in the directory is checked before it is published, and every file in the library is either public-domain or shared with permission. The layout is quiet because the content should carry the page.',
      'If a place is missing, or a guide should be here, contact us and we will look at adding it. The site improves in small, useful ways — not in loud redesigns.',
    ],
    values: [
      { title: 'Directory first', description: 'Local, verifiable, contactable records — not a scraped list.' },
      { title: 'Free reference', description: 'Downloadable guides and reports with no login gate.' },
      { title: 'Quiet by design', description: 'One search bar, two clean surfaces. Nothing else in the way.' },
      { title: 'Kept current', description: 'Editors and the community keep entries and files up to date.' },
    ],
  },
  contact: {
    eyebrow: `Contact ${brandName}`,
    title: 'Add a place. Suggest a file. Fix a record.',
    description: 'Tell us what should be in the directory or the library — or what is wrong with an existing entry. We read every message.',
    formTitle: 'Send a message',
    channels: [
      { title: 'Add a place to the directory', body: 'Send the business name, address, phone, and website. We check details before publishing.' },
      { title: 'Suggest a file for the library', body: 'Share a link or attach the file — public-domain, community, or reference material welcome.' },
      { title: 'Fix a record', body: 'Spotted an outdated phone number, or a broken download? Point us at it.' },
    ],
  },
  search: {
    metadata: {
      title: 'Search the directory and library',
      description: `Search every record in the ${brandName} directory and every file in the reference library.`,
    },
    hero: {
      badge: 'Search across both surfaces',
      title: 'One search — directory and library.',
      description: 'Type a place name, a category, a file title, or a topic. Results come from both the directory and the library.',
      placeholder: 'Search places, categories, files…',
    },
    resultsTitle: 'Latest across the site',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Submit a directory record or a reference file.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description: 'Members can submit new directory records and add reference files to the library. Sign in first to open the submission workspace.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Add to the directory or the library.',
      description: 'Fill in the details for a new record or upload a file. Submissions go through a quick review before publication.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Submitted for review',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to ${brandName}.`,
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to save records, upload new files, and manage your submissions.',
      formTitle: 'Sign in',
      submitLabel: 'Sign in',
      noAccount: 'No account matched those details. Create an account first.',
      success: 'Signed in — redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create an account on ${brandName}.`,
      badge: 'Get started',
      title: 'Create your account.',
      description: 'Save records, upload files, and take part in keeping the directory and library up to date.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account ready — redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: { relatedTitle: 'Related reads', fallbackTitle: 'Article' },
    listing: { relatedTitle: 'More from the directory', fallbackTitle: 'Directory record' },
    image: { relatedTitle: 'From the gallery', fallbackTitle: 'Visual' },
    profile: { relatedTitle: 'Suggested profiles', fallbackDescription: 'Profile details will appear here once available.', visitButton: 'Visit official site' },
  },
} as const
