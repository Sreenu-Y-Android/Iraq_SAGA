/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║     IRAQ LOCATION DATABASE — IRAQ WATCH GEO DETECTION LAYER            ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  Governorates, districts, and major cities of Iraq —                    ║
 * ║  with deeper coverage of Baghdad and key conflict/political zones.       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * NOTE: Export names are kept as ALL_TELANGANA_LOCATIONS / isTelanganaLocation
 * for backward compatibility with existing imports (grievanceService, controllers).
 */

// ─── 18 GOVERNORATES OF IRAQ ────────────────────────────────────────────────
const IRAQ_GOVERNORATES = [
    'baghdad', 'basra', 'nineveh', 'mosul', 'erbil', 'arbil',
    'sulaymaniyah', 'sulaimani', 'kirkuk', 'tameem',
    'anbar', 'ramadi', 'fallujah',
    'diyala', 'baquba',
    'saladin', 'tikrit', 'samarra',
    'babil', 'babylon', 'hillah',
    'najaf', 'karbala',
    'qadisiyyah', 'diwaniyah',
    'muthanna', 'samawah',
    'thi qar', 'dhi qar', 'nasiriyah',
    'wasit', 'kut',
    'maysan', 'amara',
    'dohuk', 'dahuk',
    'halabja',
];

// ─── MAJOR CITIES AND DISTRICTS ─────────────────────────────────────────────
const IRAQ_CITIES = [
    // Baghdad
    'baghdad', 'sadr city', 'kadhimiya', 'kadhimiyah', 'adhamiya',
    'rusafa', 'karkh', 'mansour', 'karrada', 'dora', 'abu ghraib',
    'taji', 'mahmoudiya', 'latifiya',

    // Basra
    'basra', 'basra city', 'zubayr', 'qurna', 'shatt al-arab', 'fao',
    'abadan crossing', 'hartha',

    // Nineveh / Mosul
    'mosul', 'nineveh', 'tel afar', 'sinjar', 'hamdaniya',
    'bartella', 'nimrud', 'tal kayf',

    // Erbil / Kurdistan
    'erbil', 'arbil', 'hawler', 'zakho', 'amadiya', 'soran', 'ranya',

    // Sulaymaniyah
    'sulaymaniyah', 'sulaimani', 'halabja', 'chamchamal', 'said sadiq',
    'penjwen',

    // Dohuk
    'dohuk', 'dahuk', 'zakho', 'amadiya', 'akre',

    // Kirkuk
    'kirkuk', 'altun kopru', 'hawija', 'dibis',

    // Anbar
    'ramadi', 'fallujah', 'haditha', 'hit', 'qaim', 'rutba',
    'khalidiya', 'amiriyah', 'baghdadi',

    // Diyala
    'baquba', 'khanaqin', 'jalawla', 'mandali', 'muqdadiya',

    // Saladin
    'tikrit', 'samarra', 'baiji', 'shirqat', 'balad', 'tuz khurmatu',
    'duluiyah',

    // Babil
    'hillah', 'musayyib', 'mahawil', 'qasim',

    // Najaf
    'najaf', 'kufa', 'abu sukhair',

    // Karbala
    'karbala', 'hindiya',

    // Qadisiyyah
    'diwaniyah', 'afak', 'hamza',

    // Wasit
    'kut', 'numaniyah', 'zubaidiyah', 'aziziyah',

    // Maysan
    'amara', 'ali al-gharbi', 'qalat salih',

    // Thi Qar
    'nasiriyah', 'shatrah', 'rifai', 'suq al-shuyukh',

    // Muthanna
    'samawah', 'rumaitha', 'khidir',
];

// ─── FLAT COMBINED LIST (used for keyword detection) ────────────────────────
const ALL_TELANGANA_LOCATIONS = [...new Set([...IRAQ_GOVERNORATES, ...IRAQ_CITIES])];

/**
 * Returns true if the text token matches any known Iraq location.
 * (Function name kept as isTelanganaLocation for backward-compat imports.)
 */
const isTelanganaLocation = (token) => {
    if (!token) return false;
    const t = String(token).toLowerCase().trim();
    return ALL_TELANGANA_LOCATIONS.some(loc => t.includes(loc) || loc.includes(t));
};

// ─── GOVERNORATE-LEVEL LOOKUP (uppercase for GeoJSON DIST_NAME matching) ────
const IRAQ_GOVERNORATE_MAP = {
    'baghdad': 'BAGHDAD',
    'sadr city': 'BAGHDAD', 'kadhimiya': 'BAGHDAD', 'adhamiya': 'BAGHDAD',
    'rusafa': 'BAGHDAD', 'karkh': 'BAGHDAD', 'mansour': 'BAGHDAD',
    'karrada': 'BAGHDAD', 'dora': 'BAGHDAD', 'abu ghraib': 'BAGHDAD',
    'taji': 'BAGHDAD', 'mahmoudiya': 'BAGHDAD',

    'basra': 'BASRA',
    'zubayr': 'BASRA', 'qurna': 'BASRA', 'fao': 'BASRA', 'hartha': 'BASRA',

    'mosul': 'NINEVEH', 'nineveh': 'NINEVEH',
    'tel afar': 'NINEVEH', 'sinjar': 'NINEVEH', 'hamdaniya': 'NINEVEH',
    'bartella': 'NINEVEH', 'nimrud': 'NINEVEH',

    'erbil': 'ERBIL', 'arbil': 'ERBIL', 'hawler': 'ERBIL',
    'soran': 'ERBIL', 'ranya': 'ERBIL',

    'sulaymaniyah': 'SULAYMANIYAH', 'sulaimani': 'SULAYMANIYAH',
    'halabja': 'HALABJA', 'chamchamal': 'SULAYMANIYAH',

    'dohuk': 'DOHUK', 'dahuk': 'DOHUK', 'zakho': 'DOHUK',
    'amadiya': 'DOHUK', 'akre': 'DOHUK',

    'kirkuk': 'KIRKUK', 'altun kopru': 'KIRKUK', 'hawija': 'KIRKUK',

    'ramadi': 'ANBAR', 'fallujah': 'ANBAR', 'anbar': 'ANBAR',
    'haditha': 'ANBAR', 'hit': 'ANBAR', 'qaim': 'ANBAR',
    'rutba': 'ANBAR', 'khalidiya': 'ANBAR',

    'baquba': 'DIYALA', 'diyala': 'DIYALA',
    'khanaqin': 'DIYALA', 'jalawla': 'DIYALA', 'muqdadiya': 'DIYALA',

    'tikrit': 'SALADIN', 'saladin': 'SALADIN',
    'samarra': 'SALADIN', 'baiji': 'SALADIN', 'balad': 'SALADIN',

    'hillah': 'BABIL', 'babylon': 'BABIL', 'babil': 'BABIL',
    'musayyib': 'BABIL',

    'najaf': 'NAJAF', 'kufa': 'NAJAF',
    'karbala': 'KARBALA', 'hindiya': 'KARBALA',

    'diwaniyah': 'QADISIYYAH', 'qadisiyyah': 'QADISIYYAH',

    'kut': 'WASIT', 'wasit': 'WASIT', 'numaniyah': 'WASIT',

    'amara': 'MAYSAN', 'maysan': 'MAYSAN',

    'nasiriyah': 'DHI QAR', 'thi qar': 'DHI QAR', 'dhi qar': 'DHI QAR',
    'shatrah': 'DHI QAR',

    'samawah': 'MUTHANNA', 'muthanna': 'MUTHANNA',
};

module.exports = {
    ALL_TELANGANA_LOCATIONS,
    isTelanganaLocation,
    IRAQ_GOVERNORATES,
    IRAQ_CITIES,
    IRAQ_GOVERNORATE_MAP,
};
