// YaYa's memory: the child's confirmed words, and nothing else. Stored only in this browser.
//
// THE WALL: this module must never import brain.js, and nothing a model wrote may be passed to
// addChildWords(). teach.js passes the child's own text only. tests/yaya.test.mjs checks the imports.

const KEY = "yaya_data_v1";

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "null");
    if (d && Array.isArray(d.entries)) return d;
  } catch (e) { /* ignore */ }
  return { consent_at: null, entries: [], hints: {} };
}
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
const now = () => new Date().toISOString().slice(0, 19) + "Z";
const uid = () => Math.random().toString(16).slice(2, 10);

export const hasConsent = () => !!load().consent_at;
export function giveConsent() { const d = load(); if (!d.consent_at) { d.consent_at = now(); save(d); } }

/** kind: "explain" (taught YaYa) or "apply" (new example). text = the child's confirmed words. */
export function addChildWords(lesson, kind, text, verdict, covered, hintsUsed) {
  const entry = { id: uid(), lesson, kind, text: String(text).trim(), verdict, covered: [...covered], hints_used: hintsUsed, source: "child_confirmed", created_at: now() };
  const d = load(); d.entries.push(entry); save(d);
  return entry;
}
export const entries = (lesson = null) => load().entries.filter((e) => !lesson || e.lesson === lesson);
export function deleteEntry(id) { const d = load(); const n = d.entries.length; d.entries = d.entries.filter((e) => e.id !== id); save(d); return d.entries.length < n; }
export function deleteAll() { const d = load(); d.entries = []; d.hints = {}; save(d); }
export const hintLevel = (lesson) => load().hints[lesson] || 0;
export function bumpHint(lesson) { const d = load(); d.hints[lesson] = (d.hints[lesson] || 0) + 1; save(d); return d.hints[lesson]; }
export const exportAll = () => load();
