# sportdietetiek.nl, nieuwe website VSN

Statische website (Astro 5) voor de Vereniging Sportvoedingsexperts Nederland. Snel, toegankelijk en SEO-first. Het ledenportaal (community, forum, documenten) blijft op WordPress, op een eigen subdomein.

- **Audit van de oude site:** [docs/AUDIT.md](docs/AUDIT.md)
- **Merkgids:** [docs/BRAND-GUIDE.md](docs/BRAND-GUIDE.md) · tokens in [DESIGN.md](DESIGN.md)
- **Doelgroepen en toon:** [PRODUCT.md](PRODUCT.md)

## Starten

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genereert OG-afbeeldingen/iconen en bouwt naar dist/ (119 pagina's)
npm run preview    # bekijk de productiebuild op http://localhost:4321
python3 scripts/qa.py dist   # controle op links, titels, meta, H1, JSON-LD, alt-teksten
```

Vereist Node 20 of hoger.

## Structuur

| Pad | Inhoud |
|---|---|
| `src/pages/` | Alle pagina's. `sportdietist/[plaats].astro` maakt 62 lokale landingspagina's. |
| `src/content/kennisbank/` | Artikelen (Markdown + frontmatter). Nieuw artikel = nieuw `.md`-bestand. |
| `src/content/agenda/` | Evenementen. Komend/archief wordt bij elke build bepaald op datum. |
| `src/content/onderwerpen/` | De zes pagina's onder "Voeding en sport". |
| `src/data/sportdietisten.json` | 63 sportdiëtisten met locaties en expertise (afkomstig van de oude kaart). |
| `src/data/faq.ts` | Veelgestelde vragen (voedt ook FAQPage-schema). |
| `src/consts.ts` | Naam, e-mail, KvK, links, navigatie, URL van het ledenportaal. |
| `src/lib/schema.ts` | JSON-LD (Organization, Article, Event, FAQ, breadcrumbs). |
| `public/_redirects`, `deploy/nginx-redirects.conf` | 301-redirects van oude WordPress-URL's. |
| `scripts/assets.mjs` | Maakt OG-afbeeldingen (1200×630) en app-iconen. Draait vóór elke build. |

## Inhoud bijwerken

**Artikel toevoegen:** maak `src/content/kennisbank/<slug>.md`, kopieer de frontmatter van een bestaand artikel, plaats de afbeelding in `src/assets/kennisbank/`. Categorieën: `basisvoeding`, `sport`, `recepten` (uitbreiden in `src/consts.ts` en `src/content.config.ts`).

**Evenement toevoegen:** maak `src/content/agenda/<slug>.md` met `title`, `path`, `start`, `mode`, `organizer`, `summary`. Zet `membersOnly: true` voor ledenevenementen.

**Sportdiëtist toevoegen of wijzigen:** pas `src/data/sportdietisten.json` aan (naam, `id` uit de profiel-URL, locaties met lat/lng, expertise). Op termijn koppelen aan een export uit het ledensysteem (zie "Volgende stappen").

Na elke wijziging opnieuw bouwen en deployen. Omdat "komend" en "archief" op de buildtijd rusten, plant een nachtelijke build (bijvoorbeeld een Netlify build hook met een cron-trigger).

## Deployen

Netlify en Cloudflare Pages werken zonder aanpassingen (`netlify.toml` en `public/_redirects` staan klaar, inclusief security-headers en CSP). Voor eigen hosting: lever `dist/` uit via nginx en neem `deploy/nginx-redirects.conf` op in het server-blok.

### Livegang in vier stappen

1. **Ledenportaal verhuizen.** Verplaats de huidige WordPress/BuddyBoss-installatie naar `leden.sportdietetiek.nl`. Zet daar `noindex`, schakel Yoast-sitemaps uit en pas in WordPress de site-URL aan. Controleer dat inloggen, forum en documenten werken.
2. **Nieuwe site live op `sportdietetiek.nl`.** Zet DNS om en controleer de redirects met een handvol oude URL's (`/onze-dietisten/`, `/kennisbank/sport/herstel-na-inspanning/`, `/groepen/`).
3. **Search Console.** Voeg het domein toe, dien `https://sportdietetiek.nl/sitemap-index.xml` in en verwijder de oude sitemaps. Doe hetzelfde in Bing Webmaster Tools. Gebruik "Wijziging van adres" niet (domein blijft gelijk).
4. **Formulieren testen.** Verstuur een testaanmelding en een contactbericht en stel in Netlify (Forms → Notifications) de ontvanger `info@sportdietetiek.nl` in.

## Wat jullie nog moeten aanleveren of beslissen

- [ ] **Hosting en domeinbeheer:** waar komt de nieuwe site te staan (Netlify, Cloudflare Pages of eigen server)?
- [ ] **Subdomein voor het ledenportaal:** `leden.sportdietetiek.nl` aanmaken. Staat al in `src/consts.ts` als `MEMBER_PORTAL`.
- [ ] **Inhoudelijke toetsing** door de werkgroep website van de punten in AUDIT.md §4 (kleine tekstaanpassingen aan artikelen).
- [ ] **Analytics:** de oude site laadde GA4 zonder toestemming. De nieuwe site laadt niets. Kies bij behoefte cookieloze analytics (Plausible, Simple Analytics, Fathom).
- [ ] **Beeld:** meer eigen foto's (zie BRAND-GUIDE §6). Nu staan er 5 studiedagfoto's en 4 bestuursportretten.
- [ ] **Instagram-feed:** bewust niet overgenomen (extra scripts, trage laadtijd). Gelinkt vanuit de footer.
- [ ] **Controle sportdiëtisten-data:** `sportdietisten.json` komt uit de oude kaart (oktober 2026). Eén persoon is aangemerkt als "niet beschikbaar voor afspraken" (Kiira Zomerschoe); laat de leden hun gegevens nalopen.

## Volgende stappen (aanbevolen)

1. Sportdiëtistendata automatisch uit het ledensysteem (Sportzorg) of WordPress laten komen via een nachtelijke export.
2. Per sportdiëtist een eigen profielpagina op de nieuwe site (Person-schema, foto, specialisaties), zodat de plaatspagina's niet naar het ledenportaal hoeven te verwijzen.
3. Maandelijks een kennisbankartikel op basis van de zoekwoordkansen in AUDIT.md §3.
4. Zoekfunctie over de kennisbank (Pagefind past op een statische site).
5. Engelstalige versie voor internationale leden en congresdeelnemers.

## Techniek in het kort

- **Astro 5** (statisch, 0 kB framework-JS), content collections met schema-validatie, `astro:assets` voor responsieve WebP.
- **Lettertype Archivo** self-hosted, met een metrisch afgestemde fallback tegen layout shift.
- **Kaart:** Leaflet met PDOK BRT-achtergrondkaart (Kadaster, gratis, geen API-sleutel); zoeken op plaats/postcode via de PDOK Locatieserver. Leaflet laadt pas als de kaart in beeld komt.
- **Prestaties (Lighthouse mobiel, lokaal):** performance 98–100, toegankelijkheid 100, best practices 100, SEO 100.
- **SEO:** unieke title en description per pagina, canonicals, Open Graph per artikel, JSON-LD, sitemap, `llms.txt`, 301-redirectmap, correcte `lang="nl"`.
- **Privacy:** geen cookies, geen trackers, geen externe lettertypen. Extern: PDOK-kaarttegels en -zoekdienst (alleen op de zoekpagina), vermeld in de privacyverklaring.
