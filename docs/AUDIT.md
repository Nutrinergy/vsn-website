# Audit sportdietetiek.nl

**Organisatie:** Vereniging Sportvoedingsexperts Nederland (VSN)
**Datum audit:** 8 oktober 2026
**Methode:** volledige crawl van alle 102 URL's uit de Yoast-sitemaps, broncode-analyse van elke pagina, Lighthouse 12 (mobiel, lokaal Chrome), header- en redirectcontrole, extractie van Elementor-tokens en het logo, en handmatige UX- en contentreview.

---

## 1. Samenvatting

De huidige site draait op WordPress met het BuddyBoss-thema, Elementor Pro en zo'n tien plug-ins. Hij combineert drie dingen die eigenlijk niet bij elkaar horen: een publieke merksite, een ledencommunity (forum, groepen, documenten) en een sportdiëtistenkaart. Het resultaat is traag, rommelig voor zoekmachines en onduidelijk voor de twee belangrijkste doelgroepen: sporters die een sportdiëtist zoeken en professionals die lid willen worden.

| Onderdeel | Score | Toelichting |
|---|---|---|
| Techniek en indexatie | 🔴 3/10 | Canonicals naar stagingdomein, loginpagina's in de sitemap, testpagina's geïndexeerd |
| Snelheid (mobiel) | 🔴 3/10 | LCP 17,6 s op de homepage, 3,3 MB per pagina, ~115 scripts |
| On-page SEO | 🟠 4/10 | 83% zonder meta description, dubbele titels, H1-fouten |
| Content en E-E-A-T | 🟠 5/10 | Goede basis, maar verouderd (alle artikelen nov. 2022), inconsistente naam |
| UX en conversie | 🟠 4/10 | Geen zoekfunctie op plaats, kaart zonder lijst, geen duidelijke route per doelgroep |
| Merk en design | 🟠 4/10 | Websitekleuren wijken af van het nieuwe logo, drie lettertypes |
| Toegankelijkheid | 🟠 6/10 | Contrastproblemen, 105 van 108 afbeeldingen zonder alt op de kaartpagina |
| Privacy en security | 🔴 3/10 | Google Analytics zonder toestemming, geen security-headers, openbare API-sleutel |

### Top 5 prioriteiten
1. **Canonicals naar `vh2015sjmhg-0.hosting-space.nl`** op 13 pagina's: Google wordt verteld dat het stagingdomein de echte versie is.
2. **Mobiele laadtijd**: LCP 17,6 s en Lighthouse-performance 60. Google gebruikt Core Web Vitals als rankingfactor en mobiele bezoekers haken af.
3. **Index-vervuiling**: 14 forum-URL's die doorsturen naar de WordPress-login, plus `/services/` (lorem ipsum met dollarprijzen) en `/stijl/` (testpagina) staan in de sitemap.
4. **Geen goede zoekfunctie voor sporters**: de belangrijkste taak ("vind een sportdiëtist bij mij in de buurt") is een Google Maps-kaart zonder zoekveld, lijst, filters of H1.
5. **Google Analytics zonder toestemming**: GA4 (`G-6PQ79BZBH1`) laadt op 88 pagina's zonder cookiebanner. Dat is in strijd met de AVG/Telecommunicatiewet (Autoriteit Persoonsgegevens).

### Quick wins (op de oude site, binnen een dag)
- Canonicals corrigeren (Yoast → per bericht canonical leegmaken of zoeken/vervangen in de database).
- `/services/` en `/stijl/` verwijderen of `noindex`; topic- en reply-sitemap uitschakelen in Yoast.
- Meta descriptions schrijven voor de 10 belangrijkste pagina's.
- Google Maps API-sleutel beperken tot HTTP-referrer `sportdietetiek.nl/*`.
- GA4 uitzetten tot er een consentoplossing is.

---

## 2. Technische SEO

### 2.1 Crawlbaarheid en indexatie

| Bevinding | Impact | Bewijs | Oplossing |
|---|---|---|---|
| **Canonicals naar stagingdomein** | Hoog | 13 pagina's (o.a. `/agenda/vsn/eetstoornissen-en-verstoord-eetgedrag/`, `/agenda/vsn-masterclass/`, `/forums/`) hebben `<link rel="canonical" href="https://vh2015sjmhg-0.hosting-space.nl/...">` | Self-referencing canonicals. **Opgelost in nieuwe site.** |
| **Loginmuur-URL's in sitemap** | Hoog | `topic-sitemap.xml` en `reply-sitemap.xml` bevatten 14 forum-URL's die 302 doorsturen naar `wp-login.php` (titel "Login ‹ … — WordPress") | Community-URL's uit de sitemap en uit de index. **Opgelost:** forum verhuist naar `leden.sportdietetiek.nl`. |
| **Testpagina's geïndexeerd** | Hoog | `/services/` bevat lorem ipsum en prijzen in dollars ("$120 for 60 min Initial session"), `/stijl/` is een thema-stijltest met "Heading 1" | Verwijderen + 301. **Opgelost.** |
| **App-pagina's indexeerbaar** | Middel | `/dashboard/`, `/register/`, `/activate/`, `/blogpost-maken/`, `/agenda-item-maken/`, `/news-feed/`, `/fotos/`, `/videos/`, `/documenten/`, `/leden/` staan in de page-sitemap | Hoort bij het ledenportaal, niet bij de publieke site. **Opgelost** via redirects. |
| **Dubbele content** | Middel | `/onze-dietisten/` en `/zoek-een-sport-dietist-in-de-buurt/` tonen dezelfde kaart; categorie-archieven dupliceren de kennisbank | Eén zoekpagina, categoriepagina's met eigen intro. **Opgelost.** |
| **Robots.txt** | Laag | `Disallow:` (alles toegestaan), verwijst naar sitemap-index | Prima. Nieuwe site sluit alleen `/bedankt/` uit. |
| **Redirects** | OK | http → https en www → non-www werken met één 301 | Behouden bij de verhuizing. |

### 2.2 Snelheid en Core Web Vitals (Lighthouse 12, mobiel)

| Meting | Homepage oud | Artikel oud | Homepage nieuw | Artikel nieuw |
|---|---|---|---|---|
| Performance-score | **60** | **66** | **98** | **99** |
| First Contentful Paint | 5,5 s | 5,2 s | 1,1 s | 1,1 s |
| Largest Contentful Paint | **17,6 s** | 5,8 s | **2,5 s** | 2,0 s |
| Speed Index | 6,0 s | 5,2 s | 1,1 s | 1,1 s |
| Totale paginagrootte | **3.276 KiB** | 2.265 KiB | **253 KiB** | 138 KiB |
| Render-blocking besparing | 4,15 s | 4,0 s | 0 | 0,15 s |
| Ongebruikte JavaScript | 517 KiB | 452 KiB | 0 | 0 |
| Ongebruikte CSS | 402 KiB | 402 KiB | 0 | 0 |

Oorzaken op de oude site:
- **~115 `<script>`-tags en ~60 stylesheets per pagina** (BuddyBoss Platform + Pro, Elementor + Pro, JetEngine, JetFormBuilder, Spotlight Instagram-feed, Dynamic Visibility, jQuery, Font Awesome in vier varianten, Dashicons).
- HTML van 140–245 KB per pagina.
- Hero-foto's als JPEG van 2560 px (490 KB) zonder WebP/AVIF en zonder `srcset`.
- Geen `Cache-Control` op HTML, wel serverside cache (`x-cache-status: MISS` bij eerste hit).

### 2.3 Security en privacy

| Bevinding | Risico | Oplossing |
|---|---|---|
| **GA4 zonder toestemming** op 88 pagina's, geen cookiebanner | AVG-boete, reputatie | Nieuwe site plaatst geen tracking. Advies: Plausible of Simple Analytics (cookieloos), of GA4 met consent mode. |
| **Google Maps API-sleutel in de HTML** (`AIzaSyBraZBl…`) | Misbruik op jullie rekening | Sleutel beperken tot referrer. Nieuwe site gebruikt PDOK (Kadaster), zonder sleutel. |
| Geen HSTS, CSP, X-Frame-Options, Referrer-Policy | Clickjacking, downgrade | **Opgelost** in `netlify.toml`. |
| `x-powered-by: PHP/8.2.34` en `PleskLin` zichtbaar | Informatielek | Headers verwijderen op de server. |
| Openbare ledenprofielen tonen "Actief 3 uren geleden" | Privacy van leden | Activiteitsstatus verbergen voor niet-ingelogde bezoekers. |
| Privacyverklaring noemt "Vereniging Sportdiëtetiek Nederland" en geanonimiseerde GA | Klopt niet met de praktijk | **Bijgewerkt** in de nieuwe site. |

### 2.4 Gestructureerde data

Yoast levert een basisgrafiek (WebPage, WebSite, Organization, BreadcrumbList, Article). Wat ontbreekt:
- **Event-schema** voor de agenda: evenementen staan nu als `Article`, waardoor ze nooit als event-rich-result verschijnen.
- **FAQPage** op de FAQ-pagina.
- Organization zonder `sameAs`, e-mail, adres, oprichtingsjaar of KvK.
- Geen `Person`/`ItemList` voor de sportdiëtisten.

**Opgelost:** de nieuwe site levert Organization (met oprichters, KvK, contactpunt, sameAs), WebSite, WebPage/CollectionPage/AboutPage/ContactPage, BreadcrumbList op elke pagina, Article met auteur, Event (komende evenementen), FAQPage (FAQ, sportdiëtist, lid worden, plaatspagina's) en ItemList met Person + PostalAddress voor de sportdiëtisten.

---

## 3. On-page SEO

| Bevinding | Omvang | Voorbeeld |
|---|---|---|
| Geen meta description | **85 van 102** pagina's | Alle agenda-items, 5 van 6 artikelen, contact, sportvoedingspiramide (deels) |
| Titels met generieke opbouw | Alle pagina's | `Home - Vereniging Sportvoedingsexperts Nederland`: het belangrijkste zoekwoord "sportdiëtist" ontbreekt |
| Dubbele titels | 6 groepen | 3× "Online Basisworkshop (W)EET WAT JE DOET", 2× "VSN studiedag", 2× "VSN masterclass" |
| Meerdere H1's | 21 pagina's (7 publiek + 14 forum-loginpagina's) | `/kennisbank/` (2), `/agenda/` (2), `/blogpost-maken/` (3) |
| Geen H1 | 3 pagina's | **`/zoek-een-sport-dietist-in-de-buurt/`**, de belangrijkste landingspagina |
| Afbeeldingen zonder alt | Honderden | Kaartpagina 105 van 108, homepage 6 van 11 |
| Kale bestandsnamen | Overal | `IMG_6957-kopie-scaled.jpg`, `20251106_VSNstudiedag_33-Verbeterd-NR-kopie` |
| Geen lokale landingspagina's | Gemist | Er is geen pagina voor "sportdiëtist Utrecht", "sportdiëtist Amsterdam", enzovoort |

**Zoekwoordkansen** (intentie → pagina in de nieuwe site):
- *sportdiëtist / sportdiëtist in de buurt* → `/zoek-een-sport-dietist-in-de-buurt/` en homepage
- *sportdiëtist [plaats]* → **62 nieuwe plaatspagina's** `/sportdietist/[plaats]/` met de sportdiëtisten in en rond die plaats
- *wat doet een sportdiëtist / verschil diëtist sportdiëtist* → `/sportdietist/` met FAQPage
- *sportvoedingspiramide* → `/sportvoedingspiramide/` (interactief)
- *eiwit na het sporten / herstel na inspanning / koolhydraten sporters* → kennisbank en onderwerppagina's
- *supplementen sporters / NZVT* → `/voeding-en-sport/supplementen/`

---

## 4. Content en E-E-A-T

**Sterk:** echte expertise (artikelen van sportdiëtisten met concrete getallen), eigen sportvoedingspiramide, SCAS-kwaliteitsborging, echte foto's van de studiedag 2025, testimonials van leden.

**Zwak:**
1. **Inconsistente naam.** In titels "Vereniging Sportvoedingsexperts Nederland", in de meta description en OG "Vereniging Sportdiëtetiek Nederland … een jonge vereniging", in de footer "© 2026, Vereniging Sportdietetiek Nederland", in agenda-items "Vereniging Sportdietisten Nederland". Dat verwart Google's Knowledge Graph en bezoekers.
2. **Verouderd.** Alle zes kennisbankartikelen zijn van november 2022. De agenda mengt evenementen uit 2022–2026 zonder onderscheid tussen komend en archief.
3. **Auteurschap onduidelijk.** Elk artikel staat op naam van "VSN redactie", terwijl de eerste zin zegt "Deze blog is geschreven door Vera Wisse". Google ziet de echte auteur dus niet.
4. **Inhoudelijke punten voor de werkgroep website** (in de nieuwe site voorzichtig herschreven, graag laten toetsen):
   - *Basisvoeding:* "Meestal kun je het al ruiken als iemand te weinig koolhydraten eet (ammoniakgeur)" is weggelaten; het is niet goed onderbouwd.
   - *Basisvoeding:* "Het is niet bewezen dat je meer spiermassa ontwikkelt als je meer eiwitten eet dan aanbevolen" is genuanceerd tot "sporters hebben meer eiwit nodig, maar méér is niet automatisch beter".
   - *Supplementen:* "Producten van de NZVT-lijst zijn gegarandeerd dopingvrij" is aangepast naar "gecontroleerd op dopinggeduchte stoffen"; de Dopingautoriteit spreekt zelf niet van een garantie.
   - *Recepten:* de tekst "Voor ieder wat wils" ging over bijscholing van leden, niet over recepten. Die is verwijderd.
   - Kleine taalfouten gecorrigeerd ("bevind zich", "Wordt ik dik", "hertel", "her zijn", "je beoefend").
5. **Contactpagina zonder e-mailadres.** `info@sportdietetiek.nl` stond alleen in de privacyverklaring.

---

## 5. UX, design en conversie

| Probleem | Effect | Nieuwe site |
|---|---|---|
| Homepage-hero is een foto met de verenigingsnaam als tekstbalk, zonder actie | Sporters weten niet waar ze moeten beginnen | Hero met tagline + **direct een zoekveld op plaats of postcode** |
| Twee doelgroepen door elkaar | Sporters landen op ledenvoordelen | Vaste "twee deuren" (sporter / professional) op elke pagina |
| Kaart zonder lijst, zoekveld of filter | Op mobiel onbruikbaar | Lijst + kaart, zoeken op plaats/postcode (PDOK), "Mijn locatie", filters op expertise, afstand per sportdiëtist, lijst/kaart-wissel op mobiel |
| Lege of halve blokken ("VSN op Instagram", "Volg je ons al?" met alleen Twitter) | Onaf indruk | Verwijderd; social links in de footer |
| Testimonials in een slider | Wordt overgeslagen | Drie quotes tegelijk zichtbaar |
| Agenda zonder datumhiërarchie | Verouderde items bovenaan | Komend vs. archief per jaar, filter VSN/extern, "loopt nu"-label, Event-schema |
| Navigatie met dubbele menu's (drie keer hetzelfde in de HTML) | Verwarrend voor schermlezers | Eén hoofdmenu, toegankelijke dropdowns, mobiel menu |
| Formulieren via JetFormBuilder, contactpagina zonder alternatief | Drempel | Korte formulieren met labels, honeypot, privacy-akkoord, plus e-mailadres |

---

## 6. Merk en design

- **Logo 2026** (`Logo-VSN-FC-2026.svg`) is sterk: twee in elkaar grijpende bogen (teal `#2EA1A1` en oranje `#EF7D00`) vormen een S, met een woordmerk in drie regels.
- **De website volgt het logo niet.** Het Elementor-kit gebruikt `#17BEBB` (feller cyaan) en `#FC621F` (roder oranje), plus `#232323` en losse blauwtinten (`#007CFF`, `#122B46` uit BuddyBoss).
- **Drie lettertypes** (Roboto, Open Sans, DM Sans) zonder systeem; koppen in `text-transform: capitalize`.
- Stockfoto's (Pexels) domineren; de sterke eigen studiedagfoto's staan klein in kaarten.

Zie **`docs/BRAND-GUIDE.md`** voor de volledige merkgids die uit de site en het logo is afgeleid.

---

## 7. Toegankelijkheid

- Lighthouse oud: 91 (homepage), met fouten op kleurcontrast, link-namen (lege links rond kaartafbeeldingen) en koppenvolgorde.
- Wit op `#FC621F` (oranje knoppen) haalt maar ca. 3:1; normale tekst vraagt 4,5:1.
- Nieuw: **100** op home, zoekpagina en over ons. Alle kleurcombinaties zijn getoetst op WCAG AA, met een skip-link, zichtbare focusstijl, toetsenbordbediening van menu, dropdowns en piramide (tabs-patroon met pijltjestoetsen), `prefers-reduced-motion` en formulieren met echte labels.

---

## 8. Actieplan

### Kritiek (vóór of bij livegang)
1. Nieuwe site live zetten op `sportdietetiek.nl` met de redirects uit `public/_redirects` (of `deploy/nginx-redirects.conf`).
2. WordPress/BuddyBoss verhuizen naar **`leden.sportdietetiek.nl`**, dat subdomein op `noindex` zetten en Yoast-sitemaps daar uitschakelen.
3. Formulier-afhandeling activeren (Netlify Forms staat klaar) en testen.
4. Nieuwe sitemap indienen in Google Search Console en Bing Webmaster Tools; oude sitemap verwijderen.

### Hoge impact (eerste maand)
5. Werkgroep website laat de inhoudelijke aanpassingen uit §4 toetsen.
6. Ledenprofielen aanvullen (praktijkadres, expertise), want dat voedt de kaart en de 62 plaatspagina's.
7. Kennisbank uitbreiden: 1 artikel per maand op zoekwoorden met volume (eiwit na sporten, carboloading marathon, creatine, RED-S, sportvoeding kinderen, hydratatie).
8. Auteurpagina's met korte bio en SCAS-status voor schrijvende leden.

### Lange termijn
9. De sportdiëtistendata via een API of nachtelijke export uit het ledensysteem laten komen, in plaats van een JSON-bestand.
10. Cookieloze analytics (Plausible/Simple Analytics) en maandelijkse rapportage van zoekopdrachten op de zoekpagina.
11. Linkbuilding via HAN, HvA, NOC*NSF, sportbonden en de Dopingautoriteit (verwijzingen naar "vind een sportdiëtist").
