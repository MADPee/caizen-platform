#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs');

const prettyName = (p) => p.replace(/_/g, ' ').replace(/-/g, ' ');

async function listFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => !n.startsWith('.') && n !== '.gitkeep');
  } catch {
    return [];
  }
}

async function listDirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

async function buildIndex() {
  const now = new Date().toISOString();
  const sections = [];

  // Current
  const currentDir = path.join(docsDir, 'current');
  const currentFiles = (await listFiles(currentDir)).sort();
  sections.push(`### Aktuell dokumentation (docs/current)
${currentFiles.length ? currentFiles.map(f => `- [${f}](/docs/current/${encodeURIComponent(f)})`).join('\n') : '- (tom)'}
`);

  // Backend
  const backendDir = path.join(docsDir, 'backend');
  const backendFiles = (await listFiles(backendDir)).sort();
  sections.push(`### Backend strategi & guider (docs/backend)
${backendFiles.length ? backendFiles.map(f => `- [${f}](/docs/backend/${encodeURIComponent(f)})`).join('\n') : '- (tom)'}
`);

  // Legacy overview (one level)
  const legacyDir = path.join(docsDir, 'legacy');
  const legacyGroups = (await listDirs(legacyDir)).sort();
  const legacyLines = [];
  for (const g of legacyGroups) {
    const files = await listFiles(path.join(legacyDir, g));
    legacyLines.push(`- ${g} (${files.length} filer)`);
  }
  sections.push(`### Legacy (docs/legacy)
${legacyLines.length ? legacyLines.join('\n') : '- (tom)'}
`);

  // Intake status
  const intakeDir = path.join(docsDir, 'intake');
  const intakeFiles = await listFiles(intakeDir);
  const reviewLinks = ['CLASSIFY_REVIEW.md', 'IMPORT_REPORT.json', 'MOVE_REPORT.json']
    .filter(name => intakeFiles.includes(name))
    .map(name => `- [${name}](/docs/intake/${encodeURIComponent(name)})`)
    .join('\n');
  sections.push(`### Intake (docs/intake)
${reviewLinks || '- (tom)'}
`);

  const content = `# CaiZen Docs Index

Senast uppdaterad: ${now}

${sections.join('\n')}
---
Uppdatera indexet:

- Kör: \`npm run docs:index\`
- Script: \`scripts/update-docs-index.mjs\`
- Regler: listar docs/current, docs/backend, grupperar docs/legacy, och länkar intake-rapporter.
`;

  await fs.writeFile(path.join(docsDir, 'INDEX.md'), content, 'utf8');
}

buildIndex().catch(async (err) => {
  console.error('Failed to build docs index:', err);
  process.exit(1);
});
