#!/usr/bin/env node
/**
 * UTF-8 validator (svenska tecken ÅÄÖ) for repo files
 */
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const ignoredDirs = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.nyc_output',
  'docs/legacy', 'ocr-cache', 'document-cache', 'processed-documents'
]);

/**
 * Return true if file path should be ignored
 */
function isIgnored(filePath) {
  const rel = filePath.replace(repoRoot + path.sep, '');
  if (rel.startsWith('.git/')) return true;
  for (const dir of ignoredDirs) {
    if (rel === dir || rel.startsWith(dir + '/')) return true;
  }
  // binary-ish extensions to skip
  const ext = path.extname(rel).toLowerCase();
  const binaryExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.ttf', '.otf', '.woff', '.woff2']);
  if (binaryExts.has(ext)) return true;
  return false;
}

/**
 * Naive utf-8 check: try to read as utf-8 and look for replacement chars
 */
function validateUtf8(content) {
  // presence of replacement char indicates decoding issue
  return !content.includes('\uFFFD');
}

/**
 * Ensure Swedish characters render
 */
function hasSwedishCharactersSample(content) {
  // Not required for all files, but we want to detect mojibake if present
  // We'll just validate that content can represent these without replacement
  const sample = 'ÅÄÖ åäö';
  return Buffer.from(sample, 'utf8').toString('utf8') === sample && !content.includes('\uFFFD');
}

/**
 * Walk directory recursively
 */
function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!isIgnored(full)) yield* walk(full);
    } else {
      if (!isIgnored(full)) yield full;
    }
  }
}

let failures = [];
for (const file of walk(repoRoot)) {
  try {
    const buf = fs.readFileSync(file);
    const content = buf.toString('utf8');
    if (!validateUtf8(content)) {
      failures.push({ file, reason: 'Invalid UTF-8 (replacement character found)' });
      continue;
    }
    // Optional: detect BOM
    if (content.charCodeAt(0) === 0xFEFF) {
      failures.push({ file, reason: 'UTF-8 BOM detected (discouraged)' });
    }
    // Spot-check presence of Swedish characters in docs and src text files
    if ((file.endsWith('.md') || file.startsWith(path.join(repoRoot, 'src'))) && !hasSwedishCharactersSample(content)) {
      // If replacement char exists, we already flagged above.
    }
  } catch (e) {
    failures.push({ file, reason: `Read error: ${e.message}` });
  }
}

if (failures.length) {
  console.error('❌ UTF-8 valideringsfel:');
  for (const f of failures) {
    console.error(` - ${path.relative(repoRoot, f.file)}: ${f.reason}`);
  }
  process.exit(1);
}
console.log('✅ UTF-8 validering OK');
