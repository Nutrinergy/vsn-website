import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import people from '../data/sportdietisten.json';

// llms.txt: een beknopte, machineleesbare samenvatting voor AI-zoekmachines (zie llmstxt.org).
export const GET: APIRoute = async () => {
  const posts = await getCollection('kennisbank');
  const topics = (await getCollection('onderwerpen')).sort((a, b) => a.data.order - b.data.order);
  const u = (p: string) => new URL(p, SITE.url).toString();
  const body = `# ${SITE.name} (VSN)

> ${SITE.description} Opgericht in ${SITE.founded}. ${people.length} sportdiëtisten staan op de landelijke kaart.

De VSN is de Nederlandse beroepsvereniging voor sportdiëtisten (post-HBO Sportdiëtetiek) en sportvoedingsexperts (universitaire voedingsachtergrond plus IOC-diploma of master Sports Nutrition). Leden mogen zich sportdiëtist-VSN® noemen; kwaliteit wordt geborgd via het SCAS-register. De VSN ontwikkelde de sportvoedingspiramide: basisvoeding, sportspecifieke voeding, supplementen.

## Voor sporters
- [Zoek een sportdiëtist in de buurt](${u('/zoek-een-sport-dietist-in-de-buurt/')}): zoeken op plaats of postcode, filter op expertise
- [Wat doet een sportdiëtist?](${u('/sportdietist/')})
- [De VSN sportvoedingspiramide](${u('/sportvoedingspiramide/')})
${topics.map((t) => `- [${t.data.title}](${u(`/voeding-en-sport/${t.id}/`)}): ${t.data.description}`).join('\n')}

## Kennisbank
${posts.map((p) => `- [${p.data.title}](${u(`/kennisbank/${p.data.category}/${p.id}/`)}): ${p.data.description}`).join('\n')}

## Vereniging
- [Over de VSN](${u('/over-ons/')})
- [Lid worden](${u('/lid-worden/')})
- [Agenda](${u('/agenda/')})
- [Veelgestelde vragen](${u('/veelgestelde-vragen/')})
- [Contact](${u('/contact/')}): ${SITE.email}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
