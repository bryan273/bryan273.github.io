import { LESSONS } from "./lessons.js";
import * as memory from "./memory.js";
import * as teach from "./teach.js";
import { getCfg, setCfg, getBrain, DEFAULT_CFG, detectProxy, proxyActive, brainLabel } from "./brain.js";
import { mascot, scene } from "./art.js";
import { STAGES, STAGE_ORDER, DEFAULT_STAGE, stageOf } from "./stages.js";

// Words that change with the age stage. Everything else comes from I18N below.
const STAGE_TXT = {
  seed: {
    zh: { heroSay: "我是芽伴！你来教教我吧！", greet: "你好！我什么都不会。和爸爸妈妈一起教我吧！", micHint: "按一下话筒，说一句话", startTeach: "我看懂啦！教芽伴 ▶", tabExam: "📝 考考芽伴", stageNote: "👨‍👩‍👧 请家长陪孩子一起玩，孩子说一句话就好。", sleepy: "芽伴困了，要睡觉啦。明天再来教我吧！😴" },
    en: { heroSay: "I am Sprout! Come and teach me!", greet: "Hi! I do not know anything. Teach me together with mum or dad!", micHint: "Tap the mic and say one sentence", startTeach: "I see it! Teach Sprout ▶", tabExam: "📝 Test Sprout", stageNote: "👨‍👩‍👧 A parent plays along. One short sentence is enough.", sleepy: "Sprout is sleepy and goes to bed. Come back tomorrow! 😴" },
  },
  teen: {
    zh: { heroSay: "能讲给十岁的孩子听明白，才算真会。", greet: "我只懂你告诉我的。就像讲给十岁的弟弟妹妹那样，讲给我听。", micHint: "直接打字，或点话筒说", startTeach: "我搞懂了，开始讲 ▶", tabExam: "🧠 挑战：考考我", parentTitle: "我的笔记", stageNote: "✍️ 讲原因，不只是名词。我会追问为什么、如果……会怎样。" },
    en: { heroSay: "If you can explain it to a 10-year-old, you know it.", greet: "I only know what you tell me. Explain it as if I were a 10-year-old.", micHint: "Type, or tap the mic and speak", startTeach: "Got it. Start explaining ▶", tabExam: "🧠 Challenge me", parentTitle: "My notes", stageNote: "✍️ Give reasons, not just names. I will ask why and what if." },
  },
};

const I18N = {
  zh: {
    heroSay: "你来当老师！教教我吧！", steps: [["📖", "学"], ["🗣️", "教"], ["❓", "答"], ["🧪", "试"]],
    stepper: ["📖 学", "🗣️ 教芽伴", "🧪 新例子", "🏆 考考我"],
    consentBtn: "👨‍👩‍👧 家长同意", consentOk: "✅ 家长已同意", consentT: "家长同意",
    consent: "孩子说的话或打的字，会发送到云端 AI 服务（DeepSeek）检查。记录只保存在这台设备的浏览器里，家长可随时查看、删除、导出。",
    priv: ["🧒 记忆只存在这台设备", "🔒 大模型只检查、提问，不写入记忆", "👨‍👩‍👧 家长可查看、删除、导出"], yes: "同意", no: "取消",
    grown: (n, s) => `芽伴学会了 ${n} 个知识点 · ⭐ ${s}`,
    startTeach: "学会了！教芽伴 ▶", stuck: "卡住了", send: "发送", demo: "示范",
    micHint: "按住话筒说话，说完检查文字再发送", micHintOn: "正在听……说完再点一下",
    brainT: "芽伴的脑袋", brainNote: "你教会的知识点会亮起来。",
    tryNew: "🧪 试一个新例子", ask: "问芽伴", askPh: "问芽伴一个问题……", typePh: "用自己的话讲给芽伴听……",
    tabAsk: "❓ 问芽伴", tabExam: "📝 芽伴考试", runExam: "开始考试", examNo: "还没学", examYes: "芽伴答对了",
    greet: "你好！我什么都不会，你来教教我吧！", newIntro: "新问题！你来教我：", thinking: "嗯……我想想……",
    askHello: "你教过我的，我才会答！问问看吧。",
    parentTitle: "家长页", back: "◀ 返回", cov: "讲到的要点", words: "孩子的原话", newEx: "新例子的回答", check: "请家长核对", mem: "记忆条目",
    del: "删除", delAll: "删除全部记录", exp: "导出 JSON", none: "（还没有）", hintsUsed: "提示次数",
    netErr: "网络或 AI 出问题了。你的话还在，再点一次发送。", cardHint: "看看这张卡片：", delConfirm: "确定删除全部记录？", noMic: "这个浏览器不能语音输入，请点 ⌨️ 打字。",
    lessonLbl: "课文", youTaught: "你教的", applied: "新例子", partial: "部分", correct: "正确", good: "很好", unclear: "不清楚", wrong: "待核对",
    setTitle: "⚙️ AI 设置", setNote: "密钥只存在这台设备的浏览器里，不会上传。留空则使用离线演示脑（很弱）。", setKey: "DeepSeek API 密钥", setTest: "测试", setClear: "清除", setSave: "保存",
    testOk: "连接成功", testBad: "连接失败：", mockBadge: "离线演示脑", gradeFmt: (g) => g + "年级", scoreT: (a, b) => `🏆 ${a} / ${b}`,
    noteSrc: "课文要点为原创改写，尚未经教师审核。"
  },
  en: {
    heroSay: "You are the teacher! Teach me!", steps: [["📖", "Learn"], ["🗣️", "Teach"], ["❓", "Answer"], ["🧪", "Try"]],
    stepper: ["📖 Learn", "🗣️ Teach Sprout", "🧪 New example", "🏆 Quiz me"],
    consentBtn: "👨‍👩‍👧 Parent OK", consentOk: "✅ Parent agreed", consentT: "Parent consent",
    consent: "What the child says or types is sent to a cloud AI service (DeepSeek) to be checked. Records stay only in this device's browser. Parents can view, delete and export them any time.",
    priv: ["🧒 Memory stays on this device", "🔒 The big model only checks and asks", "👨‍👩‍👧 Parents can view, delete, export"], yes: "I agree", no: "Cancel",
    grown: (n, s) => `Sprout learned ${n} points · ⭐ ${s}`,
    startTeach: "I learned it! Teach Sprout ▶", stuck: "Stuck", send: "Send", demo: "Demo",
    micHint: "Tap the mic and speak, then check the text and send", micHintOn: "Listening... tap again when done",
    brainT: "Sprout's brain", brainNote: "Points you taught light up.",
    tryNew: "🧪 Try a new example", ask: "Ask Sprout", askPh: "Ask Sprout a question...", typePh: "Explain it to Sprout in your own words...",
    tabAsk: "❓ Ask Sprout", tabExam: "📝 Sprout's exam", runExam: "Start the exam", examNo: "not learned yet", examYes: "Sprout knows it",
    greet: "Hi! I do not know anything. Please teach me!", newIntro: "New question! Teach me: ", thinking: "Hmm... let me think...",
    askHello: "I only know what you taught me. Try asking!",
    parentTitle: "Parent page", back: "◀ Back", cov: "Points covered", words: "The child's own words", newEx: "Answer to the new example", check: "Adult to check", mem: "Memory entries",
    del: "Delete", delAll: "Delete all records", exp: "Export JSON", none: "(none yet)", hintsUsed: "Hints used",
    netErr: "Network or AI problem. Your words are still here. Press Send again.", cardHint: "Look at this card: ", delConfirm: "Delete all records?", noMic: "This browser has no voice input. Tap ⌨️ to type.",
    lessonLbl: "Lesson", youTaught: "You taught", applied: "New example", partial: "partial", correct: "correct", good: "good", unclear: "unclear", wrong: "to check",
    setTitle: "⚙️ AI settings", setNote: "The key stays only in this device's browser and is never uploaded. Leave empty for the offline demo brain (very weak).", setKey: "DeepSeek API key", setTest: "Test", setClear: "Clear", setSave: "Save",
    testOk: "Connected", testBad: "Failed: ", mockBadge: "offline demo brain", gradeFmt: (g) => "Grade " + g, scoreT: (a, b) => `🏆 ${a} / ${b}`,
    noteSrc: "Key points are original paraphrases, not yet teacher-reviewed."
  }
};

const $ = (s) => document.querySelector(s);
const savedBand = (() => { try { return localStorage.getItem("sprout_band"); } catch (e) { return null; } })();
const st = { band: STAGES[savedBand] ? savedBand : DEFAULT_STAGE, timer: null, sleepy: false, lang: localStorage.getItem("yaya_lang") || "zh", lesson: null, raw: null, inLesson: false, stage: 0, card: 0, speak: localStorage.getItem("yaya_speak") !== "0", done: false, newMode: false, demoI: 0, typing: false, rec: null, seen: new Set() };
const T = (k) => STAGE_TXT[st.band]?.[st.lang]?.[k] ?? I18N[st.lang][k];
const tagOf = (l) => `${l.subject} · ${l.band === "seed" ? (st.lang === "en" ? "Ages " : "") + l.age + (st.lang === "en" ? "" : "岁") : T("gradeFmt")(l.grade)}`;
const pub = (l) => teach.publicLesson(l, st.lang);
const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/* ---------- mascot control */
function setMood(box, mood) { box.innerHTML = mascot(mood, teach.growth().stage); }
function mood(m, box = $("#mascotBox")) { setMood(box, m); }

function renderStagePick() {
  $("#stagePick").innerHTML = STAGE_ORDER.map((id) => { const s = STAGES[id]; return `<button class="stg ${id === st.band ? "on" : ""}" data-band="${id}"><b>${s.icon} ${s.name[st.lang]}</b><small>${s.tag[st.lang]}</small></button>`; }).join("");
  $("#stagePick").querySelectorAll(".stg").forEach((b) => b.onclick = () => setBand(b.dataset.band));
}
function setBand(id) {
  st.band = id; try { localStorage.setItem("sprout_band", id); } catch (e) { /* ignore */ }
  clearTimeout(st.timer); st.sleepy = false; st.inLesson = false; st.lesson = null; st.raw = null;
  applyI18n(); loadHome(); show("home");
}
function applyI18n() {
  document.body.className = "stage-" + st.band;
  renderStagePick();
  const note = T("stageNote"); $("#stageNote").textContent = typeof note === "string" ? note : ""; $("#stageNote").classList.toggle("hidden", typeof note !== "string");
  document.documentElement.lang = st.lang;
  document.querySelectorAll("[data-i]").forEach((el) => { const v = T(el.dataset.i); if (typeof v === "string") el.textContent = v; });
  $("#langBtn").textContent = st.lang === "zh" ? "EN" : "中文";
  $("#speakBtn").textContent = st.speak ? "🔊" : "🔇";
  $("#input").placeholder = T("typePh"); $("#quizInput").placeholder = T("askPh");
  $("#stepsRow").innerHTML = T("steps").map(([i, t]) => `<span><b>${i}</b>${t}</span>`).join("");
  $("#privList").innerHTML = T("priv").map((p) => `<li>${p}</li>`).join("");
  $("#tabAsk").textContent = T("tabAsk"); $("#tabExam").textContent = T("tabExam"); $("#runExam").textContent = T("runExam");
  $("#startTeach").textContent = T("startTeach"); $("#toNew").textContent = T("tryNew");
  $("#micHint").textContent = T("micHint");
  $("#heroBubble").textContent = T("heroSay");
  refreshBadge(); refreshHeader();
}
function refreshBadge() {
  const b = $("#brain"), cfg = getCfg(), mock = !cfg.key.trim() && !proxyActive();
  b.textContent = mock ? T("mockBadge") : "AI: " + brainLabel(); b.classList.toggle("mock", mock);
}
function refreshHeader() {
  const g = teach.growth();
  $("#stars").textContent = "⭐ " + g.stars;
  $("#grown").textContent = T("grown")(g.points, g.stars);
  $("#consentBtn").textContent = memory.hasConsent() ? T("consentOk") : T("consentBtn");
  $("#heroMascot").innerHTML = mascot("idle", g.stage);
}
function show(view) { ["home", "lesson", "parent"].forEach((v) => $("#" + v).classList.toggle("hidden", v !== view)); if (view === "home") { clearTimeout(st.timer); st.sleepy = false; } window.scrollTo(0, 0); }
// Seed stage: a short session. After maxMinutes the character "goes to bed" (screen-time limit, also need N15).
function startTimer() {
  clearTimeout(st.timer); st.sleepy = false;
  const m = stageOf(st.band).maxMinutes;
  if (m) st.timer = setTimeout(() => { st.sleepy = true; mood("think"); $("#bubble").textContent = T("sleepy"); say(T("sleepy")); }, m * 60000);
}

/* ---------- speech */
function say(text) {
  if (!st.speak || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = st.lang === "zh" ? "zh-CN" : "en-US"; u.rate = 0.95; u.pitch = 1.3;
  speechSynthesis.speak(u);
}
function listen(btn, target, onState) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { revealTyping(true); alert(T("noMic")); return; }
  if (st.rec) { st.rec.stop(); return; }
  const rec = new SR(); rec.lang = st.lang === "zh" ? "zh-CN" : "en-US"; rec.interimResults = true; rec.continuous = false;
  st.rec = rec; btn.classList.add("rec"); onState?.(true);
  rec.onresult = (e) => { target.value = Array.from(e.results).map((r) => r[0].transcript).join(""); };
  const end = () => { btn.classList.remove("rec"); st.rec = null; onState?.(false); if (target.value && target.id === "input") revealTyping(true); };
  rec.onend = end; rec.onerror = end;
  rec.start();
}
function revealTyping(on) { st.typing = on; $("#typeRow").classList.toggle("hidden", !on); }

function confetti() {
  if (!stageOf(st.band).confetti) return;
  const box = $("#confetti"), em = ["🎉", "⭐", "🌟", "🌱", "✨", "🎈"];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("span"); s.textContent = em[i % em.length];
    s.style.left = Math.random() * 100 + "vw"; s.style.animationDelay = Math.random() * 0.6 + "s"; s.style.fontSize = 18 + Math.random() * 18 + "px";
    box.appendChild(s); setTimeout(() => s.remove(), 3200);
  }
}

/* ---------- home */
function loadHome() {
  const box = $("#lessonList"); box.innerHTML = "";
  LESSONS.filter((x) => (x.band || "grow") === st.band).forEach((raw) => {
    const l = pub(raw), c = document.createElement("div");
    c.className = "lcard";
    c.innerHTML = `<div class="art">${scene(raw.id, "cover", st.lang)}</div><div class="meta"><span class="chip"></span></div><h3></h3>`;
    c.querySelector(".chip").textContent = tagOf(l);
    c.querySelector("h3").textContent = l.title;
    c.onclick = () => openLesson(raw.id);
    box.appendChild(c);
  });
  refreshHeader();
}

function openLesson(id) {
  if (!memory.hasConsent()) { $("#consentModal").classList.remove("hidden"); st.pending = id; return; }
  const raw = teach.getLesson(id), l = pub(raw);
  st.raw = raw; st.lesson = l; st.done = false; st.inLesson = true; st.card = 0; st.demoI = 0; st.seen = new Set(teach.summary(id, st.lang).points.filter((p) => p.covered).map((p) => p.id));
  $("#lessonTitle").textContent = l.title; $("#lessonSub").textContent = tagOf(l);
  startTimer();
  $("#meSaid").classList.add("hidden"); $("#toNew").classList.add("hidden"); $("#banner").classList.add("hidden"); $("#quizCites").innerHTML = ""; $("#examList").innerHTML = ""; $("#examScore").classList.add("hidden");
  $("#input").value = ""; revealTyping(false);
  show("lesson"); setStage(0); drawCard();
}

/* ---------- learn cards */
function drawCard() {
  const p = st.lesson.points, c = p[st.card];
  $("#cardArt").innerHTML = scene(st.raw.id, c.id, st.lang);
  $("#cardText").textContent = c.short;
  $("#dots").innerHTML = p.map((_, i) => `<i class="${i === st.card ? "on" : ""}"></i>`).join("");
  $("#prevCard").style.visibility = st.card ? "visible" : "hidden";
  $("#nextCard").style.visibility = st.card < p.length - 1 ? "visible" : "hidden";
}

/* ---------- stages */
function setStage(n) {
  st.stage = n;
  $("#steps").innerHTML = T("stepper").map((s, i) => `<span class="stp ${i === n ? "on" : i < n ? "done" : ""}" data-n="${i}">${s}</span>`).join("");
  $("#steps").querySelectorAll(".stp").forEach((el) => el.onclick = () => setStage(+el.dataset.n));
  $("#learnPane").classList.toggle("hidden", n !== 0);
  $("#teachPane").classList.toggle("hidden", n !== 1 && n !== 2);
  $("#quizPane").classList.toggle("hidden", n !== 3);
  st.newMode = n === 2;
  if (n === 1 || n === 2) {
    $("#newCard").classList.toggle("hidden", n !== 2);
    if (n === 2) { $("#newArt").innerHTML = scene(st.raw.id, "new", st.lang); $("#newQ").textContent = st.lesson.new_prompt; }
    $("#hintBtn").classList.toggle("hidden", n === 2);
    st.demoI = n === 2 ? 2 : Math.min(st.demoI, 1);
    mood("idle");
    $("#bubble").textContent = n === 2 ? T("newIntro") + st.lesson.new_prompt : T("greet");
    if (n === 2 || !teach.summary(st.raw.id, st.lang).child_words.length) say($("#bubble").textContent);
    if (stageOf(st.band).typing) revealTyping(true); // teens type first; the mic stays available
    drawBrain();
  }
  if (n === 3) { setMood($("#quizMascot"), "idle"); $("#quizBubble").textContent = T("askHello"); showTab("ask"); }
}

function drawBrain(pop) {
  const sm = teach.summary(st.raw.id, st.lang);
  $("#brainGrid").innerHTML = sm.points.map((p) => `<div class="tile ${p.covered ? "" : "locked"}" data-id="${p.id}"><div class="art">${scene(st.raw.id, p.id, st.lang)}</div><small>${esc(st.lesson.points.find((x) => x.id === p.id).short)}</small></div>`).join("");
  if (pop) pop.forEach((id) => { const el = $(`.tile[data-id="${id}"]`); el?.classList.add("pop"); });
  refreshHeader();
}

/* ---------- send */
async function send() {
  const inp = $("#input"), text = inp.value.trim();
  if (!text) return;
  if (st.sleepy) { $("#bubble").textContent = T("sleepy"); return; }
  $("#banner").classList.add("hidden"); $("#sendBtn").disabled = true;
  $("#meSaid").textContent = "🧒 " + text; $("#meSaid").classList.remove("hidden");
  $("#bubble").textContent = T("thinking"); mood("think");
  try {
    const d = st.newMode ? await teach.newExample(st.raw.id, text, st.lang, st.band) : await teach.teach(st.raw.id, text, st.lang, st.band);
    inp.value = ""; revealTyping(stageOf(st.band).typing);
    $("#bubble").textContent = d.yaya_say; say(d.yaya_say);
    const good = ["correct", "partial", "good"].includes(d.verdict);
    mood(d.verdict === "wrong" || d.verdict === "unclear" ? "confused" : d.done || d.verdict === "good" ? "cheer" : good ? "happy" : "idle");
    const newly = (d.covered || []).filter((id) => !st.seen.has(id)); (d.covered || []).forEach((id) => st.seen.add(id));
    drawBrain(newly);
    if (newly.length || d.verdict === "good") confetti();
    if (!st.newMode && d.done && !st.done) { st.done = true; $("#toNew").classList.remove("hidden"); }
    if (st.newMode && d.verdict === "good") { setTimeout(() => setStage(3), 1800); }
  } catch (e) { mood("confused"); $("#bubble").textContent = T("netErr") + " (" + (e.message || e) + ")"; $("#banner").textContent = T("netErr"); $("#banner").classList.remove("hidden"); }
  finally { $("#sendBtn").disabled = false; }
}

function hint() {
  const d = teach.hint(st.raw.id, st.lang, st.band);
  $("#bubble").textContent = d.text; mood("think"); say(d.text);
  if (d.card) { st.card = st.lesson.points.findIndex((p) => p.id === d.card); setStage(0); drawCard(); }
}

/* ---------- quiz + exam */
function showTab(t) {
  $("#askBox").classList.toggle("hidden", t !== "ask"); $("#examBox").classList.toggle("hidden", t !== "exam");
  $("#tabAsk").classList.toggle("on", t === "ask"); $("#tabExam").classList.toggle("on", t === "exam");
}
async function ask() {
  const q = $("#quizInput").value.trim(); if (!q) return;
  $("#quizSend").disabled = true; setMood($("#quizMascot"), "think"); $("#quizBubble").textContent = T("thinking");
  try {
    const d = await teach.ask(st.raw.id, q, st.lang);
    $("#quizInput").value = ""; $("#quizBubble").textContent = d.yaya_say; say(d.yaya_say);
    setMood($("#quizMascot"), d.can_answer ? "happy" : "confused");
    $("#quizCites").innerHTML = (d.cites || []).map((c) => `<div class="cite">🧒 「${esc(c.text)}」</div>`).join("");
  } catch (e) { $("#quizBubble").textContent = T("netErr"); setMood($("#quizMascot"), "confused"); } finally { $("#quizSend").disabled = false; }
}
async function runExam() {
  $("#runExam").disabled = true; $("#examList").innerHTML = ""; $("#examScore").classList.add("hidden");
  try {
    const r = await teach.exam(st.raw.id, st.lang);
    $("#examList").innerHTML = r.results.map((x) => `<div class="ex ${x.can_answer ? "yes" : "no"}"><div class="ic">${x.can_answer ? "✅" : "❓"}</div><div><b>${esc(x.q)}</b><span>${x.can_answer ? "🧒 「" + esc(x.answer) + "」" : T("examNo")}</span></div></div>`).join("");
    $("#examScore").textContent = T("scoreT")(r.score, r.total); $("#examScore").classList.remove("hidden");
    if (r.score === r.total) { confetti(); setMood($("#quizMascot"), "cheer"); }
  } catch (e) { $("#examList").innerHTML = `<div class="banner">${T("netErr")}</div>`; } finally { $("#runExam").disabled = false; }
}

/* ---------- parent page */
function openParent() {
  const base = st.lesson || pub(LESSONS.find((x) => (x.band || "grow") === st.band) || LESSONS[0]);
  show("parent");
  const s = teach.summary(base.id, st.lang), all = memory.entries();
  const opts = LESSONS.map((l) => `<option value="${l.id}" ${l.id === base.id ? "selected" : ""}>${esc(pub(l).title)}</option>`).join("");
  $("#parentBody").innerHTML = `
    <div class="sect"><label>${T("lessonLbl")}: <select id="pl">${opts}</select></label></div>
    <div class="sect"><h3>${T("cov")}</h3>${s.points.map((p) => `<div class="pt"><span>${p.covered ? "✅" : "⬜"}</span><span>${esc(p.text)}</span></div>`).join("")}<p class="note">${T("hintsUsed")}: ${s.hints_used}</p></div>
    <div class="sect"><h3>${T("words")}</h3>${s.child_words.length ? s.child_words.map((w) => `<p>「${esc(w.text)}」</p>`).join("") : `<p class="empty">${T("none")}</p>`}</div>
    <div class="sect"><h3>${T("newEx")}</h3>${s.new_example.length ? s.new_example.map((w) => `<p>「${esc(w.text)}」 <span class="tv-${w.verdict}">${T(w.verdict)}</span></p>`).join("") : `<p class="empty">${T("none")}</p>`}</div>
    <div class="sect"><h3>${T("check")}</h3>${s.to_check.length ? s.to_check.map((w) => `<p>• ${esc(w)}</p>`).join("") : `<p class="empty">${T("none")}</p>`}</div>
    <p class="warn">${esc(s.note)}</p><p class="note">${T("noteSrc")}</p>
    <div class="sect"><h3>${T("mem")} (${all.length})</h3>${all.map((e) => `<div class="m"><span>${esc(e.text)}</span><small>${e.lesson} · ${e.kind} · ${e.created_at} <button class="soft danger" data-del="${e.id}">${T("del")}</button></small></div>`).join("") || `<p class="empty">${T("none")}</p>`}
      <div class="row" style="justify-content:flex-start"><button id="expBtn" class="soft">${T("exp")}</button><button id="notesBtn" class="soft">📝 Markdown</button><button id="delAllBtn" class="soft danger">${T("delAll")}</button></div></div>`;
  // study notes as plain Markdown: the points and the learner's OWN words, nothing the model wrote
  $("#notesBtn").onclick = () => {
    const NL = String.fromCharCode(10);
    const md = [`# ${s.lesson}`, "", `## ${T("cov")}`, ...s.points.map((p) => `- [${p.covered ? "x" : " "}] ${p.text}`), "", `## ${T("words")}`, ...s.child_words.map((w) => `> ${w.text}`), "", `## ${T("newEx")}`, ...s.new_example.map((w) => `> ${w.text}`)].join(NL);
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" })); a.download = "sprout-notes-" + base.id + ".md"; a.click();
  };
  $("#pl").onchange = (e) => { st.lesson = pub(teach.getLesson(e.target.value)); st.raw = teach.getLesson(e.target.value); openParent(); };
  document.querySelectorAll("[data-del]").forEach((b) => b.onclick = () => { memory.deleteEntry(b.dataset.del); openParent(); });
  $("#delAllBtn").onclick = () => { if (confirm(T("delConfirm"))) { memory.deleteAll(); openParent(); } };
  $("#expBtn").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(memory.exportAll(), null, 2)], { type: "application/json" })); a.download = "sprout-records.json"; a.click(); };
}

/* ---------- settings */
function openSettings() { const c = getCfg(); $("#cfgKey").value = c.key; $("#cfgBase").value = c.base; $("#cfgModel").value = c.model; $("#cfgMsg").textContent = ""; $("#modal").classList.remove("hidden"); }
async function testCfg() {
  const m = $("#cfgMsg"); m.textContent = "..."; const prev = getCfg();
  setCfg({ key: $("#cfgKey").value.trim(), base: $("#cfgBase").value.trim() || DEFAULT_CFG.base, model: $("#cfgModel").value.trim() || DEFAULT_CFG.model });
  try { await getBrain().judgeApply({ new_situation: { prompt: { zh: "1+1等于几？" }, rubric: "2", keywords: [], hint: { zh: "", en: "" } } }, "2", "zh"); m.textContent = T("testOk"); m.className = "note ok"; }
  catch (e) { m.textContent = T("testBad") + (e.message || e); m.className = "note bad"; }
  setCfg(prev);
}

/* ---------- wiring */
$("#langBtn").onclick = () => { st.lang = st.lang === "zh" ? "en" : "zh"; localStorage.setItem("yaya_lang", st.lang); applyI18n(); loadHome(); show("home");
detectProxy().then(refreshBadge); st.inLesson = false; };
$("#speakBtn").onclick = () => { st.speak = !st.speak; localStorage.setItem("yaya_speak", st.speak ? "1" : "0"); if ("speechSynthesis" in window) speechSynthesis.cancel(); applyI18n(); };
$("#parentBtn").onclick = openParent;
$("#backBtn").onclick = () => { if (st.inLesson) show("lesson"); else { show("home"); loadHome(); } };
$("#prevCard").onclick = () => { st.card = Math.max(0, st.card - 1); drawCard(); };
$("#nextCard").onclick = () => { st.card = Math.min(st.lesson.points.length - 1, st.card + 1); drawCard(); };
$("#cardSay").onclick = () => say($("#cardText").textContent);
$("#startTeach").onclick = () => setStage(1);
$("#toNew").onclick = () => setStage(2);
$("#sendBtn").onclick = send;
$("#input").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
$("#hintBtn").onclick = hint;
$("#kbBtn").onclick = () => revealTyping(!st.typing);
$("#demoBtn").onclick = () => { $("#input").value = st.raw.demo[Math.min(st.demoI, st.raw.demo.length - 1)]; st.demoI = Math.min(st.demoI + 1, st.raw.demo.length - 1); };
$("#micBtn").onclick = () => listen($("#micBtn"), $("#input"), (on) => { mood(on ? "listen" : "idle"); $("#micHint").textContent = on ? T("micHintOn") : T("micHint"); });
$("#quizMic").onclick = () => listen($("#quizMic"), $("#quizInput"));
$("#quizSend").onclick = ask;
$("#quizInput").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
$("#tabAsk").onclick = () => showTab("ask"); $("#tabExam").onclick = () => showTab("exam"); $("#runExam").onclick = runExam;
$("#settingsBtn").onclick = openSettings; $("#cfgTest").onclick = testCfg; $("#cfgClear").onclick = () => { $("#cfgKey").value = ""; };
$("#cfgSave").onclick = () => { setCfg({ key: $("#cfgKey").value.trim(), base: $("#cfgBase").value.trim() || DEFAULT_CFG.base, model: $("#cfgModel").value.trim() || DEFAULT_CFG.model }); $("#modal").classList.add("hidden"); refreshBadge(); };
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("#modal").classList.add("hidden"); });
$("#consentBtn").onclick = () => $("#consentModal").classList.remove("hidden");
$("#consentNo").onclick = () => $("#consentModal").classList.add("hidden");
$("#consentYes").onclick = () => { memory.giveConsent(); $("#consentModal").classList.add("hidden"); refreshHeader(); if (st.pending) { const id = st.pending; st.pending = null; openLesson(id); } };

applyI18n(); loadHome(); show("home");
detectProxy().then(refreshBadge);
