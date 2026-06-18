require('dotenv').config();
const mongoose = require('mongoose');
const Keyword = require('./src/models/Keyword');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vamsiworkspace54_db_user:fFFXbSGICBaWnY7p@cluster0.zoko5u5.mongodb.net/punjab-government?appName=Cluster0';

// Iraq political / security monitoring keywords.
// These are topic & entity terms (people, parties, places, issues), so they map
// to category 'other'. language: 'all' so they match across AR / KU / EN content.
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
    'Sadr City Baghdad', 'Kurdistan Region Iraq', 'Ali al Zaidi Washington visit', 'US Iraq economic partnership',
    'Iraq US summit', 'Militia disarmament 2026', 'State monopoly over weapons Iraq', 'Oil export reform Iraq',
    'Investment friendly Iraq', 'Iraq cabinet 2026', 'Government formation Iraq 2026', 'PMF integration Iraq',
    'Iraq sovereign fund', 'Iraq strategic development'
];

const DEFAULTS = {
    category: 'other',
    language: 'all',
    weight: 50,
    is_active: true
};

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.\n');

        // Dedupe input (case-insensitive) while preserving first-seen casing.
        const seen = new Map();
        for (const raw of RAW_KEYWORDS) {
            const term = String(raw).trim();
            if (!term) continue;
            const key = term.toLowerCase();
            if (!seen.has(key)) seen.set(key, term);
        }
        const keywords = [...seen.values()];
        console.log(`Prepared ${keywords.length} unique keywords (from ${RAW_KEYWORDS.length} raw).\n`);

        let created = 0;
        let skipped = 0;
        let failed = 0;

        for (const keyword of keywords) {
            try {
                // Case-insensitive existence check to avoid near-duplicate rows.
                const existing = await Keyword.findOne({
                    keyword: { $regex: `^${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                await Keyword.create({ keyword, ...DEFAULTS });
                created++;
                console.log(`  [+] ${keyword}`);
            } catch (err) {
                if (err?.code === 11000) {
                    skipped++; // raced/duplicate unique index
                } else {
                    failed++;
                    console.error(`  [!] ${keyword}: ${err.message}`);
                }
            }
        }

        console.log('\n========== SUMMARY ==========');
        console.log(`Created: ${created}`);
        console.log(`Skipped (existing): ${skipped}`);
        console.log(`Failed:  ${failed}`);
        console.log(`Total keywords in DB now: ${await Keyword.countDocuments()}`);
        console.log('=============================\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

run();
