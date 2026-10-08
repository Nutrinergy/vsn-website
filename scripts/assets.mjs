// Genereert Open Graph-afbeeldingen (1200x630) en app-iconen. Draait automatisch vóór `npm run build`.
import sharp from 'sharp';
import { readFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public', 'og');
await mkdir(out, { recursive: true });

const logo = await readFile(path.join(root, 'src/assets/brand/logo-vsn.svg'));
const mark = await readFile(path.join(root, 'public/favicon.svg'));
const W = 1200, H = 630;

const logoPng = await sharp(logo, { density: 300 }).resize({ width: 330 }).png().toBuffer();
const logoMeta = await sharp(logoPng).metadata();
const badge = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${logoMeta.width + 64}" height="${logoMeta.height + 48}"><rect width="100%" height="100%" rx="28" fill="#F9F6F1"/></svg>`);
const badgePng = await sharp(badge).composite([{ input: logoPng, left: 32, top: 24 }]).png().toBuffer();
const arcs = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="380" viewBox="-20 -20 176 224"><path d="M100.8 41.1 A48 48 0 1 0 36.5 111.3" stroke="#209F9F" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M35.2 142.9 A48 48 0 1 0 99.5 72.7" stroke="#EB7D00" stroke-width="30" fill="none" stroke-linecap="round"/></svg>`);
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="1" x2="0.6" y2="0"><stop offset="0" stop-color="#062427" stop-opacity="0.55"/><stop offset="0.6" stop-color="#062427" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);

async function og(src, name, position = 'centre') {
  const img = await sharp(path.join(root, src)).resize(W, H, { fit: 'cover', position }).toBuffer();
  await sharp(img)
    .composite([
      { input: shade, left: 0, top: 0 },
      { input: await sharp(arcs).resize({ width: 190 }).png().toBuffer(), left: W - 190 - 40, top: 34 },
      { input: badgePng, left: 40, top: H - (logoMeta.height + 48) - 40 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, `${name}.jpg`));
}

await og('src/assets/foto/studiedag-vraag.jpg', 'default', 'attention');

// Piramide: illustratie op krijtwit vlak
{
  const pyr = await sharp(path.join(root, 'src/assets/foto/sportvoedingspiramide.jpg')).resize({ height: 560 }).toBuffer();
  const pm = await sharp(pyr).metadata();
  await sharp({ create: { width: W, height: H, channels: 3, background: '#F9F6F1' } })
    .composite([
      { input: pyr, left: W - pm.width - 40, top: 35 },
      { input: badgePng, left: 56, top: Math.round(H / 2 - (logoMeta.height + 48) / 2) },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(out, 'sportvoedingspiramide.jpg'));
}

const parse = async (dir) => {
  const files = await readdir(path.join(root, dir));
  const res = [];
  for (const f of files.filter((f) => f.endsWith('.md'))) {
    const txt = await readFile(path.join(root, dir, f), 'utf8');
    const m = /image:\s*"([^"]+)"/.exec(txt);
    if (m) res.push({ id: f.replace(/\.md$/, ''), image: path.join(dir, m[1]) });
  }
  return res;
};
for (const p of await parse('src/content/kennisbank')) await og(p.image, `kennisbank-${p.id}`, 'attention');
for (const p of await parse('src/content/onderwerpen')) await og(p.image, `onderwerp-${p.id}`, 'attention');

// Iconen
const iconBg = (size, pad) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" rx="${size * 0.22}" fill="#F9F6F1"/></svg>`);
async function icon(size, file, pad = 0.16, rounded = true) {
  const inner = Math.round(size * (1 - pad * 2));
  const m = await sharp(mark, { density: 600 }).resize({ height: inner }).png().toBuffer();
  const mm = await sharp(m).metadata();
  const base = rounded ? sharp(iconBg(size)) : sharp({ create: { width: size, height: size, channels: 4, background: '#F9F6F1' } });
  await base.composite([{ input: m, left: Math.round((size - mm.width) / 2), top: Math.round((size - mm.height) / 2) }]).png().toFile(path.join(root, 'public', file));
}
await icon(32, 'favicon-32.png', 0.08, false);
await icon(180, 'apple-touch-icon.png', 0.14, false);
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');
await icon(512, 'icon-maskable-512.png', 0.24, false);
console.log('OG-afbeeldingen en iconen gegenereerd in public/');
