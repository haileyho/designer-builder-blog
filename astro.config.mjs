import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import path from 'node:path';

function localSavePlugin() {
  return {
    name: 'local-save-api',
    configureServer(server) {
      server.middlewares.use('/api/save-post', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { filename, content } = JSON.parse(body);
            if (!filename || !content) throw new Error('Missing filename or content');
            const safe = path.basename(filename);
            const filePath = path.resolve('src/content/posts', safe);
            fs.writeFileSync(filePath, content, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, path: filePath }));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  site: 'https://haileyho.github.io',
  base: '/designer-builder-blog',
  integrations: [mdx()],
  vite: { plugins: [localSavePlugin()] },
});
