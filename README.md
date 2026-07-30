# Persona

Статичний сайт-портфоліо на Astro, розгорнутий у Cloudflare Workers Static Assets.

## Локальна розробка

Потрібен Node.js 22.12 або новіший.

```sh
npm install
npm run dev
```

## Перевірка та деплой

```sh
npm run build
npm run preview
npm run deploy
```

Production: [persona.od.ua](https://persona.od.ua)

Cloudflare бере статичні файли з `dist/`. База даних і серверний runtime не використовуються.
