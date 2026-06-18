/**
 * politicalEntities.js
 * ─────────────────────────────────────────────────────────────────────
 * Knowledge graph of political entities relevant to the Iraq
 * intelligence monitoring platform. Used by `politicalContextService` to:
 *   1. Detect which entities a piece of content actually mentions.
 *   2. Decide whether the content is "about" the primary target or an
 *      opponent so the downstream sentiment engine can score accordingly.
 *
 * Aliases include:
 *   • English variants & honorifics
 *   • Arabic transliterations / common spellings
 *   • Official handles / hashtags
 *   • Slang / hostile nicknames
 *
 * `alignment` values:
 *   'ally'        — pro-government / ruling coalition entities.
 *   'opposition'  — opposition figures / rival factions.
 *   'neutral'     — civic/military/international entities where political
 *                   alignment doesn't auto-translate.
 */

const POLITICAL_ENTITIES = {
    // ═══════════════════════════════════════════════════════════════
    // PRIMARY TARGET — PRESIDENT OF IRAQ
    // ═══════════════════════════════════════════════════════════════
    president_iraq: {
        canonical: 'Abdul Latif Rashid',
        type: 'person',
        party: 'puk',
        role: 'President of Iraq (since October 2022)',
        alignment: 'ally',
        priority: 100,
        aliases: [
            'abdul latif rashid', 'latif rashid', 'abd al-latif rashid',
            'president rashid', 'president of iraq', 'iraqi president',
            '@abdullatifiraq',
            '#abdullatifirashid', '#presidentofiraq',
            'رئيس الجمهورية', 'عبد اللطيف رشيد', 'عبداللطيف راشد',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // PRIME MINISTER
    // ═══════════════════════════════════════════════════════════════
    pm_sudani: {
        canonical: 'Mohammed Shia Al-Sudani',
        type: 'person',
        party: 'coordination_framework',
        role: 'Prime Minister of Iraq (since October 2022)',
        alignment: 'ally',
        priority: 95,
        aliases: [
            'mohammed shia al-sudani', 'al sudani', 'sudani', 'alsudani',
            'muhammed shia', 'muhammad shia al sudani',
            '@alsudaniiq', '#alsudani', '#sudani',
            'prime minister sudani', 'pm sudani', 'pm of iraq',
            'محمد شياع السوداني', 'السوداني', 'رئيس الوزراء السوداني',
            'رئيس الوزراء العراقي',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // FORMER PRIME MINISTERS / KEY RULING FIGURES
    // ═══════════════════════════════════════════════════════════════
    maliki: {
        canonical: 'Nouri al-Maliki',
        type: 'person',
        party: 'state_of_law',
        role: 'VP of Iraq; State of Law Coalition Leader; former PM',
        alignment: 'ally',
        priority: 85,
        aliases: [
            'nouri al-maliki', 'nouri maliki', 'al-maliki', 'maliki',
            'abu esraa', 'jawad al-maliki',
            '@n_maliki', '#maliki', '#nourimaliki',
            'former pm maliki', 'state of law maliki',
            'نوري المالكي', 'المالكي', 'نوري كامل المالكي',
            'ائتلاف دولة القانون',
        ],
    },
    kadhimi: {
        canonical: 'Mustafa al-Kadhimi',
        type: 'person',
        party: 'independent',
        role: 'Former Prime Minister of Iraq (2020–2022)',
        alignment: 'neutral',
        priority: 75,
        aliases: [
            'mustafa al-kadhimi', 'kadhimi', 'al-kadhimi', 'al kadhimi',
            'mustafa kadhemi', 'al-kazemi',
            '@m_kadhimi', '#kadhimi',
            'former pm kadhimi', 'ex pm iraq',
            'مصطفى الكاظمي', 'الكاظمي',
        ],
    },
    abadi: {
        canonical: 'Haider al-Abadi',
        type: 'person',
        party: 'nasr_coalition',
        role: 'Former PM of Iraq (2014–2018); Victory Alliance leader',
        alignment: 'neutral',
        priority: 70,
        aliases: [
            'haider al-abadi', 'al-abadi', 'abadi', 'haider abadi',
            '#abadi', '@haideralabadi',
            'حيدر العبادي', 'العبادي',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // KURDISH REGION LEADERS
    // ═══════════════════════════════════════════════════════════════
    masoud_barzani: {
        canonical: 'Masoud Barzani',
        type: 'person',
        party: 'kdp',
        role: 'Kurdistan Democratic Party (KDP) President',
        alignment: 'neutral',
        priority: 80,
        aliases: [
            'masoud barzani', 'masud barzani', 'barzani', 'masoud barzani kdp',
            '@masoudbarzani', '#masoudbarzani', '#barzani',
            'kdp president', 'president barzani',
            'مسعود بارزاني', 'بارزاني',
        ],
    },
    nechirvan_barzani: {
        canonical: 'Nechirvan Barzani',
        type: 'person',
        party: 'kdp',
        role: 'President of Kurdistan Region',
        alignment: 'neutral',
        priority: 75,
        aliases: [
            'nechirvan barzani', 'nechirvan', 'nechirvan idris barzani',
            '@nechirvan_barzani', '#nechirvanbarzani',
            'president of kurdistan', 'krg president',
            'نيچيرفان بارزاني', 'نيجيرفان بارزاني',
        ],
    },
    barham_salih: {
        canonical: 'Barham Salih',
        type: 'person',
        party: 'puk',
        role: 'Former President of Iraq (2018–2022); PUK leader',
        alignment: 'neutral',
        priority: 72,
        aliases: [
            'barham salih', 'barham ahmed salih', 'barham',
            '@barham_salih', '#barhamSalih',
            'former president barham', 'puk barham',
            'برهم صالح',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // OPPOSITION / RIVAL FACTIONS
    // ═══════════════════════════════════════════════════════════════
    muqtada_sadr: {
        canonical: 'Muqtada al-Sadr',
        type: 'person',
        party: 'sadrist',
        role: 'Sadrist Movement Leader; Shia cleric',
        alignment: 'opposition',
        priority: 90,
        aliases: [
            'muqtada al-sadr', 'muqtada sadr', 'al-sadr', 'sadr', 'moqtada al-sadr',
            'sadrist', 'sadrist movement',
            '@muqtada_alsadr', '#muqtadaalsadr', '#sadr',
            'مقتدى الصدر', 'الصدر', 'التيار الصدري',
        ],
    },
    hadi_amiri: {
        canonical: 'Hadi al-Amiri',
        type: 'person',
        party: 'badr',
        role: 'Badr Organization Secretary-General; PMF commander',
        alignment: 'opposition',
        priority: 80,
        aliases: [
            'hadi al-amiri', 'hadi amiri', 'al-amiri', 'amiri',
            'badr organization', 'badr brigade',
            '#hadialamiri', '#badr',
            'هادي العامري', 'العامري', 'منظمة بدر',
        ],
    },
    halbousi: {
        canonical: 'Mohammed al-Halbousi',
        type: 'person',
        party: 'taqaddum',
        role: 'Taqaddum Party Leader; former Speaker of Parliament',
        alignment: 'opposition',
        priority: 78,
        aliases: [
            'mohammed al-halbousi', 'al-halbousi', 'halbousi',
            'taqaddum', 'progress party iraq',
            '@Mhalbousi', '#halbousi', '#taqaddum',
            'محمد الحلبوسي', 'الحلبوسي', 'تقدم',
        ],
    },
    khamis_khanjar: {
        canonical: 'Khamis al-Khanjar',
        type: 'person',
        party: 'azm_alliance',
        role: 'Al-Azm Alliance leader; Sunni politician',
        alignment: 'opposition',
        priority: 65,
        aliases: [
            'khamis al-khanjar', 'khanjar', 'al-khanjar',
            'azm alliance', 'al azm',
            'خميس الخنجر', 'الخنجر', 'تحالف عزم',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // POLITICAL PARTIES / COALITIONS
    // ═══════════════════════════════════════════════════════════════
    coordination_framework: {
        canonical: 'Coordination Framework',
        type: 'party',
        party: 'coordination_framework',
        alignment: 'ally',
        priority: 82,
        aliases: [
            'coordination framework', 'shia coordination framework',
            'الإطار التنسيقي', 'الإطار',
            '#coordinationframework', '#الاطار_التنسيقي',
        ],
    },
    state_of_law: {
        canonical: 'State of Law Coalition',
        type: 'party',
        party: 'state_of_law',
        alignment: 'ally',
        priority: 78,
        aliases: [
            'state of law', 'state of law coalition', 'dawa party', 'islamic dawa',
            'ائتلاف دولة القانون', 'دولة القانون', 'حزب الدعوة الإسلامية',
            '#stateoflaw',
        ],
    },
    sadrist_movement: {
        canonical: 'Sadrist Movement',
        type: 'party',
        party: 'sadrist',
        alignment: 'opposition',
        priority: 88,
        aliases: [
            'sadrist movement', 'al-sadriyun', 'sadr bloc', 'sairoon alliance',
            'التيار الصدري', 'الصدريون', 'تحالف سائرون',
            '#sadristmovement', '#سائرون',
        ],
    },
    kdp: {
        canonical: 'Kurdistan Democratic Party',
        type: 'party',
        party: 'kdp',
        alignment: 'neutral',
        priority: 75,
        aliases: [
            'kdp', 'kurdistan democratic party', 'kdp kurdistan',
            '@kdpinfo', '#kdp',
            'الحزب الديمقراطي الكردستاني', 'كردستاني',
        ],
    },
    puk: {
        canonical: 'Patriotic Union of Kurdistan',
        type: 'party',
        party: 'puk',
        alignment: 'neutral',
        priority: 73,
        aliases: [
            'puk', 'patriotic union of kurdistan', 'talabani party',
            '@PUKmedia', '#puk',
            'الاتحاد الوطني الكردستاني',
        ],
    },
    pmf: {
        canonical: 'Popular Mobilization Forces',
        type: 'institution',
        alignment: 'neutral',
        priority: 80,
        aliases: [
            'pmf', 'popular mobilization forces', 'hashd al-shaabi', 'al-hashd',
            'pmu', 'popular mobilization units', 'hashed al shaabi',
            '@AlHashdAlShaabi', '#pmf', '#hashdalshabi',
            'الحشد الشعبي', 'هيئة الحشد الشعبي',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // NEUTRAL CIVIC / MILITARY / INTERNATIONAL ENTITIES
    // ═══════════════════════════════════════════════════════════════
    iraqi_army: {
        canonical: 'Iraqi Army',
        type: 'institution',
        alignment: 'neutral',
        priority: 50,
        aliases: [
            'iraqi army', 'iraq army', 'iraqi armed forces', 'iraqi military',
            'joint operations command', 'joc iraq',
            '@IraqiArmy', '#IraqiArmy',
            'الجيش العراقي', 'القوات المسلحة العراقية', 'قيادة العمليات المشتركة',
        ],
    },
    iraqi_police: {
        canonical: 'Iraqi Police',
        type: 'institution',
        alignment: 'neutral',
        priority: 40,
        aliases: [
            'iraqi police', 'iraq federal police', 'interior ministry iraq',
            'الشرطة العراقية', 'الشرطة الاتحادية', 'وزارة الداخلية العراقية',
        ],
    },
    krg: {
        canonical: 'Kurdistan Regional Government',
        type: 'institution',
        alignment: 'neutral',
        priority: 55,
        aliases: [
            'krg', 'kurdistan regional government', 'kurdistan region', 'erbil government',
            '@KRGofficial', '#krg', '#kurdistan',
            'إقليم كردستان', 'حكومة إقليم كردستان',
        ],
    },
    unami: {
        canonical: 'UNAMI',
        type: 'institution',
        alignment: 'neutral',
        priority: 35,
        aliases: [
            'unami', 'united nations assistance mission iraq',
            'un iraq', 'united nations iraq',
            '@UNAMIraqi', '#unami',
            'بعثة الأمم المتحدة في العراق',
        ],
    },
    isis: {
        canonical: 'ISIS / ISIL / Daesh',
        type: 'group',
        alignment: 'opposition',
        priority: 95,
        aliases: [
            'isis', 'isil', 'daesh', 'islamic state', 'is iraq', 'is syria',
            'da3esh', 'داعش', 'تنظيم داعش', 'الدولة الإسلامية',
            '#daesh', '#isis', '#isil',
        ],
    },
    iran_influence: {
        canonical: 'Iran (Iraq Influence)',
        type: 'foreign_actor',
        alignment: 'neutral',
        priority: 70,
        aliases: [
            'iran', 'iranian', 'tehran', 'irgc', 'quds force',
            'soleimani', 'iranian-backed',
            'إيران', 'الحرس الثوري الإيراني',
        ],
    },
    us_presence: {
        canonical: 'US Forces / Coalition in Iraq',
        type: 'foreign_actor',
        alignment: 'neutral',
        priority: 65,
        aliases: [
            'us forces iraq', 'american forces iraq', 'coalition forces',
            'operation iraqi freedom', 'us military iraq', 'nato iraq',
            '@CJTFOIR', '#usforces',
            'القوات الأمريكية في العراق', 'التحالف الدولي',
        ],
    },
};

/**
 * Build a flat, lowercase-keyed reverse index from alias → entity key.
 * Tokens are sorted longest-first so multi-word matches win over
 * shorter substrings.
 */
const buildAliasIndex = () => {
    const entries = [];
    for (const [key, ent] of Object.entries(POLITICAL_ENTITIES)) {
        for (const alias of ent.aliases) {
            entries.push({
                alias: String(alias).toLowerCase().trim(),
                entityKey: key,
            });
        }
    }
    entries.sort((a, b) => b.alias.length - a.alias.length);
    return entries;
};

const ALIAS_INDEX = buildAliasIndex();

const PRIMARY_TARGET_KEY = 'president_iraq';

const isAlly       = (key) => POLITICAL_ENTITIES[key]?.alignment === 'ally';
const isOpposition = (key) => POLITICAL_ENTITIES[key]?.alignment === 'opposition';
const isNeutral    = (key) => POLITICAL_ENTITIES[key]?.alignment === 'neutral';
const isBskTarget  = (key) => key === 'president_iraq' || key === 'pm_sudani';

module.exports = {
    POLITICAL_ENTITIES,
    ALIAS_INDEX,
    PRIMARY_TARGET_KEY,
    isAlly,
    isOpposition,
    isNeutral,
    isBskTarget,
};
