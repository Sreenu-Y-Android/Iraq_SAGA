#!/usr/bin/env node
/**
 * seed_iraq_keywords.js
 * Seeds the full Iraq SAGA keyword database (2026).
 *
 * Covers 12 tiers:
 *   T1  National Leadership          weight 100
 *   T2  Major Political Figures      weight  90
 *   T3  Political Parties            weight  80
 *   T4  Security & Militias          weight  85
 *   T5  Terrorism / ISIS             weight  95  category: threat
 *   T6  Iran / Israel / USA War      weight  80
 *   T7  Oil & Economy                weight  60
 *   T8  Public Sentiment             weight  70
 *   T9  Religious Influencers        weight  70
 *   T10 Provinces & Cities           weight  55
 *   T11 Arabic Keywords              weight  90  language: ar
 *   T12 Current Hot Topics (2026)    weight  90
 *
 * Run:
 *   node scripts/seed_iraq_keywords.js
 *   node scripts/seed_iraq_keywords.js --dry-run   # preview without writing
 *   node scripts/seed_iraq_keywords.js --replace   # wipe existing + re-insert
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

const DRY_RUN  = process.argv.includes('--dry-run');
const REPLACE  = process.argv.includes('--replace');

// ─── Use the real Keyword model so DB_NAME env var is respected ───────────────
const Keyword = require('../src/models/Keyword');

// ─── Keyword definitions ───────────────────────────────────────────────────────

const K = (keyword, weight, category = 'other', language = 'en') =>
  ({ keyword, weight, category, language, is_active: true });

const KEYWORDS = [

  // ══════════════════════════════════════════════════════
  // TIER 1 — NATIONAL LEADERSHIP  (weight 100)
  // ══════════════════════════════════════════════════════
  K('Ali al Zaidi',                   100),
  K('Ali Al-Zaidi',                   100),
  K('Ali Faleh Al-Zaidi',             100),
  K('Prime Minister Iraq',            100),
  K('PM Iraq',                        100),
  K('Iraqi Prime Minister',           100),
  K('Nizar Amidi',                    100),
  K('Nizar Amedi',                    100),
  K('Nizar Mohammed Saeed Amidi',     100),
  K('President Iraq',                 100),
  K('Iraqi President',                100),
  K('Iraqi Government',                95),
  K('Council of Ministers Iraq',       95),
  K('Iraqi Parliament',                95),
  K('Baghdad Government',              95),
  K('Green Zone Baghdad',              90),

  // ══════════════════════════════════════════════════════
  // TIER 2 — MAJOR POLITICAL FIGURES  (weight 90)
  // ══════════════════════════════════════════════════════
  K('Muqtada al Sadr',                 90),
  K('Muqtada Al-Sadr',                 90),
  K('Sadr Movement',                   90),
  K('Nouri al Maliki',                 90),
  K('Maliki Iraq',                     85),
  K('Hadi al Amiri',                   90),
  K('Badr Organization',               90),
  K('Masoud Barzani',                  90),
  K('Nechirvan Barzani',               90),
  K('Bafel Talabani',                  90),
  K('Mohammed al Halbousi',            90),
  K('Khamis al Khanjar',               85),
  K('Fuad Hussein Iraq',               85),
  K('Basim Mohammed Iraq',             80),

  // ══════════════════════════════════════════════════════
  // TIER 3 — POLITICAL PARTIES  (weight 80)
  // ══════════════════════════════════════════════════════
  K('Coordination Framework Iraq',     80),
  K('State of Law Coalition',          80),
  K('Dawa Party Iraq',                 80),
  K('Fatah Alliance Iraq',             80),
  K('Asaib Ahl al Haq',                80),
  K('KDP Iraq',                        80),
  K('Kurdistan Democratic Party',      80),
  K('PUK Iraq',                        80),
  K('Patriotic Union of Kurdistan',    80),
  K('New Generation Movement Iraq',    75),
  K('Taqaddum Iraq',                   75),
  K('Siyada Alliance Iraq',            75),

  // ══════════════════════════════════════════════════════
  // TIER 4 — SECURITY & MILITIAS  (weight 85)
  // ══════════════════════════════════════════════════════
  K('PMF Iraq',                        85),
  K('Popular Mobilization Forces',     85),
  K('Hashd al Shaabi',                 85),
  K('Kataib Hezbollah',                85, 'threat'),
  K('Harakat Hezbollah al Nujaba',     85, 'threat'),
  K('Badr Brigade Iraq',               80),
  K('Saraya al Salam',                 80),
  K('Iran backed militias Iraq',       85),
  K('Shia militias Iraq',              80),
  K('Armed groups Iraq',               80),
  K('Weapons outside state control',   85),
  K('Militia disarmament Iraq',        85),
  K('Iraqi Security Forces',           75),
  K('Counter Terrorism Service Iraq',  80),
  K('Iraqi Security Media Cell',       75),

  // ══════════════════════════════════════════════════════
  // TIER 5 — TERRORISM  (weight 95, category: threat)
  // ══════════════════════════════════════════════════════
  K('ISIS Iraq',                       95, 'threat'),
  K('ISIL Iraq',                       95, 'threat'),
  K('Daesh Iraq',                      95, 'threat'),
  K('Islamic State Iraq',              95, 'threat'),
  K('Terror attack Iraq',              95, 'threat'),
  K('ISIS attack Iraq',                95, 'threat'),
  K('Counter terrorism Iraq',          90, 'threat'),
  K('Mosul security',                  85, 'threat'),
  K('Anbar security',                  85, 'threat'),
  K('Nineveh security',                85, 'threat'),
  K('IED Iraq',                        90, 'threat'),
  K('Suicide bombing Iraq',            95, 'violence'),
  K('Car bomb Iraq',                   90, 'violence'),

  // ══════════════════════════════════════════════════════
  // TIER 6 — IRAN / ISRAEL / USA WAR  (weight 80)
  // ══════════════════════════════════════════════════════
  K('Iran Iraq relations',             80),
  K('Tehran Baghdad',                  80),
  K('Israel Iraq',                     80),
  K('Israel Iran conflict Iraq',       80),
  K('Middle East War Iraq',            80),
  K('US Iraq relations',               80),
  K('Washington Baghdad',              80),
  K('US troops Iraq',                  85),
  K('Coalition Forces Iraq',           80),
  K('CENTCOM Iraq',                    80),
  K('Iranian influence Iraq',          85),
  K('Strategic Framework Agreement',   75),
  K('Trump Iraq',                      80),
  K('US sanctions Iraq',               80),
  K('Drone attack Iraq',               85, 'threat'),
  K('Missile attack Iraq',             85, 'threat'),

  // ══════════════════════════════════════════════════════
  // TIER 7 — OIL & ECONOMY  (weight 60)
  // ══════════════════════════════════════════════════════
  K('Iraq oil',                        60),
  K('Basra Oil',                       60),
  K('Basrah Oil Terminal',             60),
  K('OPEC Iraq',                       60),
  K('Oil exports Iraq',                60),
  K('Oil prices Iraq',                 55),
  K('Investment Iraq',                 60),
  K('Foreign investment Iraq',         60),
  K('Economic reform Iraq',            65),
  K('Iraqi dinar',                     55),
  K('Iraq federal budget',             65),
  K('Unemployment Iraq',               65),
  K('Inflation Iraq',                  60),
  K('Corruption Iraq',                 70),
  K('Anti corruption Iraq',            70),
  K('Iraq reconstruction',             60),

  // ══════════════════════════════════════════════════════
  // TIER 8 — PUBLIC SENTIMENT  (weight 70)
  // ══════════════════════════════════════════════════════
  K('Iraq protests',                   70),
  K('Baghdad protests',                70),
  K('Electricity crisis Iraq',         70),
  K('Power outage Iraq',               65),
  K('Water shortage Iraq',             65),
  K('Youth unemployment Iraq',         65),
  K('Public services Iraq',            60),
  K('Corruption scandal Iraq',         75),
  K('Government failure Iraq',         70),
  K('Tishreen movement Iraq',          75),

  // ══════════════════════════════════════════════════════
  // TIER 9 — RELIGIOUS INFLUENCERS  (weight 70)
  // ══════════════════════════════════════════════════════
  K('Ali al Sistani',                  70),
  K('Grand Ayatollah Sistani',         70),
  K('Najaf Seminary',                  65),
  K('Shia Clerics Iraq',               65),
  K('Sunni Endowment Iraq',            65),
  K('Ashura Iraq',                     65),
  K('Arbaeen Iraq',                    65),
  K('Karbala pilgrimage',              60),

  // ══════════════════════════════════════════════════════
  // TIER 10 — PROVINCES & CITIES  (weight 55)
  // ══════════════════════════════════════════════════════
  K('Baghdad Iraq',                    55),
  K('Basra Iraq',                      55),
  K('Mosul Iraq',                      55),
  K('Erbil Iraq',                      55),
  K('Kirkuk Iraq',                     55),
  K('Najaf Iraq',                      55),
  K('Karbala Iraq',                    55),
  K('Sulaymaniyah Iraq',               55),
  K('Duhok Iraq',                      50),
  K('Anbar Iraq',                      55),
  K('Nineveh Iraq',                    55),
  K('Diyala Iraq',                     55),
  K('Salahuddin Iraq',                 55),
  K('Wasit Iraq',                      50),
  K('Maysan Iraq',                     50),
  K('Dhi Qar Iraq',                    50),
  K('Muthanna Iraq',                   50),
  K('Babil Iraq',                      50),
  K('Qadisiyyah Iraq',                 50),
  K('Sadr City Baghdad',               60),
  K('Kurdistan Region Iraq',           65),

  // ══════════════════════════════════════════════════════
  // TIER 11 — ARABIC KEYWORDS  (weight 90, language: ar)
  // ══════════════════════════════════════════════════════
  K('العراق',                          90, 'other', 'ar'),
  K('بغداد',                           85, 'other', 'ar'),
  K('البصرة',                          80, 'other', 'ar'),
  K('الموصل',                          80, 'other', 'ar'),
  K('كركوك',                           80, 'other', 'ar'),
  K('أربيل',                           80, 'other', 'ar'),
  K('النجف',                           80, 'other', 'ar'),
  K('كربلاء',                          80, 'other', 'ar'),
  K('رئيس الوزراء العراقي',            90, 'other', 'ar'),
  K('رئيس العراق',                     90, 'other', 'ar'),
  K('نزار آميدي',                      90, 'other', 'ar'),
  K('علي الزيدي',                      90, 'other', 'ar'),
  K('الحشد الشعبي',                    85, 'other', 'ar'),
  K('داعش',                            95, 'threat', 'ar'),
  K('البرلمان العراقي',                85, 'other', 'ar'),
  K('الحكومة العراقية',                85, 'other', 'ar'),
  K('مقتدى الصدر',                     90, 'other', 'ar'),
  K('نوري المالكي',                    90, 'other', 'ar'),
  K('هادي العامري',                    85, 'other', 'ar'),
  K('مسعود البارزاني',                 85, 'other', 'ar'),

  // ══════════════════════════════════════════════════════
  // TIER 12 — CURRENT HOT TOPICS JUNE 2026  (weight 90)
  // ══════════════════════════════════════════════════════
  K('Ali al Zaidi Washington visit',   90),
  K('US Iraq economic partnership',    90),
  K('Iraq US summit',                  90),
  K('Militia disarmament 2026',        90),
  K('State monopoly over weapons Iraq',90),
  K('Oil export reform Iraq',          85),
  K('Investment friendly Iraq',        85),
  K('Iraq cabinet 2026',               90),
  K('Government formation Iraq 2026',  90),
  K('PMF integration Iraq',            85),
  K('Iraq sovereign fund',             80),
  K('Iraq strategic development',      75),

  // ══════════════════════════════════════════════════════
  // X / TWITTER ACCOUNT HANDLES (weight 75, for mention tracking)
  // ══════════════════════════════════════════════════════
  K('@IraqiPMO',                       75),
  K('@Iraqipresidency',                75),
  K('@MofaIraq',                       75),
  K('@IKRPresident',                   70),
  K('@KRG_DFR',                        70),
  K('@RudawEnglish',                   70),
  K('@Shafaqnews',                     70),
  K('@INA_iq',                         70),
  K('@AlsumariaTV',                    70),
  K('@K24English',                     70),
  K('@Kurdistan24',                    70),
  K('@AlMonitor',                      65),
  K('@MiddleEastEye',                  65),
];

// ─── De-duplicate within this list ────────────────────────────────────────────
const seen = new Set();
const UNIQUE_KEYWORDS = KEYWORDS.filter(k => {
  const key = k.keyword.toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const dbName = process.env.DB_NAME ? String(process.env.DB_NAME).trim() : '(from URI)';

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  IRAQ WATCH · KEYWORD DATABASE SEED  (2026)              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`  Total keywords prepared : ${UNIQUE_KEYWORDS.length}`);
  console.log(`  Database               : ${dbName}`);
  if (DRY_RUN)  console.log('  MODE: DRY RUN — nothing will be written\n');
  if (REPLACE)  console.log('  MODE: REPLACE — existing keywords will be wiped first\n');

  if (DRY_RUN) {
    UNIQUE_KEYWORDS.forEach(k =>
      console.log(`  [${k.language.padEnd(3)}] [w${String(k.weight).padStart(3)}] [${k.category.padEnd(7)}]  ${k.keyword}`)
    );
    return;
  }

  await connectDB();
  console.log('  Connected to MongoDB\n');

  if (REPLACE) {
    const del = await Keyword.deleteMany({});
    console.log(`  Wiped ${del.deletedCount} existing keywords.\n`);
  }

  let inserted = 0, skipped = 0, errors = 0;

  for (const kw of UNIQUE_KEYWORDS) {
    try {
      await Keyword.updateOne(
        { keyword: kw.keyword },
        { $setOnInsert: kw },
        { upsert: true }
      );
      inserted++;
    } catch (err) {
      if (err?.code === 11000) {
        skipped++;
      } else {
        console.error(`  ERROR inserting "${kw.keyword}":`, err.message);
        errors++;
      }
    }
  }

  // Print summary
  const all = await Keyword.find({ is_active: true }).select('keyword weight language').sort({ weight: -1 }).lean();
  console.log('──────────────────────────────────────────────────────────');
  console.log(`  Upserted  : ${inserted}`);
  console.log(`  Skipped   : ${skipped}  (already existed)`);
  console.log(`  Errors    : ${errors}`);
  console.log(`  DB total  : ${all.length} active keywords`);
  console.log('──────────────────────────────────────────────────────────\n');

  console.log('  Top 20 by weight:');
  all.slice(0, 20).forEach(k =>
    console.log(`    [w${String(k.weight).padStart(3)}] [${k.language}]  ${k.keyword}`)
  );

  await mongoose.disconnect();
  console.log('\n  Done.\n');
}

main().catch(err => {
  console.error('\n  FATAL:', err.message);
  process.exit(1);
});
