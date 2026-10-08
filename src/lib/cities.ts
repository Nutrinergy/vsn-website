import people from '../data/sportdietisten.json';

export type Person = (typeof people)[number];
export const citySlug = (c: string) =>
  c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^'s-/, 's-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const toRad = (d: number) => (d * Math.PI) / 180;
export const km = (a: [number, number], b: [number, number]) => {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

export function cityPages() {
  const map = new Map<string, { city: string; pts: [number, number][]; ids: Set<string> }>();
  for (const p of people)
    for (const l of p.locations) {
      const e = map.get(l.city) ?? { city: l.city, pts: [], ids: new Set<string>() };
      e.pts.push([l.lat, l.lng]);
      e.ids.add(p.id);
      map.set(l.city, e);
    }
  return [...map.values()]
    .map((c) => {
      const center: [number, number] = [c.pts.reduce((s, p) => s + p[0], 0) / c.pts.length, c.pts.reduce((s, p) => s + p[1], 0) / c.pts.length];
      const inCity = people.filter((p) => c.ids.has(p.id));
      const ranked = people
        .filter((p) => !c.ids.has(p.id))
        .map((p) => ({ p, d: Math.min(...p.locations.map((l) => km(center, [l.lat, l.lng]))) }))
        .sort((a, b) => a.d - b.d);
      let nearby = ranked.filter((r) => r.d <= 25);
      if (inCity.length + nearby.length < 4) nearby = ranked.slice(0, 4 - inCity.length);
      nearby = nearby.slice(0, 8);
      return { city: c.city, slug: citySlug(c.city), center, inCity: inCity.length, people: inCity, nearby };
    })
    .sort((a, b) => a.city.localeCompare(b.city, 'nl'));
}
