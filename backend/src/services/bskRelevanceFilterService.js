/**
 * relevanceFilterService
 *
 * Fast single-pass Ollama gate that decides whether a post is relevant to
 * Iraq Watch — the Iraq intelligence monitoring platform. Used before any
 * heavyweight categorisation runs, so we never waste a dual-pass analysis
 * on content that has no Iraq relevance.
 *
 * Input  : raw post text (string)
 * Output : {
 *            is_bsk:           boolean,   (true = Iraq-relevant)
 *            confidence:       number 0..1,
 *            stance:           'positive' | 'negative' | 'neutral' | 'unknown',
 *            topic:            short string (e.g. "ISIS attack", "Baghdad security"),
 *            reason:           one-line natural-language explanation,
 *            target:           'president_iraq' | 'pm_sudani' | 'iraq_security' | 'unrelated',
 *          }
 *
 * Heuristic fast-path: any text containing an unambiguous Iraq token
 * (president/PM name variants, political parties, security topics) returns
 * true without hitting Ollama.
 *
 * If Ollama is unreachable or returns garbage we err on the side of the
 * heuristic — so the pipeline keeps producing data even if Ollama is down.
 */
const axios = require('axios');

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://32.192.131.130:11434').replace(/\/+$/, '');
const OLLAMA_MODEL    = process.env.OLLAMA_MODEL    || 'llama3.1:latest';
const OLLAMA_TIMEOUT  = parseInt(process.env.BSK_FILTER_TIMEOUT_MS || '15000', 10);

// ─── Heuristic tokens — case-insensitive substring match ───────────
const HARD_BSK_TOKENS = [
  // President of Iraq
  'abdul latif rashid', 'latif rashid',
  // Prime Minister
  'al-sudani', 'alsudani', 'mohammed shia', 'sudani iraq',
  // Key political figures
  'muqtada al-sadr', 'muqtada sadr', 'moqtada sadr',
  'nouri al-maliki', 'maliki iraq',
  'masoud barzani', 'nechirvan barzani',
  'hadi al-amiri', 'amiri pmf',
  // Security / armed groups
  'pmf iraq', 'hashd al-sha', 'hashd alshaabi', 'popular mobilization',
  'isis iraq', 'daesh iraq', 'islamic state iraq',
  // Iraq political context
  'iraq parliament', 'iraqi government', 'baghdad security',
  'coordination framework', 'state of law coalition',
  'kurdish region iraq', 'krg iraq',
  // Arabic
  'جمهورية العراق', 'رئيس العراق', 'رئيس الوزراء',
  // Hashtags
  '#iraq', '#baghdad', '#pmf', '#isis_iraq',
];

const SOFT_BSK_TOKENS = [
  'iraq news', 'iraq security', 'iraq politics',
  'baghdad government', 'mosul security',
  'kirkuk dispute', 'basra protests',
  'iraqi election', 'iraqi army',
];

function heuristicMatch(text) {
  const lower = String(text || '').toLowerCase();
  for (const t of HARD_BSK_TOKENS) {
    if (lower.includes(t)) return { matched: true, strength: 'hard', token: t };
  }
  for (const t of SOFT_BSK_TOKENS) {
    if (lower.includes(t)) return { matched: true, strength: 'soft', token: t };
  }
  return { matched: false };
}

/* ─── strict JSON extractor (resilient to surrounding chatter) ── */
function extractJson(blob) {
  if (!blob) return null;
  if (typeof blob === 'object') return blob;
  const s = String(blob);
  try { return JSON.parse(s); } catch (_) { /* fallthrough */ }
  const m = s.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch (_) { return null; }
}

/* ─── Ollama call ─────────────────────────────────────────────── */
async function askOllama(postText) {
  const prompt = `You are filtering social media posts for an Iraq Watch intelligence monitoring system.
Iraq Watch monitors political, security, and social events related to the Republic of Iraq — covering
the President (Abdul Latif Rashid), Prime Minister (Mohammed Shia Al-Sudani), key political figures
(Muqtada al-Sadr, Maliki, Barzani), security forces (Iraqi Army, PMF/Hashd al-Sha'abi), and threats
(ISIS/Daesh). The platform covers all 18 Iraqi governorates, especially Baghdad, Basra, Mosul, Erbil.

POST TEXT (verbatim, may be English / Arabic or transliterated):
"""
${String(postText || '').slice(0, 800)}
"""

Decide whether this post is meaningfully about Iraq — its politics, security, leaders, armed groups,
or significant events. A post that merely mentions the Middle East generically is NOT relevant.
A post that targets, discusses, or reports on Iraq IS relevant.

Reply with EXACTLY one JSON object on a single line, no prose, no markdown:
{"is_bsk": true|false, "confidence": 0.0-1.0, "stance": "positive"|"negative"|"neutral"|"unknown", "target": "president_iraq"|"pm_sudani"|"iraq_security"|"unrelated", "topic": "short label", "reason": "one short sentence"}`;

  try {
    const res = await axios.post(
      `${OLLAMA_BASE_URL}/api/chat`,
      {
        model: OLLAMA_MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        options: { temperature: 0.1, num_predict: 220 },
        format: 'json',
      },
      { timeout: OLLAMA_TIMEOUT }
    );
    const content = res.data?.message?.content || '';
    return extractJson(content);
  } catch (err) {
    return { __error: err.message || 'ollama call failed' };
  }
}

/* ─── public API ─────────────────────────────────────────────── */
async function checkRelevance(postText, { allowOllama = true } = {}) {
  const text = String(postText || '').trim();
  if (!text) {
    return { is_bsk: false, confidence: 0, stance: 'unknown', target: 'unrelated', topic: '', reason: 'empty text' };
  }

  // 1. Heuristic fast-path
  const heur = heuristicMatch(text);
  if (heur.matched && heur.strength === 'hard') {
    return {
      is_bsk: true,
      confidence: 0.95,
      stance: 'unknown',
      target: 'iraq_security',
      topic: 'name match',
      reason: `Matched token "${heur.token}"`,
      heuristic: true,
    };
  }

  // 2. Ollama gate (skip on demand for speed-only runs)
  if (!allowOllama) {
    return heur.matched
      ? { is_bsk: true, confidence: 0.55, stance: 'unknown', target: 'iraq_security', topic: 'soft match', reason: `Soft token "${heur.token}"`, heuristic: true }
      : { is_bsk: false, confidence: 0.05, stance: 'unknown', target: 'unrelated', topic: '', reason: 'no token, ollama skipped', heuristic: true };
  }

  const llm = await askOllama(text);
  if (!llm || llm.__error) {
    return heur.matched
      ? { is_bsk: true, confidence: 0.5, stance: 'unknown', target: 'iraq_security', topic: 'soft match (ollama down)', reason: `Ollama unreachable; soft heuristic on "${heur.token}"`, heuristic: true, ollama_error: llm?.__error }
      : { is_bsk: false, confidence: 0.1, stance: 'unknown', target: 'unrelated', topic: '', reason: 'no match + ollama unreachable', heuristic: true, ollama_error: llm?.__error };
  }

  // Sanitise LLM output
  return {
    is_bsk:     !!llm.is_bsk,
    confidence: Math.max(0, Math.min(1, Number(llm.confidence) || 0)),
    stance:     ['positive', 'negative', 'neutral', 'unknown'].includes(llm.stance) ? llm.stance : 'unknown',
    target:     ['president_iraq', 'pm_sudani', 'iraq_security', 'unrelated'].includes(llm.target) ? llm.target : 'unrelated',
    topic:      String(llm.topic || '').slice(0, 80),
    reason:     String(llm.reason || '').slice(0, 200),
    heuristic:  false,
  };
}

module.exports = {
  checkRelevance,
  heuristicMatch,
  HARD_BSK_TOKENS,
  SOFT_BSK_TOKENS,
};
