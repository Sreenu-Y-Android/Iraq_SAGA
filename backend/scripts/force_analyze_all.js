#!/usr/bin/env node
/**
 * force_analyze_all.js
 * Force-analyze ALL fetched content through local Ollama and create alerts.
 *
 *   node scripts/force_analyze_all.js             # all platforms
 *   node scripts/force_analyze_all.js --platform x
 *   node scripts/force_analyze_all.js --skip-existing   # skip content that already has an alert
 *   node scripts/force_analyze_all.js --limit 50        # process only first N items
 *   node scripts/force_analyze_all.js --concurrency 3   # parallel Ollama calls (default 2)
 *
 * Never deletes anything. Safe to re-run multiple times.
 */

require('dotenv').config();
const connectDB = require('../src/config/db');
const mongoose  = require('mongoose');

// ─── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const PLATFORM      = getArg('--platform') || null;
const LIMIT         = parseInt(getArg('--limit') || '0', 10) || 0;
const CONCURRENCY   = parseInt(getArg('--concurrency') || '2', 10) || 2;
const SKIP_EXISTING = args.includes('--skip-existing');

// ─── Models & services ────────────────────────────────────────────────────────
const Content  = require('../src/models/Content');
const Alert    = require('../src/models/Alert');
const Keyword  = require('../src/models/Keyword');
const Settings = require('../src/models/Settings');
const Source   = require('../src/models/Source');
const { performFullAnalysis } = require('../src/services/monitorService');

// ─── Inline keyword matcher (matchConfiguredKeywords is private) ──────────────
const matchKeywords = (text = '', keywords = []) => {
  if (!text || !keywords.length) return [];
  const matched = [];
  const seen = new Set();
  for (const kw of keywords) {
    if (seen.has(kw.id)) continue;
    const keyword = String(kw.keyword || '').trim();
    if (!keyword) continue;
    // Arabic / non-Latin: simple substring
    const isNonLatin = /[؀-ۿఀ-౿ऀ-ॿ]/.test(keyword);
    let isMatch = false;
    if (isNonLatin) {
      isMatch = text.includes(keyword);
    } else {
      const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      isMatch = new RegExp(`(\\b${esc}\\b|#${esc}|@${esc})`, 'i').test(text);
    }
    if (isMatch) {
      seen.add(kw.id);
      matched.push({
        keyword_id: kw.id,
        keyword:    kw.keyword,
        category:   kw.category,
        language:   kw.language,
        weight:     kw.weight || 50,
      });
    }
  }
  return matched;
};

// ─── Semaphore for concurrency control ───────────────────────────────────────
const createSemaphore = (max) => {
  let active = 0;
  const queue = [];
  const next = () => {
    if (queue.length && active < max) {
      active++;
      queue.shift()();
    }
  };
  return (fn) => new Promise((resolve, reject) => {
    queue.push(() => fn().then(resolve).catch(reject).finally(() => { active--; next(); }));
    next();
  });
};

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  IRAQ WATCH · FORCE ANALYZE ALL CONTENT                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  await connectDB();

  // Load shared deps
  const settings = await Settings.findOne({ id: 'global_settings' }).lean();
  if (!settings) { console.error('  ❌  global_settings not found in DB'); process.exit(1); }

  const keywords = await Keyword.find({ is_active: true }).lean();
  console.log(`  Keywords loaded   : ${keywords.length}`);

  // Build content query
  const contentQuery = {};
  if (PLATFORM) contentQuery.platform = PLATFORM;

  const total = await Content.countDocuments(contentQuery);
  console.log(`  Content found     : ${total}  ${PLATFORM ? `(platform: ${PLATFORM})` : '(all platforms)'}`);

  const cursor = Content.find(contentQuery)
    .sort({ created_at: -1 })
    .limit(LIMIT || 0)
    .lean()
    .cursor();

  const sem = createSemaphore(CONCURRENCY);

  let processed = 0, created = 0, skipped = 0, errors = 0;
  const startedAt = Date.now();
  const pending = [];

  for await (const content of cursor) {
    const job = sem(async () => {
      try {
        // Check existing alert
        if (SKIP_EXISTING) {
          const exists = await Alert.exists({ content_id: content.id });
          if (exists) { skipped++; return; }
        }

        // Source category
        const src = content.source_id
          ? await Source.findOne({ id: content.source_id }).select('category').lean()
          : null;

        // Run Ollama analysis
        const analysis = await performFullAnalysis(content, settings, keywords, { skipAlert: true });

        // Keyword matching
        const text = content.text || content.scraped_content || '';
        const matchedKws = matchKeywords(text, keywords);

        // Determine risk & alert type
        let finalRiskLevel = analysis?.content_risk_level || 'low';
        let alertType = 'new_post';

        if (matchedKws.length > 0) {
          alertType = finalRiskLevel === 'low' ? 'keyword_risk' : 'ai_risk';
          if (finalRiskLevel === 'low') finalRiskLevel = 'low'; // keep low but still create
        } else if (finalRiskLevel !== 'low') {
          alertType = 'ai_risk';
        }

        // Fallback matched_keywords so alert passes the $ne:[] filter
        const kwForAlert = matchedKws.length > 0
          ? matchedKws
          : [{ keyword_id: 'iraq-watch', keyword: 'Iraq Watch', category: 'other', language: 'en', weight: 50 }];

        // Title
        const intent = analysis?.intent || 'Monitor';
        const intentStr = !['Neutral','Unknown','Normal','Monitor'].includes(intent) ? `${intent} — ` : '';
        const title = `${finalRiskLevel.toUpperCase()} Risk: ${intentStr}${content.author || 'Unknown'}`;

        const alertData = {
          content_id:    content.id,
          analysis_id:   analysis?.analysis_id || null,
          alert_type:    alertType,
          risk_level:    finalRiskLevel,
          priority:      finalRiskLevel === 'high' || finalRiskLevel === 'critical' ? 'HIGH' : finalRiskLevel === 'medium' ? 'MEDIUM' : 'LOW',
          published_at:  content.published_at || content.created_at || null,
          title,
          description:   analysis?.explanation || analysis?.detailedDescription || text.slice(0, 300),
          threat_details: {
            intent:     analysis?.intent || 'Monitor',
            reasons:    analysis?.reasons   || [],
            highlights: analysis?.highlights || [],
            risk_score: Number(analysis?.risk_score) || 0,
            confidence: Number(analysis?.confidence) || 0,
          },
          violated_policies: analysis?.violated_policies || [],
          legal_sections:    analysis?.legal_sections    || [],
          content_url:   content.content_url  || '',
          platform:      content.platform     || 'x',
          author:        content.author       || '',
          author_handle: content.author_handle || content.author || '',
          source_category: src?.category || null,
          matched_keywords: kwForAlert,
          matched_keywords_normalized: kwForAlert.map(k => k.keyword.toLowerCase()),
          status: 'active',
          is_read: false,
        };

        // Upsert — update existing or create new (never delete)
        await Alert.findOneAndUpdate(
          { content_id: content.id },
          { $set: alertData },
          { upsert: true, new: true }
        );
        created++;

      } catch (err) {
        errors++;
        console.error(`  ⚠  Error on content ${content.id}: ${err.message}`);
      } finally {
        processed++;
        if (processed % 10 === 0) {
          const pct = Math.round((processed / (LIMIT || total)) * 100);
          const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);
          process.stdout.write(`\r  Progress: ${processed}/${LIMIT || total} (${pct}%) — ${created} alerts — ${elapsed}s elapsed   `);
        }
      }
    });
    pending.push(job);
  }

  await Promise.all(pending);
  process.stdout.write('\n');

  const took = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log('\n──────────────────────────────────────────────────────────');
  console.log(`  Content processed : ${processed}`);
  console.log(`  Alerts created    : ${created}`);
  console.log(`  Skipped           : ${skipped}`);
  console.log(`  Errors            : ${errors}`);
  console.log(`  Time              : ${took}s`);
  console.log('──────────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('  Done. Refresh the Alerts Center now.\n');
}

main().catch(err => {
  console.error('\n  FATAL:', err.message);
  process.exit(1);
});
