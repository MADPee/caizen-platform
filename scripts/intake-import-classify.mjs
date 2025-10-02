#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const projectRoot = path.resolve(__dirname, '..');

const downloadsDefault = '/Users/marcusanderssondipace/Downloads';
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const dirArg = args.find(a => a.startsWith('--dir='));
const sourceDir = dirArg ? dirArg.replace('--dir=','') : downloadsDefault;

const docsDir = path.join(projectRoot, 'docs');
const intakeDir = path.join(docsDir, 'intake');
const backendDir = path.join(docsDir, 'backend');
const currentDir = path.join(docsDir, 'current');
const legacyUnsortedDir = path.join(docsDir, 'legacy', 'UNSORTED');

const orgPattern = /^(org[\._-]?caizen|caizen[\._-]?org)/i;
const legacyKeywords = [/\bv0(\.[0-9]+)*\b/i, /\bv1(\.[0-9]+)*\b/i, /prototype/i, /draft/i];
const currentKeywords = [/\bv2(\.[0-9]+)*\b/i, /guide/i, /installation/i, /architecture/i, /security/i, /strategy/i, /nhost/i, /supabase/i];

async function ensureDirs() {
  for (const d of [intakeDir, backendDir, currentDir, legacyUnsortedDir]) {
    await fs.mkdir(d, { recursive: true });
  }
}

function detectOrigin(name) {
  if (orgPattern.test(name) || name.toLowerCase().includes('claude')) return 'claude-artefact';
  if (name.toLowerCase().includes('caizen')) return 'caizen';
  return 'unknown';
}

function suggestPath(name) {
  const k_legacy = legacyKeywords.some(k => k.test(name));
  const k_current = currentKeywords.some(k => k.test(name));
  if (k_current && !k_legacy) {
    if (/(strategy|migration|branch|nhost|supabase)/i.test(name)) return { path: path.join('docs','backend',name), conf: 'medium' };
    return { path: path.join('docs','current',name), conf: 'medium' };
  }
  if (k_legacy && !k_current) return { path: path.join('docs','legacy','UNSORTED',name), conf: 'medium' };
  if (detectOrigin(name)==='claude-artefact') return { path: path.join('docs','legacy','UNSORTED',name), conf: 'low' };
  return { path: path.join('docs','current',name), conf: 'low' };
}

async function importAndClassify() {
  await ensureDirs();
  const srcEntries = await fs.readdir(sourceDir, { withFileTypes: true });
  const files = srcEntries.filter(e=>e.isFile()).map(e=>e.name);
  const imported = [];
  for (const name of files) {
    if (!/caizen|org\.?caizen|claude/i.test(name)) continue;
    const src = path.join(sourceDir, name);
    const dest = path.join(intakeDir, name);
    try {
      await fs.copyFile(src, dest);
      imported.push(name);
    } catch {}
  }
  // classify
  const intakeFiles = (await fs.readdir(intakeDir)).filter(n => !n.startsWith('.') && !['IMPORT_REPORT.json','CLASSIFY_REVIEW.csv','CLASSIFY_REVIEW.md','MOVE_REPORT.json'].includes(n));
  const rows = [];
  for (const name of intakeFiles) {
    const s = suggestPath(name);
    rows.push({ file: name, suggested: s.path, confidence: s.conf });
  }
  // write review
  await fs.writeFile(path.join(intakeDir,'CLASSIFY_REVIEW.md'), '# Intake Classification Review\n\n' + rows.map(r=>`- ${r.file} → ${r.suggested} (${r.confidence})`).join('\n') + '\n', 'utf8');
  // apply
  if (apply) {
    for (const r of rows) {
      const from = path.join(intakeDir, r.file);
      const to = path.join(projectRoot, r.suggested);
      await fs.mkdir(path.dirname(to), { recursive: true });
      try { await fs.rename(from, to); } catch {}
    }
  }
}

importAndClassify().catch(e=>{ console.error(e); process.exit(1) });
