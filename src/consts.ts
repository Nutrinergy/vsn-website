export const SITE = {
  name: 'Vereniging Sportvoedingsexperts Nederland',
  short: 'VSN',
  url: 'https://sportdietetiek.nl',
  tagline: 'Sport verbeteren met voeding',
  description:
    'De Vereniging Sportvoedingsexperts Nederland (VSN) verbindt gecertificeerde sportdiëtisten en sportvoedingsexperts. Vind een sportdiëtist bij jou in de buurt.',
  founded: '2004',
  locale: 'nl_NL',
  lang: 'nl',
  ogImage: '/og/default.jpg',
  email: 'info@sportdietetiek.nl',
  kvk: '09143588',
  city: 'Lewedorp',
};

/**
 * Het ledenportaal (BuddyBoss community, forum, documenten) blijft voorlopig op WordPress.
 * Advies: verhuizen naar een subdomein. Pas deze URL aan zodra dat live staat.
 */
export const MEMBER_PORTAL = 'https://leden.sportdietetiek.nl';
export const MEMBER_LOGIN = `${MEMBER_PORTAL}/login/`;
export const memberProfile = (id: string) => `${MEMBER_PORTAL}/leden/${id}/`;

/**
 * Formulieren. Op Netlify werkt het zonder instelling (Netlify Forms).
 * Op Coolify/eigen server: zet PUBLIC_FORM_ENDPOINT (bijv. een Formspree- of Web3Forms-URL) vóór de build.
 */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';
export const THANKS_URL = `${SITE.url}/bedankt/`;

export const SOCIAL = {
  instagram: 'https://www.instagram.com/sportdietistenvsn/',
  x: 'https://twitter.com/SportdietistNL',
};

export const PARTNERS = {
  mysportscience: 'https://www.mysportscienceacademy.com/premium-annual-landing-vsn',
  medicas: 'https://medicas.net/Betalingsvoorwaarden',
  topsportTopics: 'https://www.topsporttopics.nl/',
  scas: 'https://www.scascertificering.nl/sportdietisten',
  nzvt: 'https://www.dopingautoriteit.nl/nzvt',
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string; note?: string }[] };

export const NAV: NavItem[] = [
  {
    label: 'Voeding en sport',
    href: '/voeding-en-sport/',
    children: [
      { label: 'Sportvoedingspiramide', href: '/sportvoedingspiramide/', note: 'Het fundament van elk advies' },
      { label: 'Basisvoeding', href: '/voeding-en-sport/basisvoeding/' },
      { label: 'Sport', href: '/voeding-en-sport/sport/' },
      { label: 'Voeding en herstel', href: '/voeding-en-sport/voeding-en-herstel/' },
      { label: 'Supplementen', href: '/voeding-en-sport/supplementen/' },
      { label: 'Maatwerk', href: '/voeding-en-sport/maatwerk/' },
      { label: 'Recepten', href: '/voeding-en-sport/recepten/' },
    ],
  },
  { label: 'Kennisbank', href: '/kennisbank/' },
  { label: 'Wat doet een sportdiëtist?', href: '/sportdietist/' },
  { label: 'Agenda', href: '/agenda/' },
  {
    label: 'Over de VSN',
    href: '/over-ons/',
    children: [
      { label: 'Over ons', href: '/over-ons/' },
      { label: 'Lid worden', href: '/lid-worden/' },
      { label: 'Veelgestelde vragen', href: '/veelgestelde-vragen/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

export const KENNISBANK_CATEGORIES: Record<string, { label: string; intro: string }> = {
  basisvoeding: {
    label: 'Basisvoeding',
    intro: 'De onderste laag van de sportvoedingspiramide: koolhydraten, eiwitten, vetten en plantaardig eten.',
  },
  sport: {
    label: 'Sport',
    intro: 'Voeding rond training en wedstrijd: eiwitspreiding, herstel en timing.',
  },
  recepten: {
    label: 'Recepten',
    intro: 'Smakelijke, voedzame recepten voor sporters, berekend door sportdiëtisten.',
  },
};
