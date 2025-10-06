#!/usr/bin/env node
/**
 * Sortera docs/legacy/UNSORTED enligt regler:
 * - v3 (och uppåt) => docs/current/
 * - *example* => docs/legacy/examples/
 * - prototyper/demos (dashboard, first iteration, .tsx/.html) => docs/legacy/prototypes/
 * - status/sammanfattning/rekommendationer => docs/legacy/notes/
 * - annars stannar i UNSORTED
 *
 * --apply flyttar filer. Utan flagga skrivs bara MOVE_REVIEW.* för granskning.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, 'docs');
const legacyDir = path.join(docsDir, 'legacy');
const unsortedDir = path.join(legacyDir, 'UNSORTED');
const reviewDir = path.join(docsDir, 'intake');

const apply = process.argv.includes('--apply');

function ensureDirs() {
  return Promise.all([
    fs.mkdir(path.join(legacyDir, 'examples'), { recursive: true }),
    fs.mkdir(path.join(legacyDir, 'prototypes'), { recursive: true }),
    fs.mkdir(path.join(legacyDir, 'notes'), { recursive: true }),
    fs.mkdir(reviewDir, { recursive: true }),
  ]);
}

function parseVersionMajor(name) {
  const m = name.match(/\b(v|version)[-_\s]?([0-9]+)(?:\.[0-9]+)*\b/i) || name.match(/\bv([0-9]+)(?:\.[0-9]+)*\b/i);
  if (!m) return null;
  const v = parseInt(m[2] || m[1]?.replace(/^[vV]/, ''), 10);
  return Number.isFinite(v) ? v : null;
}

function classify(name) {
  const lower = name.toLowerCase();
  const versionMajor = parseVersionMajor(name);
  const isExample = /example/.test(lower);
  const isPrototype = /prototype|first[\s_-]?iteration|dashboard/.test(lower) || /\.(tsx|html?)$/i.test(name);
  const isNote = /status|session|summary|recommendations|rekommendation|log|notes/.test(lower);
  const isSpecOrArch = /spec|specification|product-spec|tech-arch|architecture|instructions|instruktion/.test(lower);

  if (versionMajor !== null && versionMajor >= 3 && !isExample && !isPrototype) {
    return { dest: path.join('docs', 'current', name), confidence: 'high', reason: 'version>=3' };
  }
  if (isExample) {
    return { dest: path.join('docs', 'legacy', 'examples', name), confidence: 'medium', reason: 'example' };
  }
  if (isPrototype) {
    return { dest: path.join('docs', 'legacy', 'prototypes', name), confidence: 'medium', reason: 'prototype' };
  }
  if (isNote) {
    return { dest: path.join('docs', 'legacy', 'notes', name), confidence: 'medium', reason: 'note' };
  }
  // Heuristik: om det är en spec/arkitektur men utan version, lämna i UNSORTED (manuell koll)
  if (isSpecOrArch) {
    return { dest: path.join('docs', 'legacy', 'UNSORTED', name), confidence: 'low', reason: 'spec-unknown-version' };
  }
  return { dest: path.join('docs', 'legacy', 'UNSORTED', name), confidence: 'low', reason: 'fallback' };
}

async function main() {
  await ensureDirs();
  const entries = await fs.readdir(unsortedDir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile()).map(e => e.name);

  const rows = files.map(name => {
    const { dest, confidence, reason } = classify(name);
    return { name, from: path.join('docs', 'legacy', 'UNSORTED', name), to: dest, confidence, reason };
  });

  // Skriv review
  const md = [
    '# Move Review',
    '',
    ...rows.map(r => `- ${r.name} → ${r.to} (${r.confidence}; ${r.reason})`),
    '',
  ].join('\n');
  const csv = [
    'file,from,to,confidence,reason',
    ...rows.map(r => `${JSON.stringify(r.name)},${JSON.stringify(r.from)},${JSON.stringify(r.to)},${r.confidence},${r.reason}`),
  ].join('\n');
  await fs.writeFile(path.join(reviewDir, 'MOVE_REVIEW.md'), md, 'utf8');
  await fs.writeFile(path.join(reviewDir, 'MOVE_REVIEW.csv'), csv, 'utf8');

  if (!apply) {
    console.log('Dry-run klar: se docs/intake/MOVE_REVIEW.*');
    return;
  }

  // Apply moves
  for (const r of rows) {
    const src = path.join(projectRoot, r.from);
    const dest = path.join(projectRoot, r.to);
    if (src === dest) continue;
    await fs.mkdir(path.dirname(dest), { recursive: true });
    try {
      await fs.rename(src, dest);
      console.log(`Flyttad: ${r.from} → ${r.to}`);
    } catch (e) {
      console.error(`Misslyckades flytta ${r.from} → ${r.to}: ${e.message}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
