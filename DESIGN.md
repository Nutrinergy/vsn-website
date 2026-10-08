# DESIGN.md: VSN merk- en designsysteem

Bron van waarheid voor kleuren, typografie en componenten van sportdietetiek.nl. De tokens staan in `src/styles/tokens.css`. De uitgebreide merkgids met logo-gebruik staat in `docs/BRAND-GUIDE.md`.

## 1. Logo
- Bestand: `src/assets/brand/logo-vsn.svg` (origineel, Adobe Illustrator, maart 2026) en `public/favicon.svg` (beeldmerk).
- Opbouw: **beeldmerk** (twee in elkaar grijpende bogen die samen een S vormen: teal boven, oranje onder) + **woordmerk** in drie regels: VERENIGING (light, teal) / SPORTVOEDINGS EXPERTS (black, oranje) / NEDERLAND (light, teal).
- Betekenis: twee bewegingen die elkaar vasthouden. Wetenschap en praktijk, sporter en expert. Ook te lezen als de bocht van een atletiekbaan.
- Vrije ruimte: minimaal de hoogte van de "S" in SPORTVOEDINGS rondom.
- Minimale breedte: 140 px (volledig logo), 24 px (beeldmerk).
- Niet doen: kleuren omdraaien, het woordmerk in een ander font zetten, het logo op drukke foto's plaatsen zonder vlak, de bogen los van elkaar gebruiken als logo.

## 2. Kleur (OKLCH, sRGB-fallback in hex)
Strategie: **committed**. Oranje en teal dragen samen het merk; teal voor vertrouwen en structuur, oranje voor energie en actie.

| Token | OKLCH | Hex | Rol |
|---|---|---|---|
| `--paper` | 0.975 0.008 85 | #F9F6F1 | Pagina-achtergrond (krijtwit, warm) |
| `--paper-2` | 0.945 0.014 80 | #F2ECE3 | Verdiepte vlakken |
| `--ink` | 0.24 0.035 205 | #062427 | Tekst, donkere secties (petrol-zwart) |
| `--ink-2` | 0.40 0.03 205 | #344D4F | Secundaire tekst |
| `--muted` | 0.50 0.025 205 | #53686A | Metadata (min. 5:1 op paper) |
| `--teal` | 0.64 0.103 194.6 | #209F9F | Merkteal (= logo #2EA1A1), grafisch |
| `--teal-deep` | 0.48 0.085 196 | #006C6D | Teal voor tekst en links (5,8:1) |
| `--teal-ink` | 0.32 0.06 200 | #003C3F | Donkere teal vlakken |
| `--teal-tint` | 0.93 0.035 190 | #CEF0ED | Lichte teal vlakken |
| `--orange` | 0.70 0.17 57 | #EB7D00 | Merkoranje (= logo #EF7D00), knoppen met ink-tekst |
| `--orange-deep` | 0.56 0.15 48 | #B85207 | Oranje voor tekst op licht (4,6:1) |
| `--orange-tint` | 0.94 0.04 70 | #FDE7CF | Lichte oranje vlakken |

Regels: nooit puur zwart of wit. Knoppen in merkoranje krijgen **ink-tekst**, geen witte tekst (wit op oranje haalt maar 2,8:1). Alle tekstcombinaties zijn getoetst op WCAG AA.

De oude site gebruikte afwijkende kleuren (#17BEBB en #FC621F uit het Elementor-kit). Die vervallen: alles volgt nu het logo van 2026.

## 3. Typografie
**Archivo** (variabel, Omnibus-Type, SIL Open Font License), self-hosted (`public/fonts/archivo-latin.woff2`, ~90 KB, wght 100–900 en wdth 62–125).
Waarom: de breedte-as maakt het mogelijk om met één familie zowel de brede, zware sportbelettering (rugnummers, stadionborden) als rustige leestekst te zetten. De expanded black sluit aan bij het geometrische woordmerk in het logo.

| Rol | Breedte | Gewicht | Grootte |
|---|---|---|---|
| Display (h1) | 125% | 850 | clamp(2.6rem, 1.4rem + 5.2vw, 6rem), tracking -0.025em |
| Kop 2 | 118% | 800 | clamp(1.9rem, 1.3rem + 2.4vw, 3.2rem) |
| Kop 3 | 110% | 750 | 1.35–1.6rem |
| Label | 112% | 650 | 0.8rem, hoofdletters, tracking 0.08em (spaarzaam) |
| Body | 100% | 400 | 1.125rem / 1.6, max. 68ch |
| Lead | 100% | 420 | clamp(1.2rem, 1rem + 0.6vw, 1.45rem) |

Cijfers in tabellen: `font-variant-numeric: tabular-nums`.

## 4. Merkmotief: de baan
De twee bogen uit het beeldmerk worden groot ingezet als **baanlijnen**: dikke, afgeronde strepen in teal en oranje die over secties heen buigen (component `Arcs.astro`). Ze tekenen zichzelf bij het laden (stroke-animatie, uit bij `prefers-reduced-motion`). Gebruik maximaal één arc-compositie per scherm.

Tweede motief: de **stippenkaart** van Nederland (`NlMap.astro`), waarin elke sportdiëtist een gekleurde stip is.

## 5. Beeld
- Eerste keus: eigen VSN-fotografie (studiedagen 2025, bestuur). Warm, echt, mensen in gesprek.
- Sportbeeld: actie, buitenlicht, geen poserende fitnessmodellen.
- Voedingsbeeld: daglicht, natuurlijke materialen, geen supplementpotten als held.
- Foto's krijgen afgeronde hoeken (`--radius-lg`) of worden uitgesneden in de vorm van een boog.

## 6. Componenten
- **Knop primair**: oranje vlak, ink-tekst, 999px radius, pijl die bij hover 4px verschuift.
- **Knop secundair**: 2px ink-rand, transparant.
- **Indexlijst** (onderwerpen): grote genummerde rijen met pijl in plaats van identieke kaarten.
- **Agenda-item**: datumblok (dag groot, maand klein) + titel + label VSN/extern.
- **Artikel**: leeskolom 68ch, tabellen in `.table-wrap` (horizontaal scrollbaar op mobiel).
- **Focus**: 3px oranje outline met 3px offset, altijd zichtbaar bij toetsenbord.

## 7. Beweging
Ease-out-expo (`cubic-bezier(0.16, 1, 0.3, 1)`), 400–900 ms voor grote onthullingen, 150–200 ms voor hover. Geen bounce. Alles uit bij `prefers-reduced-motion: reduce`.

## 8. Toon
Je-vorm. Korte zinnen. Geen gedachtestreepjes in interfacetekst. Concrete getallen boven bijvoeglijke naamwoorden.
