#!/usr/bin/env node
/**
 * add_hate_keywords.js
 * Adds the supplied Iraq keyword list into the keywords collection with
 *   language: 'en'
 *   category: 'hate'
 *
 * Uses the DB connection from .env (MONGODB_URI + DB_NAME), matching src/config/db.js.
 *
 * Run:
 *   node scripts/add_hate_keywords.js
 *   node scripts/add_hate_keywords.js --dry-run      # preview without writing
 *   node scripts/add_hate_keywords.js --no-overwrite # only insert new, keep existing category/language
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const DRY_RUN      = process.argv.includes('--dry-run');
const NO_OVERWRITE = process.argv.includes('--no-overwrite');

// ─── Inline schema (avoids dependency on compiled models) ─────────────────────
const keywordSchema = new mongoose.Schema({
  id:         { type: String, default: uuidv4, unique: true },
  keyword:    { type: String, required: true, unique: true },
  category:   { type: String, enum: ['violence', 'threat', 'hate', 'other'], required: true },
  language:   { type: String, enum: ['en', 'hi', 'te', 'ar', 'ku', 'all'], default: 'en' },
  is_active:  { type: Boolean, default: true },
  weight:     { type: Number, default: 50 },
  created_at: { type: Date, default: Date.now },
});

const Keyword = mongoose.models.Keyword || mongoose.model('Keyword', keywordSchema);

// ─── Keyword list (language: en, category: hate) ──────────────────────────────
const RAW_KEYWORDS = [
  'Nizar Amedi', 'Nizar Mohammed Saeed Amidi', 'President Iraq', 'Iraqi President',
  'Iraqi Government', 'Council of Ministers Iraq', 'Iraqi Parliament', 'Baghdad Government',
  'Green Zone Baghdad', 'Muqtada al Sadr', 'Muqtada Al-Sadr', 'Sadr Movement',
  'Nouri al Maliki', 'Maliki Iraq', 'Hadi al Amiri', 'Badr Organization',
  'Masoud Barzani', 'Nechirvan Barzani', 'Bafel Talabani', 'Mohammed al Halbousi',
  'Khamis al Khanjar', 'Fuad Hussein Iraq', 'Basim Mohammed Iraq', 'Coordination Framework Iraq',
  'State of Law Coalition', 'Dawa Party Iraq', 'Fatah Alliance Iraq', 'Asaib Ahl al Haq',
  'KDP Iraq', 'Kurdistan Democratic Party', 'PUK Iraq', 'Patriotic Union of Kurdistan',
  'New Generation Movement Iraq', 'Taqaddum Iraq', 'Siyada Alliance Iraq', 'PMF Iraq',
  'Popular Mobilization Forces', 'Hashd al Shaabi', 'Kataib Hezbollah', 'Harakat Hezbollah al Nujaba',
  'Badr Brigade Iraq', 'Saraya al Salam', 'Iran backed militias Iraq', 'Shia militias Iraq',
  'Armed groups Iraq', 'Weapons outside state control', 'Militia disarmament Iraq', 'Iraqi Security Forces',
  'Counter Terrorism Service Iraq', 'Iraqi Security Media Cell', 'ISIS Iraq', 'ISIL Iraq',
  'Daesh Iraq', 'Islamic State Iraq', 'Terror attack Iraq', 'ISIS attack Iraq',
  'Counter terrorism Iraq', 'Mosul security', 'Anbar security', 'Nineveh security',
  'IED Iraq', 'Suicide bombing Iraq', 'Car bomb Iraq', 'Iran Iraq relations',
  'Tehran Baghdad', 'Israel Iraq', 'Israel Iran conflict Iraq', 'Middle East War Iraq',
  'US Iraq relations', 'Washington Baghdad', 'US troops Iraq', 'Coalition Forces Iraq',
  'CENTCOM Iraq', 'Iranian influence Iraq', 'Strategic Framework Agreement', 'Trump Iraq',
  'US sanctions Iraq', 'Drone attack Iraq', 'Missile attack Iraq', 'Iraq oil',
  'Basra Oil', 'Basrah Oil Terminal', 'OPEC Iraq', 'Oil exports Iraq',
  'Oil prices Iraq', 'Investment Iraq', 'Foreign investment Iraq', 'Economic reform Iraq',
  'Iraqi dinar', 'Iraq federal budget', 'Unemployment Iraq', 'Inflation Iraq',
  'Corruption Iraq', 'Anti corruption Iraq', 'Iraq reconstruction', 'Iraq protests',
  'Baghdad protests', 'Electricity crisis Iraq', 'Power outage Iraq', 'Water shortage Iraq',
  'Youth unemployment Iraq', 'Public services Iraq', 'Corruption scandal Iraq', 'Government failure Iraq',
  'Tishreen movement Iraq', 'Ali al Sistani', 'Grand Ayatollah Sistani', 'Najaf Seminary',
  'Shia Clerics Iraq', 'Sunni Endowment Iraq', 'Ashura Iraq', 'Arbaeen Iraq',
  'Karbala pilgrimage', 'Baghdad Iraq', 'Basra Iraq', 'Mosul Iraq',
  'Erbil Iraq', 'Kirkuk Iraq', 'Najaf Iraq', 'Karbala Iraq',
  'Sulaymaniyah Iraq', 'Duhok Iraq', 'Anbar Iraq', 'Nineveh Iraq',
  'Diyala Iraq', 'Salahuddin Iraq', 'Wasit Iraq', 'Maysan Iraq',
  'Dhi Qar Iraq', 'Muthanna Iraq', 'Babil Iraq', 'Qadisiyyah Iraq',
  'Sadr City Baghdad', 'Kurdistan Region Iraq', 'Ali al Zaidi Washington visit',
  'US Iraq economic partnership', 'Iraq US summit', 'Militia disarmament 2026',
  'State monopoly over weapons Iraq', 'Oil export reform Iraq', 'Investment friendly Iraq',
  'Iraq cabinet 2026', 'Government formation Iraq 2026', 'PMF integration Iraq',
  'Iraq sovereign fund', 'Iraq strategic development',
];

// ─── De-duplicate (case-insensitive) ──────────────────────────────────────────
const seen = new Set();
const KEYWORDS = RAW_KEYWORDS
  .map(k => k.trim())
  .filter(k => k.length > 0)
  .filter(k => {
    const key = k.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbUri  = process.env.MONGODB_URI || 'mongodb://localhost:27017/blura_hub';
  const dbName = process.env.DB_NAME ? String(process.env.DB_NAME).trim() : undefined;

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  ADD KEYWORDS · language=en · category=hate              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`  Keywords prepared : ${KEYWORDS.length}`);
  console.log(`  Database          : ${dbName || '(from URI)'}`);
  if (DRY_RUN)      console.log('  MODE: DRY RUN — nothing will be written');
  if (NO_OVERWRITE) console.log('  MODE: NO-OVERWRITE — existing keywords left untouched');
  console.log('');

  if (DRY_RUN) {
    KEYWORDS.forEach(k => console.log(`  [en] [hate]  ${k}`));
    console.log(`\n  ${KEYWORDS.length} keywords would be upserted.\n`);
    return;
  }

  await mongoose.connect(dbUri, dbName ? { dbName } : undefined);
  console.log('  Connected to MongoDB\n');

  let inserted = 0, updated = 0, errors = 0;

  for (const keyword of KEYWORDS) {
    try {
      const update = NO_OVERWRITE
        ? { $setOnInsert: { id: uuidv4(), keyword, category: 'hate', language: 'en', is_active: true, weight: 50, created_at: new Date() } }
        : {
            $set:         { category: 'hate', language: 'en', is_active: true },
            $setOnInsert: { id: uuidv4(), keyword, weight: 50, created_at: new Date() },
          };

      const res = await Keyword.updateOne({ keyword }, update, { upsert: true });
      if (res.upsertedCount > 0) inserted++;
      else if (res.modifiedCount > 0) updated++;
    } catch (err) {
      if (err?.code === 11000) {
        // duplicate key race — ignore
      } else {
        console.error(`  ERROR on "${keyword}":`, err.message);
        errors++;
      }
    }
  }

  const totalHateEn = await Keyword.countDocuments({ category: 'hate', language: 'en' });

  console.log('──────────────────────────────────────────────────────────');
  console.log(`  Inserted (new)        : ${inserted}`);
  console.log(`  Updated (-> en/hate)  : ${updated}`);
  console.log(`  Errors                : ${errors}`);
  console.log(`  Total en/hate in DB   : ${totalHateEn}`);
  console.log('──────────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('  Done.\n');
}

main().catch(err => {
  console.error('\n  FATAL:', err.message);
  process.exit(1);
});
