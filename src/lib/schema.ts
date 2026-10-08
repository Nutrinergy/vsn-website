import { SITE, SOCIAL } from '../consts';

const abs = (p: string) => new URL(p, SITE.url).toString();
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: ['VSN', 'Vereniging Sportdiëtetiek Nederland'],
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: abs('/logo-vsn.svg'), caption: SITE.name },
    image: abs(SITE.ogImage),
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.email,
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressRegion: 'Zeeland', addressCountry: 'NL' },
    identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: SITE.kvk },
    contactPoint: { '@type': 'ContactPoint', contactType: 'secretariaat', email: SITE.email, availableLanguage: ['nl'] },
    foundingDate: SITE.founded,
    founders: ['Anja van Geel', 'Geertje Becker', 'Joris Hermans'].map((name) => ({ '@type': 'Person', name })),
    areaServed: { '@type': 'Country', name: 'Nederland' },
    knowsAbout: ['Sportvoeding', 'Sportdiëtetiek', 'Sportvoedingspiramide', 'Voeding en herstel', 'Supplementen'],
    sameAs: [SOCIAL.instagram, SOCIAL.x],
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    alternateName: 'VSN',
    description: SITE.tagline,
    inLanguage: 'nl-NL',
    publisher: { '@id': ORG_ID },
  };
}

export type Crumb = { name: string; href: string };
export function breadcrumbs(items: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

export function webPage(opts: { path: string; title: string; description: string; type?: string }) {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${abs(opts.path)}#webpage`,
    url: abs(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'nl-NL',
  };
}

export function article(opts: {
  path: string;
  title: string;
  description: string;
  author: string;
  published: Date;
  updated?: Date;
  image: string;
  section: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${abs(opts.path)}#article`,
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: abs(opts.path),
    image: [abs(opts.image)],
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    author: { '@type': 'Person', name: opts.author, jobTitle: 'Sportdiëtist', memberOf: { '@id': ORG_ID } },
    publisher: { '@id': ORG_ID },
    articleSection: opts.section,
    inLanguage: 'nl-NL',
  };
}

export function event(opts: {
  path: string;
  title: string;
  description: string;
  start: Date;
  end?: Date;
  mode: 'online' | 'locatie';
  location?: string;
  organizer: 'vsn' | 'extern';
  link?: string;
  image?: string;
}) {
  const online = opts.mode === 'online';
  return {
    '@type': 'Event',
    name: opts.title,
    description: opts.description,
    startDate: opts.start.toISOString().slice(0, 10),
    endDate: (opts.end ?? opts.start).toISOString().slice(0, 10),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: online
      ? { '@type': 'VirtualLocation', url: opts.link ?? abs(opts.path) }
      : { '@type': 'Place', name: opts.location ?? 'Nederland', address: opts.location ?? 'Nederland' },
    url: abs(opts.path),
    ...(opts.image ? { image: [abs(opts.image)] } : {}),
    organizer:
      opts.organizer === 'vsn'
        ? { '@id': ORG_ID }
        : { '@type': 'Organization', name: 'Externe organisator', url: opts.link ?? abs(opts.path) },
    inLanguage: 'nl-NL',
  };
}

export function faq(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
