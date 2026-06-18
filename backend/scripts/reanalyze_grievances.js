#!/usr/bin/env node
/**
 * reanalyze_grievances.js
 * Re-runs the full LLM analysis pipeline on grievances, overwriting stale
 * results (e.g. the old "Analysis failed: ... 'aliases'" errors).
 *
 * Reuses grievanceService.analyzeGrievanceContent so the persisted fields
 * stay identical to the live ingestion path.
 *
 * Uses DB connection from .env (MONGODB_URI + DB_NAME), matching src/config/db.js.
 *
 * Usage:
 *   node scripts/reanalyze_grievances.js                 # re-analyze ALL active grievances
 *   node scripts/reanalyze_grievances.js --failed-only   # only failed / never-analyzed ones
 *   node scripts/reanalyze_grievances.js --concurrency=3 # parallel workers (default 2)
 *   node scripts/reanalyze_grievances.js --limit=10      # cap how many to process
 *   node scripts/reanalyze_grievances.js --dry-run       # list what would run, no LLM calls
 */

require('dotenv').config();
const mongoose = require('mongoose');

const argVal = (name, def) => {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : def;
};
const FAILED_ONLY  = process.argv.includes('--failed-only');
const DRY_RUN      = process.argv.includes('--dry-run');
const CONCURRENCY  = Math.max(1, parseInt(argVal('concurrency', '2'), 10) || 2);
const LIMIT        = parseInt(argVal('limit', '0'), 10) || 0;

async function main() {
  const dbUri  = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME ? String(process.env.DB_NAME).trim() : undefined;

  await mongoose.connect(dbUri, dbName ? { dbName } : undefined);

  // Require AFTER connect so the model registers on this connection.
  const Grievance = require('../src/models/Grievance');
  const { analyzeGrievanceContent } = require('../src/services/grievanceService');

  const query = { is_active: true };
  if (FAILED_ONLY) {
    query.$or = [
      { 'analysis.analyzed_at': { $exists: false } },
      { 'analysis.analyzed_at': null },
      { 'analysis.explanation': { $regex: 'Analysis failed', $options: 'i' } },
    ];
  }

  let grievances = await Grievance.find(query)
    .select('id platform content.text content.full_text')
    .sort({ post_date: -1 })
    .lean();

  if (LIMIT > 0) grievances = grievances.slice(0, LIMIT);

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  RE-ANALYZE GRIEVANCES                                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`  Database     : ${dbName || '(from URI)'}`);
  console.log(`  Scope        : ${FAILED_ONLY ? 'failed / never-analyzed' : 'ALL active'}`);
  console.log(`  To process   : ${grievances.length}`);
  console.log(`  Concurrency  : ${CONCURRENCY}`);
  if (DRY_RUN) console.log('  MODE         : DRY RUN — no analysis will run');
  console.log('');

  if (DRY_RUN) {
    grievances.forEach((g, i) =>
      console.log(`  ${String(i + 1).padStart(3)}. [${g.platform}] ${g.id}  "${String(g.content?.text || '').slice(0, 60).replace(/\s+/g, ' ')}"`)
    );
    await mongoose.disconnect();
    return;
  }

  let done = 0, ok = 0, skipped = 0, failed = 0;
  const startedAt = Date.now();

  // Simple worker pool over the queue.
  const queue = grievances.slice();
  async function worker(workerId) {
    while (queue.length) {
      const g = queue.shift();
      const text = g.content?.full_text || g.content?.text || '';
      const n = ++done;
      if (!text.trim()) {
        skipped++;
        console.log(`  [${n}/${grievances.length}] SKIP (empty) ${g.id}`);
        continue;
      }
      try {
        await analyzeGrievanceContent(g.id, text, g.platform || 'x');
        ok++;
        console.log(`  [${n}/${grievances.length}] OK   ${g.id}`);
      } catch (err) {
        failed++;
        console.log(`  [${n}/${grievances.length}] FAIL ${g.id}: ${err.message}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, (_, i) => worker(i + 1))
  );

  const secs = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('\n──────────────────────────────────────────────────────────');
  console.log(`  Processed : ${done}`);
  console.log(`  Success   : ${ok}`);
  console.log(`  Skipped   : ${skipped}  (empty text)`);
  console.log(`  Failed    : ${failed}`);
  console.log(`  Elapsed   : ${secs}s`);
  console.log('──────────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('  Done.\n');
}

main().catch(err => {
  console.error('\n  FATAL:', err.message);
  process.exit(1);
});
