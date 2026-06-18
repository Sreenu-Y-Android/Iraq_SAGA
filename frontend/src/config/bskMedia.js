/**
 * BSK Watch — central media catalogue for Shri Bandi Sanjay Kumar.
 *
 * All URLs are fetched from public sources (Wikipedia's stable Special:FilePath
 * redirect, which always serves the current version of a Commons file). If any
 * URL fails to load, the <BskImage> helper falls back to /policelogo.jpg shipped
 * with the app, so the UI never breaks.
 *
 * To swap any image, just edit the `src` field. No other code needs to change.
 */

const wiki = (filename) =>
  `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;

/* ─── Portrait & action shots of Shri Bandi Sanjay Kumar ─────────── */
export const BSK_PORTRAITS = [
  {
    id: 'portrait-primary',
    src: wiki('Bandi Sanjay Kumar.jpg'),
    alt: 'Shri Bandi Sanjay Kumar — Member of Parliament, Karimnagar',
    caption: 'Member of Parliament · Karimnagar',
  },
  {
    id: 'portrait-rally',
    src: wiki('Bandi Sanjay Kumar (cropped).jpg'),
    alt: 'Shri Bandi Sanjay Kumar addressing a public rally',
    caption: 'Public rally',
  },
];

/* The "hero" image used across the app (login, header, dashboard avatar). */
export const BSK_HERO = BSK_PORTRAITS[0];

/* ─── Karimnagar Lok Sabha constituency imagery ──────────────────── */
export const KARIMNAGAR_GALLERY = [
  {
    id: 'kn-elgandal',
    src: wiki('Elgandal Fort.jpg'),
    alt: 'Elgandal Fort, Karimnagar',
    caption: 'Elgandal Fort · Karimnagar',
  },
  {
    id: 'kn-lower-manair',
    src: wiki('Lower Manair Dam.jpg'),
    alt: 'Lower Manair Dam, Karimnagar',
    caption: 'Lower Manair Dam',
  },
  {
    id: 'kn-vemulawada',
    src: wiki('Sri Raja Rajeshwara Swamy Temple Vemulawada.jpg'),
    alt: 'Sri Raja Rajeshwara Swamy Temple, Vemulawada',
    caption: 'Vemulawada Temple',
  },
  {
    id: 'kn-jagtial',
    src: wiki('Jagtial Fort.jpg'),
    alt: 'Jagtial Fort',
    caption: 'Jagtial Fort',
  },
];

/* ─── BJP party visual marks ─────────────────────────────────────── */
export const BJP_MARK = {
  flag: wiki('Flag of Bharatiya Janata Party.svg'),
  logo: wiki('Bharatiya Janata Party logo.svg'),
};

/* ─── Local fallback served from /public  ────────────────────────── */
export const LOCAL_FALLBACK = '/policelogo.jpg';

/* ─── 7 Assembly segments of the Karimnagar Lok Sabha PC ─────────── */
export const KARIMNAGAR_ASSEMBLY_SEGMENTS = [
  { name: 'Karimnagar',  district: 'Karimnagar' },
  { name: 'Choppadandi', district: 'Karimnagar' },
  { name: 'Vemulawada',  district: 'Rajanna Sircilla' },
  { name: 'Sircilla',    district: 'Rajanna Sircilla' },
  { name: 'Manakondur',  district: 'Karimnagar' },
  { name: 'Husnabad',    district: 'Siddipet' },
  { name: 'Huzurabad',   district: 'Karimnagar' },
];

/* ─── Talking-points BSK champions (used by AI summary / dashboard) */
export const BSK_FOCUS_TOPICS = [
  'Karimnagar development',
  'Lower Manair Dam',
  'Telangana state politics',
  'BJP Telangana growth',
  'Anti-corruption',
  'Hindutva',
  'Backward classes welfare',
  'Farmer issues',
  'Drinking water — Mission Bhagiratha',
  'Granite & textile industries of Karimnagar',
];
