# Interactive Research Project Page

Imported from the Figma Make code ZIP on October 15, 2026.

Source: https://www.figma.com/make/vjFdwf2J2fNpqNLFHXgmnU/Interactive-Research-Project-Page

## Local development

Requires Node.js 22.12+ and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 5173
```

Open http://127.0.0.1:5173. Local changes update the preview automatically.

```sh
pnpm build
pnpm exec tsc --noEmit
```

The research interface is in `src/App.tsx`; its styles are in `src/index.css`.
Brain image assets are in `public/`. The original export and its Figma configuration
are preserved. This local copy does not automatically synchronize with Figma Make.
The existing website lives separately in `../massaly-site`.
