const fmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' });
const day = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', timeZone: 'Europe/Amsterdam' });
const mon = new Intl.DateTimeFormat('nl-NL', { month: 'short', timeZone: 'Europe/Amsterdam' });
const yr = new Intl.DateTimeFormat('nl-NL', { year: 'numeric', timeZone: 'Europe/Amsterdam' });
const wd = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', timeZone: 'Europe/Amsterdam' });

export const formatDate = (d: Date) => fmt.format(d);
export const dayNum = (d: Date) => day.format(d);
export const monthShort = (d: Date) => mon.format(d).replace('.', '');
export const year = (d: Date) => yr.format(d);
export const weekday = (d: Date) => wd.format(d);

export function formatRange(start: Date, end?: Date) {
  if (!end || end.getTime() === start.getTime()) return `${weekday(start)} ${formatDate(start)}`;
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear())
    return `${dayNum(start)} t/m ${formatDate(end)}`;
  return `${formatDate(start)} t/m ${formatDate(end)}`;
}

/** Een evenement is "komend" tot en met de einddatum. Build-tijd: herbouw de site periodiek (zie README). */
export function isUpcoming(start: Date, end?: Date, now = new Date()) {
  const last = new Date(end ?? start);
  last.setHours(23, 59, 59);
  return last >= now;
}

/** Sorteersleutel: lopende evenementen tellen als 'vandaag'. */
export const eventSortKey = (start: Date, now = new Date()) => Math.max(+start, +now);

export const readingTime = (html: string) => Math.max(2, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 220));
