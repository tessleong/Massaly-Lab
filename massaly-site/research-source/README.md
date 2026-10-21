# Interactive research section

Editable source for the section mounted beneath the Our Research heading divider.

- `src/App.tsx`: diagrams, research text, tooltips, scrolling, and interactions.
- `src/index.css`: original component styles.
- `build-site.mjs`: locally scoped CSS and transparent website integration overrides.

From this directory, run `pnpm install --frozen-lockfile`, then `node build-site.mjs`
to rebuild the website assets in `../public`. Run `pnpm exec tsc --noEmit` to type-check.
The original standalone export remains in the workspace's `research-project` folder.
