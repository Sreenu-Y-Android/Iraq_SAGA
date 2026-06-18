/**
 * Iraq Watch — central media catalogue for Iraq intelligence platform.
 *
 * All Wikipedia URLs use the stable Special:FilePath redirect which
 * always serves the current version of a Commons file.
 * If any URL fails to load, the app falls back to /policelogo.jpg.
 *
 * To swap any image, just edit the `src` field.
 */

const wiki = (filename) =>
  `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

/* ─── Portrait of President of Iraq — Abdul Latif Rashid ─────────── */
export const BSK_PORTRAITS = [
  {
    id: 'portrait-president',
    src: wiki('Abdul_Latif_Rashid.jpg'),
    alt: 'Abdul Latif Rashid — President of Iraq',
    caption: 'President of Iraq',
  },
  {
    id: 'portrait-pm',
    src: wiki('Mohammed_Shia%27_Al-Sudani.jpg'),
    alt: 'Mohammed Shia Al-Sudani — Prime Minister of Iraq',
    caption: 'Prime Minister of Iraq',
  },
];

/* The "hero" image used across the app (login, header, dashboard avatar). */
export const BSK_HERO = BSK_PORTRAITS[0];

/* ─── Iraq landmarks gallery ──────────────────────────────────────── */
export const KARIMNAGAR_GALLERY = [
  {
    id: 'iraq-parliament',
    src: wiki('Iraqi_Council_of_Representatives.jpg'),
    alt: 'Iraqi Council of Representatives — Baghdad',
    caption: 'Iraqi Parliament · Baghdad',
  },
  {
    id: 'iraq-al-shaheed',
    src: wiki('Al-Shaheed_Monument.jpg'),
    alt: 'Martyr Monument — Baghdad',
    caption: 'Al-Shaheed Monument · Baghdad',
  },
  {
    id: 'iraq-babylon',
    src: wiki('Ishtar_gate_in_Babylon_site.jpg'),
    alt: 'Babylon ruins — Babil Governorate',
    caption: 'Ancient Babylon · Babil',
  },
  {
    id: 'iraq-karbala',
    src: wiki('Imam_Hussein_Shrine.jpg'),
    alt: 'Imam Hussein Shrine — Karbala',
    caption: 'Imam Hussein Shrine · Karbala',
  },
];

/* ─── Iraq flag / national symbol ────────────────────────────────── */
export const BJP_MARK = {
  flag: wiki('Flag_of_Iraq.svg'),
  logo: wiki('Emblem_of_Iraq.svg'),
};

/* ─── Local fallback served from /public ─────────────────────────── */
export const LOCAL_FALLBACK = '/policelogo.jpg';

/* ─── 7 Key monitoring governorates for Iraq Watch ──────────────── */
export const KARIMNAGAR_ASSEMBLY_SEGMENTS = [
  { name: 'Baghdad',   district: 'Baghdad Governorate' },
  { name: 'Basra',     district: 'Basra Governorate' },
  { name: 'Mosul',     district: 'Nineveh Governorate' },
  { name: 'Erbil',     district: 'Erbil Governorate' },
  { name: 'Kirkuk',    district: 'Kirkuk Governorate' },
  { name: 'Najaf',     district: 'Najaf Governorate' },
  { name: 'Karbala',   district: 'Karbala Governorate' },
];

/* ─── Key monitoring topics for Iraq intelligence platform ─────── */
export const BSK_FOCUS_TOPICS = [
  'Iraq security situation',
  'ISIS / Daesh activity',
  'PMF (Hashd al-Shaabi) operations',
  'Kurdish autonomy & KRG politics',
  'Iraq-Iran relations',
  'US coalition presence in Iraq',
  'Kirkuk disputed territories',
  'Baghdad political crisis',
  'Iraqi oil sector & Basra',
  'Sectarian tensions — Shia/Sunni/Kurd',
  'War crimes & humanitarian crises',
  'Iraqi elections & government formation',
];
