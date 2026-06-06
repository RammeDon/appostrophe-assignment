# appostrophe-assignment

A desktop web prototype of the SCRL canvas: a scrollable, zoomable workspace where users can upload photos and move, resize, and rotate them with handles.

Built with **React**, **TypeScript**, and **Vite**.

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (20+ recommended)
- [pnpm](https://pnpm.io/) (recommended) — or use `npm` / `yarn` with equivalent commands

## Getting started

Clone the repository and install dependencies:

```bash
git clone <https://github.com/RammeDon/appostrophe-assignment.git>
cd appostrophe-assignment
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the URL shown in the terminal ([http://localhost:5173](http://localhost:5173)).

## Available scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Vite dev server with hot module replacement |
| `pnpm build` | Type-check with TypeScript, then build for production (`dist/`) |
| `pnpm preview` | Serve the production build locally (run `pnpm build` first) |
| `pnpm lint` | Run ESLint across the project |


## Tech stack

- **React 19** — UI
- **TypeScript** — static typing
- **Vite** — dev server and production bundler
- **ESLint** — linting

## Production build

```bash
pnpm build
```

Output is written to `dist/`. Deploy that folder to any static host, or preview it locally:

```bash
pnpm preview
```

## License

Private — technical assignment.
