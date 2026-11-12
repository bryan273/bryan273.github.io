// The "big brain": checks and asks. It can read but it can never write to memory.
// This module must not import memory.js. Two brains: DeepSeek (real model) and a keyword demo brain (no key).

import { stageOf } from "./stages.js";

const CFG_KEY = "yaya_cfg_v1";
export const DEFAULT_CFG = { key: "", base: "https://api.deepseek.com", model: "deepseek-chat" };

export function getCfg() {
  try { return { ...DEFAULT_CFG, ...(JSON.parse(localStorage.getItem(CFG_KEY) || "{}")) }; } catch (e) { return { ...DEFAULT_CFG }; }
}
export function setCfg(c) { localStorage.setItem(CFG_KEY, JSON.stringify({ ...getCfg(), ...c })); }

export class BrainError extends Error {}

const SYSTEM_CHECK = `You are the checking brain of Sprout, a toy that a child or teenager teaches (the AUDIENCE line at the end says which age).
You get the lesson's reference key points (teacher-reviewed, with ids), the child's explanation, and what the child already taught Sprout.
Judge ONLY the child's explanation against the key points. Be fair to short or simple wording.
Return JSON: {"verdict": "correct"|"partial"|"wrong"|"unclear", "covered": [ids of key points the child's words actually express], "wrong_claims": [short strings], "followup": "..."}.
Rules:
- "wrong" if ANY part of the child's explanation contradicts the key points (for example, saying the vine's "feet" are like human feet that walk). Even if other parts are right, put the contradiction in wrong_claims and use verdict "wrong".
- "unclear" if you cannot tell what the child means (for example speech-recognition errors).
- "correct" only if every key point is covered by this explanation together with what the child taught before.
- followup (unless the AUDIENCE rules below say otherwise): ONE short question asking for the reason or the missing link of ONE key point that is not covered yet. Never state the answer or copy a key point. Use the child's language, at most 25 words. If everything is covered, followup is an empty string.`;

const SYSTEM_ASK = `You are Sprout, a toy that knows ONLY the numbered memory entries below. They are things the child taught you.
Answer the question using only them. Do not use any other knowledge, even if you know the answer.
Return JSON: {"can_answer": true|false, "answer": "...", "cites": [entry ids you used]}.
If the entries do not contain what is needed, can_answer is false and answer is an empty string.
Keep the child's own wording where possible. Short. Same language as the question.`;

const SYSTEM_SUPPORT = `Check whether ANSWER is fully supported by the CITED entries and uses no outside facts.
Return JSON: {"supported": true|false}.`;

const SYSTEM_APPLY = `You judge a learner's answer to a new-situation question about a lesson.
You get the question, a rubric (what a good answer contains) and the child's answer.
Return JSON: {"verdict": "good"|"partial"|"wrong"|"unclear", "followup": "..."}.
followup: one short guiding question that does not give the answer (empty if verdict is good). Use the child's language. Accept other reasoning that follows the rubric's logic.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class DeepSeekBrain {
  // url: where to POST; on Vercel it is the server proxy /api/chat, which holds the key (so no key sits in the browser)
  constructor(cfg, url) { this.cfg = cfg; this.url = url || `${cfg.base.replace(/\/$/, "")}/chat/completions`; this.name = "deepseek"; }
  async chat(system, payload) {
    const body = {
      model: this.cfg.model, temperature: 0, response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, { role: "user", content: JSON.stringify(payload) }],
    };
    let last = "unknown";
    for (let i = 0; i < 3; i++) {
      try {
        const headers = { "Content-Type": "application/json" };
        if (this.cfg.key) headers.Authorization = `Bearer ${this.cfg.key}`;
        const r = await fetch(this.url, { method: "POST", headers, body: JSON.stringify(body) });
        if (r.status === 401) throw new BrainError("API key rejected (401)");
        if ([429, 500, 502, 503, 504].includes(r.status)) { last = "HTTP " + r.status; await sleep(1200 * (i + 1)); continue; }
        if (!r.ok) throw new BrainError("HTTP " + r.status);
        const j = await r.json();
        return JSON.parse(j.choices[0].message.content);
      } catch (e) {
        if (e instanceof BrainError) throw e;
        last = String(e.message || e).slice(0, 100);
        await sleep(800 * (i + 1));
      }
    }
    throw new BrainError(last);
  }
  check(lesson, text, priorTexts, lang, stage = "grow") {
    return this.chat(SYSTEM_CHECK + "\n" + stageOf(stage).brain, { lesson: lesson.title.zh, key_points: lesson.points.map((p) => ({ id: p.id, text: p.text })), taught_before: priorTexts, child_explanation: text, language: lang });
  }
  ask(question, entries, lang) { return this.chat(SYSTEM_ASK, { memory: entries.map((e) => ({ id: e.id, text: e.text })), question, language: lang }); }
  async supported(answer, citedTexts) { const d = await this.chat(SYSTEM_SUPPORT, { answer, cited: citedTexts }); return !!d.supported; }
  judgeApply(lesson, text, lang, stage = "grow") {
    const ns = lesson.new_situation;
    return this.chat(SYSTEM_APPLY + "\n" + stageOf(stage).brain, { question: ns.prompt.zh, rubric: ns.rubric, child_answer: text, language: lang });
  }
}

// ---------------------------------------------------------------- offline demo brain
const hits = (text, kws) => kws.filter((k) => text.includes(k)).length;
const enough = (text, p) => hits(text, p.keywords) >= Math.max(1, Math.ceil(p.keywords.length / 2));
function negated(text, pat) {
  const m = new RegExp(pat).exec(text);
  return !!m && /(不是|不会|不|没有|并不)[^，。,.]{0,4}$/.test(text.slice(0, m.index + 1));
}
const bigrams = (s) => { s = s.replace(/[\s\p{P}]/gu, ""); const o = new Set(); for (let i = 0; i < s.length - 1; i++) o.add(s.slice(i, i + 2)); return o; };

class MockBrain {
  constructor() { this.name = "mock"; }
  async check(lesson, text, priorTexts) {
    const pts = lesson.points;
    const covered = pts.filter((p) => enough(text, p)).map((p) => p.id);
    const wrong = (lesson.misconceptions || []).filter((m) => new RegExp(m.pattern).test(text) && !negated(text, m.pattern)).map((m) => m.note);
    const before = new Set();
    priorTexts.forEach((t) => pts.forEach((p) => enough(t, p) && before.add(p.id)));
    const total = new Set([...before, ...covered]);
    const len = text.trim().length;
    let verdict;
    if (wrong.length) verdict = "wrong";
    else if (len < 4 || (!covered.length && len < 8)) verdict = "unclear";
    else if (total.size === pts.length) verdict = "correct";
    else if (covered.length) verdict = "partial";
    else verdict = "unclear";
    const missing = pts.filter((p) => !total.has(p.id));
    return { verdict, covered, wrong_claims: wrong, followup: missing.length ? missing[0].probe : "" };
  }
  async ask(question, entries) {
    const qb = bigrams(question);
    let best = null, score = 0;
    for (const e of entries) { let s = 0; bigrams(e.text).forEach((b) => qb.has(b) && s++); if (s > score) { best = e; score = s; } }
    if (!best || score < 2) return { can_answer: false, answer: "", cites: [] };
    return { can_answer: true, answer: best.text, cites: [best.id] };
  }
  async supported(answer, citedTexts) { return citedTexts.some((t) => answer.trim() && t.includes(answer.trim())); }
  async judgeApply(lesson, text, lang) {
    const ns = lesson.new_situation, h = hits(text, ns.keywords), hint = ns.hint[lang === "en" ? "en" : "zh"];
    if (text.trim().length < 4) return { verdict: "unclear", followup: "" };
    if (h >= 3) return { verdict: "good", followup: "" };
    if (h >= 1) return { verdict: "partial", followup: hint };
    return { verdict: "wrong", followup: hint };
  }
}

// Server proxy (Vercel /api/chat). It exists only on hosts that deploy the api/ folder; on plain static hosts we fall back.
// On GitHub Pages (static only) the proxy lives on the Vercel deployment; everywhere else it is same-origin.
const PROXY_URL = typeof location !== "undefined" && location.hostname.endsWith("github.io")
  ? "https://sprout-ai-learn.vercel.app/api/chat"
  : "/api/chat";
let proxyModel = "";
export const proxyActive = () => !!proxyModel;
export async function detectProxy() {
  try {
    const r = await fetch(PROXY_URL, { cache: "no-store" });
    const j = r.ok ? await r.json() : null;
    proxyModel = j && j.ok ? String(j.model || "ai") : "";
  } catch (e) { proxyModel = ""; }
  return proxyActive();
}
export const brainLabel = () => (getCfg().key.trim() ? getCfg().model : proxyModel);

export function getBrain() {
  const c = getCfg();
  if (c.key.trim()) return new DeepSeekBrain(c);
  if (proxyModel) return new DeepSeekBrain({ ...c, key: "" }, PROXY_URL);
  return new MockBrain();
}
