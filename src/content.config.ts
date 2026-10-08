import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const kennisbank = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kennisbank' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(170),
      category: z.enum(['basisvoeding', 'sport', 'recepten']),
      author: z.string(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      image: image(),
      imageAlt: z.string(),
    }),
});

const agenda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/agenda' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string().optional(),
    mode: z.enum(['online', 'locatie']),
    organizer: z.enum(['vsn', 'extern']),
    membersOnly: z.boolean().default(false),
    link: z.string().url().optional(),
    summary: z.string(),
    published: z.coerce.date(),
  }),
});

const onderwerpen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/onderwerpen' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string(),
      description: z.string().max(170),
      order: z.number(),
      kicker: z.string(),
      teaser: z.string(),
      intro: z.string(),
      pullquote: z.string().optional(),
      image: image(),
      imageAlt: z.string(),
      related: z.array(z.string()).default([]),
      layer: z.enum(['basis', 'sportspecifiek', 'supplementen', 'alle']).optional(),
    }),
});

export const collections = { kennisbank, agenda, onderwerpen };
