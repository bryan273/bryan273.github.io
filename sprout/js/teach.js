// One teaching turn. Sprout's spoken reply is assembled HERE from the child's own words and one question.
// The big model's text is never shown as something Sprout "knows".
import { LESSONS } from "./lessons.js";
import { getBrain } from "./brain.js";
import * as memory from "./memory.js";

const VERDICTS = ["correct", "partial", "wrong", "unclear"];
const msg = (lang, zh, en) => (lang === "en" ? en : zh);
// Sprout repeats only the start of long answers so the reply stays short for a child; the full words are what is stored.
const quote = (t) => { t = String(t).trim().replace(/[。．.!！?？,，;；\s]+$/u, ""); return t.length > 26 ? t.slice(0, 26) + "…" : t; };
export const getLesson = (id) => LESSONS.find((l) => l.id === id);

export function publicLesson(l, lang) {
  const en = lang === "en";
  return {
    id: l.id, band: l.band || "grow", age: l.age || "7-11", title: l.title[en ? "en" : "zh"], subject: l.subject[en ? "en" : "zh"], grade: l.grade, intro: l.intro[en ? "en" : "zh"],
    points: l.points.map((p) => ({ id: p.id, text: en ? (p.text_en || p.text) : p.text, short: p.short[en ? "en" : "zh"] })),
    exam: l.exam.map((q) => ({ q: q[en ? "en" : "zh"], point: q.point })),
    new_prompt: l.new_situation.prompt[en ? "en" : "zh"], source_note: l.source_note, demo: l.demo,
  };
}

function firstQuestion(q) {
  q = (q || "").trim();
  const m = /^(.*?[？?])/.exec(q);
  return (m ? m[1] : q).slice(0, 200);
}
function coveredBefore(lessonId) {
  const s = new Set();
  memory.entries(lessonId).forEach((e) => e.kind === "explain" && e.covered.forEach((c) => s.add(c)));
  return s;
}

export async function teach(lessonId, text, lang = "zh", stage = "grow") {
  const lesson = getLesson(lessonId);
  const ids = new Set(lesson.points.map((p) => p.id));
  const prior = memory.entries(lessonId).filter((e) => e.kind === "explain").map((e) => e.text);
  const res = await getBrain().check(lesson, text, prior, lang, stage);
  let verdict = VERDICTS.includes(res.verdict) ? res.verdict : "unclear";
  // safety net: if the model lists any wrong claim, never store the child's words as understood
  if ((res.wrong_claims || []).filter(Boolean).length) verdict = "wrong";
  const covered = (res.covered || []).filter((c) => ids.has(c));
  const total = new Set([...coveredBefore(lessonId), ...covered]);
  const missing = lesson.points.filter((p) => !total.has(p.id));
  let followup = firstQuestion(res.followup);
  if (missing.length && !followup) followup = missing[0].probe;
  if (!missing.length) followup = "";
  const hints = memory.hintLevel(lessonId);

  let stored = null;
  if (verdict === "correct" || verdict === "partial") {
    // only the child's own text is stored, never anything the model wrote
    stored = memory.addChildWords(lessonId, "explain", text, verdict, covered, hints);
  }
  let say;
  if (verdict === "wrong") say = msg(lang, `嗯……我有点糊涂。你说「${quote(text)}」，可是我好像不是这样想的。我先不把它记下来。你再想想？${followup}`, `Hmm... I am a bit confused. You said "${quote(text)}", but that does not seem right to me. I will not remember it yet. Think again? ${followup}`);
  else if (verdict === "unclear") say = msg(lang, "我没太听明白。你可以多说几句，用自己的话再讲一遍吗？", "I did not quite get that. Can you say it again in your own words, with a few more sentences?");
  else if (followup) say = msg(lang, `我听懂了你说的：「${quote(text)}」。我记下来了。${followup}`, `I understood what you said: "${quote(text)}". I wrote it down. ${followup}`);
  else say = msg(lang, `我听懂了你说的：「${quote(text)}」。我记下来了。我都明白啦！我们来试一个新例子吧？`, `I understood: "${quote(text)}". I wrote it down. I get it now! Shall we try a new example?`);
  return { verdict, yaya_say: say, followup, covered: [...total].sort(), missing: missing.map((p) => p.id), stored, done: !missing.length && verdict !== "wrong" };
}

/** Help ladder, each step reveals a bit more. 1: your own words. 2: the question. 3: the key card. */
export function hint(lessonId, lang = "zh", stage = "grow") {
  const lesson = getLesson(lessonId);
  const lvl = memory.bumpHint(lessonId);
  const mine = memory.entries(lessonId).filter((e) => e.kind === "explain");
  const missing = lesson.points.filter((p) => !coveredBefore(lessonId).has(p.id));
  // seed stage: a small child cannot use a ladder of questions, so the first tap shows the picture card
  if (stage === "seed" && missing.length) return { level: 3, text: msg(lang, "看看这张图，你来说一说：", "Look at this picture and tell me:"), card: missing[0].id };
  if (lvl === 1 && mine.length) return { level: 1, text: msg(lang, `你刚才教过我：「${mine[mine.length - 1].text}」。接着想想看？`, `You taught me: "${mine[mine.length - 1].text}". What comes next?`) };
  if (lvl <= 2 && missing.length) return { level: Math.min(lvl, 2), text: missing[0].probe };
  if (missing.length) return { level: 3, text: msg(lang, "再看一眼要点卡片，找找答案：", "Look at the key card again:"), card: missing[0].id };
  return { level: lvl, text: msg(lang, "你已经都讲到啦！", "You have covered everything!") };
}

export async function newExample(lessonId, text, lang = "zh", stage = "grow") {
  const lesson = getLesson(lessonId);
  const res = await getBrain().judgeApply(lesson, text, lang, stage);
  const verdict = ["good", "partial", "wrong", "unclear"].includes(res.verdict) ? res.verdict : "unclear";
  const follow = firstQuestion(res.followup) || lesson.new_situation.hint[lang === "en" ? "en" : "zh"];
  let stored = null;
  if (verdict === "good" || verdict === "partial") stored = memory.addChildWords(lessonId, "apply", text, verdict, [], memory.hintLevel(lessonId));
  let say;
  if (verdict === "good") say = msg(lang, `我懂啦！你用新例子也能说清楚：「${quote(text)}」。我记下来了。`, `I get it! You explained the new example too: "${quote(text)}". I wrote it down.`);
  else if (verdict === "partial") say = msg(lang, `你说对了一部分：「${quote(text)}」。我记下来了。再想想：${follow}`, `Part of it is right: "${quote(text)}". I wrote it down. Think more: ${follow}`);
  else if (verdict === "wrong") say = msg(lang, `我不太确定这样对不对。我先不记。${follow}`, `I am not sure that is right. I will not remember it yet. ${follow}`);
  else say = msg(lang, "我没太听明白，可以再说一遍吗？", "I did not quite get that. Can you say it again?");
  return { verdict, yaya_say: say, stored };
}

/** Quiz Sprout: it may answer only from memory. Cites must exist AND a second pass must find the answer supported. */
export async function ask(lessonId, question, lang = "zh") {
  const es = memory.entries(lessonId);
  const nothing = { can_answer: false, yaya_say: msg(lang, "这个你还没教过我呢。你教教我吧！", "You have not taught me that yet. Teach me!"), cites: [] };
  if (!es.length) return nothing;
  const brain = getBrain();
  const res = await brain.ask(question, es, lang);
  const byId = Object.fromEntries(es.map((e) => [e.id, e]));
  const cites = (res.cites || []).filter((c) => byId[c]);
  const answer = (res.answer || "").trim();
  if (!(res.can_answer && answer && cites.length)) return nothing;
  if (!(await brain.supported(answer, cites.map((c) => byId[c].text)))) return nothing;
  return { can_answer: true, yaya_say: msg(lang, `我记得你教过我：${answer}`, `I remember you taught me: ${answer}`), cites: cites.map((c) => ({ id: c, text: byId[c].text })) };
}

export function summary(lessonId, lang = "zh") {
  const lesson = getLesson(lessonId), pub = publicLesson(lesson, lang);
  const es = memory.entries(lessonId);
  const expl = es.filter((e) => e.kind === "explain"), app = es.filter((e) => e.kind === "apply");
  const covered = new Set();
  expl.forEach((e) => e.covered.forEach((c) => covered.add(c)));
  return {
    lesson: pub.title,
    points: pub.points.map((p) => ({ ...p, covered: covered.has(p.id) })),
    child_words: expl.map((e) => ({ id: e.id, text: e.text, verdict: e.verdict, created_at: e.created_at })),
    new_example: app.map((e) => ({ id: e.id, text: e.text, verdict: e.verdict })),
    hints_used: memory.hintLevel(lessonId),
    to_check: es.filter((e) => e.verdict === "partial").map((e) => e.text),
    note: msg(lang, "「已覆盖」表示芽伴听懂了孩子说的这个要点，不等于孩子已经掌握。请对照孩子的原话，并看新例子。",
      "\"Covered\" means Sprout understood that point in the child's words. It does not mean the child has mastered it. Read the words and the new example."),
  };
}

/** Sprout's exam: every question is answered from memory only. Shows what the child has (and has not) taught. */
export async function exam(lessonId, lang = "zh") {
  const les = getLesson(lessonId);
  // questions are independent, so ask them in parallel (a slow model would otherwise take minutes)
  const results = await Promise.all(les.exam.map(async (q) => {
    const r = await ask(lessonId, q[lang === "en" ? "en" : "zh"], lang);
    return { q: q[lang === "en" ? "en" : "zh"], point: q.point, can_answer: r.can_answer, answer: r.can_answer ? r.cites.map((c) => c.text).join(" ") : "" };
  }));
  return { results, score: results.filter((r) => r.can_answer).length, total: results.length };
}

/** How much Sprout has grown: from the points the child has taught, across all lessons (effort and coverage, not a grade). */
export function growth() {
  const all = memory.entries();
  const pts = new Set();
  all.forEach((e) => e.kind === "explain" && e.covered.forEach((c) => pts.add(e.lesson + ":" + c)));
  const n = pts.size;
  return { points: n, stars: all.length, stage: n >= 10 ? 3 : n >= 6 ? 2 : n >= 2 ? 1 : 0 };
}
