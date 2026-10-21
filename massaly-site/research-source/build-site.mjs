import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { build } from 'vite';
import { fileURLToPath } from 'node:url';
await build({configFile: fileURLToPath(new URL('./vite.site.config.ts', import.meta.url))});
const css = (await readFile(new URL('./src/index.css', import.meta.url), 'utf8'))
.replace('@import "tailwindcss";', '').replace(':root {', ':scope {')
.replace(/\nhtml \{[^}]*\}/, '').replace(/\nbody \{[^}]*\}/, '');
const overrides = `
:scope { --paper: #fff; --soft: transparent; background: transparent; color: inherit; font-family: inherit; }
.projects, .project-visual, .visual-panel, .accuracy-note { background: transparent; }
.project-visual { padding-left: 0; padding-right: 2vw; }
.project-stories { padding-right: 0; padding-left: 3vw; }
.visual-panel { border: 0; padding-left: 0; padding-right: 0; }
.accuracy-note { padding-left: 0; padding-right: 0; }
.mobile-project-visual { display: none; }
@media (max-width: 980px) {
.project-visual { display: none; }
.mobile-project-visual { display: block; position: relative; height: 55vh; min-height: 340px; margin-bottom: 28px; }
.project-story { padding: 30px 0; }
.project-story { min-height: 65vh; }
}
@media (max-width: 650px) {
.project-visual { height: 52vh; }
.visual-head { font-size: 10px; letter-spacing: .08em; gap: 12px; }
.project-story h3 { font-size: 34px; }
}
`;
await writeFile(new URL('../public/research-interactive.css', import.meta.url), '@scope (#research-interactive) {\n' + css + overrides + '\n}\n');
for (const name of ['mouse-brain-reference-pink.png', 'mouse-brain-reference.jpeg']) await copyFile(new URL('./public/' + name, import.meta.url), new URL('../public/' + name, import.meta.url));
