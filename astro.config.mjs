import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://haileyho.github.io',
  base: '/designer-builder-blog',
  integrations: [mdx()],
});
