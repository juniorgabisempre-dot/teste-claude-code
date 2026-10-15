# Estudos Claude

Projeto de estudos usando Next.js 16 (App Router), React 19, TypeScript e TailwindCSS 4.

## Stack

- **Next.js 16** — App Router
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- ESLint (flat config)

## Getting Started

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

- `npm run dev` — servidor local
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — ESLint
- `npm run type-check` — checagem de tipos (`tsc --noEmit`)

## Estrutura

```
app/            rotas (App Router)
  layout.tsx
  page.tsx
  globals.css
```

Ainda não existem `components/`, `lib/`, `types/` ou `actions/` — serão criados conforme a primeira feature precisar, seguindo as convenções em `CLAUDE.md`.

## Convenções

Ver [`CLAUDE.md`](./CLAUDE.md) para arquitetura, code style e workflow do projeto.
