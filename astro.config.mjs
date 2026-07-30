import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://persona.od.ua',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fi', 'uk', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
