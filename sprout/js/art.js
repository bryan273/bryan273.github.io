import { MORE } from "./lessons_more.js";
// All illustrations are inline SVG drawn in code: no image files, so the site stays static and light.
const INK = "#2b3a42", GREEN = "#43a86b", GREEN_D = "#2e8b57", LEAF = "#7fd08f", POT = "#f3c9a0", POT_D = "#e0a574", PINK = "#ff9db0",
  WALL = "#d9a77a", WALL_D = "#b98456", WATER = "#6ab7ff", SKY = "#eaf6ff", RED = "#e4572e", SUN = "#ffd45e";

const svg = (inner, bg = SKY, w = 200, h = 140) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="${w}" height="${h}" rx="14" fill="${bg}"/>${inner}</svg>`;
const txt = (x, y, s, size = 11, fill = INK, anchor = "middle", weight = 700) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" font-family="Microsoft YaHei,PingFang SC,sans-serif">${s}</text>`;
const L = (lang, zh, en) => (lang === "en" ? en : zh);

// ------------------------------------------------------------------ mascot
/** mood: idle | happy | think | listen | confused | cheer.  stage 0..3 = how much Sprout has grown. */
export function mascot(mood = "idle", stage = 0) {
  const eye = (cx) => `<g class="eye"><circle cx="${cx}" cy="86" r="9" fill="#fff"/><circle cx="${cx + (mood === "think" ? 2 : 0)}" cy="${mood === "think" ? 83 : 87}" r="4.6" fill="${INK}"/><circle cx="${cx + 1.5}" cy="${mood === "think" ? 81 : 85}" r="1.6" fill="#fff"/></g>`;
  const mouths = {
    idle: `<path d="M84 104 Q100 114 116 104" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M80 101 Q100 124 120 101 Z" fill="${INK}"/><path d="M89 109 Q100 118 111 109 Q100 112 89 109Z" fill="${PINK}"/>`,
    cheer: `<path d="M78 99 Q100 130 122 99 Z" fill="${INK}"/><path d="M88 110 Q100 121 112 110 Q100 114 88 110Z" fill="${PINK}"/>`,
    think: `<ellipse cx="108" cy="108" rx="5" ry="4" fill="${INK}"/>`,
    listen: `<ellipse cx="100" cy="108" rx="7" ry="8" fill="${INK}"/>`,
    confused: `<path d="M84 108 Q92 100 100 108 T116 108" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
  };
  const brow = mood === "confused" ? `<path d="M66 72 L82 77 M134 72 L118 77" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` : "";
  const sprout = [
    // stage 0: seed with a tiny shoot
    `<path d="M100 56 q0 -14 6 -20" stroke="${GREEN_D}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="112" cy="33" rx="9" ry="5" fill="${LEAF}" transform="rotate(-25 112 33)"/>`,
    // stage 1: two leaves
    `<path d="M100 58 V34" stroke="${GREEN_D}" stroke-width="5" stroke-linecap="round"/><ellipse cx="84" cy="32" rx="16" ry="8" fill="${LEAF}" transform="rotate(-25 84 32)"/><ellipse cx="117" cy="32" rx="16" ry="8" fill="${GREEN}" transform="rotate(25 117 32)"/>`,
    // stage 2: taller, four leaves
    `<path d="M100 58 V20" stroke="${GREEN_D}" stroke-width="5" stroke-linecap="round"/><ellipse cx="82" cy="40" rx="15" ry="7" fill="${LEAF}" transform="rotate(-25 82 40)"/><ellipse cx="119" cy="40" rx="15" ry="7" fill="${GREEN}" transform="rotate(25 119 40)"/><ellipse cx="86" cy="20" rx="14" ry="7" fill="${GREEN}" transform="rotate(-30 86 20)"/><ellipse cx="115" cy="20" rx="14" ry="7" fill="${LEAF}" transform="rotate(30 115 20)"/>`,
    // stage 3: flower
    `<path d="M100 58 V24" stroke="${GREEN_D}" stroke-width="5" stroke-linecap="round"/><ellipse cx="80" cy="44" rx="15" ry="7" fill="${LEAF}" transform="rotate(-25 80 44)"/><ellipse cx="121" cy="44" rx="15" ry="7" fill="${GREEN}" transform="rotate(25 121 44)"/>` +
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="100" cy="10" rx="7" ry="11" fill="${PINK}" transform="rotate(${a} 100 22)"/>`).join("") + `<circle cx="100" cy="22" r="7" fill="${SUN}"/>`,
  ][Math.max(0, Math.min(3, stage))];
  const arms = mood === "cheer" ? `<path d="M52 96 Q38 76 44 62 M148 96 Q162 76 156 62" stroke="${POT_D}" stroke-width="7" fill="none" stroke-linecap="round"/>` : "";
  return `<svg viewBox="0 0 200 170" class="mascot mood-${mood}" xmlns="http://www.w3.org/2000/svg" role="img">
  <ellipse cx="100" cy="160" rx="52" ry="7" fill="rgba(0,0,0,.08)"/>
  <g class="body">
    ${arms}
    ${sprout}
    <path d="M48 76 Q48 58 100 58 Q152 58 152 76 L146 138 Q144 152 100 152 Q56 152 54 138 Z" fill="${POT}" stroke="${POT_D}" stroke-width="3"/>
    <path d="M44 72 Q44 62 100 62 Q156 62 156 72 Q156 80 100 80 Q44 80 44 72Z" fill="${POT_D}"/>
    ${eye(80)}${eye(120)}${brow}
    <circle cx="68" cy="102" r="7" fill="${PINK}" opacity=".7"/><circle cx="132" cy="102" r="7" fill="${PINK}" opacity=".7"/>
    ${mouths[mood] || mouths.idle}
  </g></svg>`;
}

// ------------------------------------------------------------------ pieces
const brickWall = (x, w) => {
  let s = `<rect x="${x}" y="0" width="${w}" height="140" fill="${WALL}"/>`;
  for (let y = 0; y < 140; y += 20) s += `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${WALL_D}" stroke-width="1.5"/>`;
  for (let y = 0; y < 140; y += 20) for (let bx = x + ((y / 20) % 2 ? 15 : 0); bx < x + w; bx += 30) s += `<line x1="${bx}" y1="${y}" x2="${bx}" y2="${y + 20}" stroke="${WALL_D}" stroke-width="1.5"/>`;
  return s;
};
const leaf = (x, y, rot = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 Q14 -16 32 0 Q14 16 0 0Z" fill="${LEAF}" stroke="${GREEN_D}" stroke-width="1.5"/></g>`;
const disc = (x, y, r = 8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${RED}" stroke="#a93a1c" stroke-width="2"/>`;
const glass = (x, y, drops = 6, cold = false, scale = 1) => {
  let d = "";
  const pos = [[-24, 20], [-30, 44], [-20, 60], [26, 24], [32, 48], [22, 66], [-34, 70], [34, 74]];
  for (let i = 0; i < drops; i++) d += `<path d="M${pos[i][0]} ${pos[i][1]} q4 -8 8 0 a4 4 0 1 1 -8 0Z" fill="${WATER}" stroke="#3d8fe0" stroke-width="1"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-22 0 H22 L18 80 Q0 88 -18 80 Z" fill="${cold ? "#bfe3ff" : "#e8f4ff"}" stroke="#7aa6c9" stroke-width="3"/>
  <path d="M-19 22 H19 L17 78 Q0 84 -17 78 Z" fill="${WATER}" opacity=".75"/>${cold ? `<rect x="-10" y="28" width="12" height="12" rx="2" fill="#fff" opacity=".8"/><rect x="2" y="40" width="11" height="11" rx="2" fill="#fff" opacity=".8"/>` : ""}${d}</g>`;
};
const pie = (cx, cy, r, n, shaded = 1, fill = "#ffb347") => {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff6e5" stroke="#c9852b" stroke-width="2.5"/>`;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const p = `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}Z`;
    s += `<path d="${p}" fill="${i < shaded ? fill : "none"}" stroke="#c9852b" stroke-width="2"/>`;
  }
  return s;
};
const cake = (x, y, n, shaded = 1) => {
  const w = 76, h = 30;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#fff0d6" stroke="#c9852b" stroke-width="2.5"/><rect x="${x}" y="${y}" width="${w}" height="9" rx="5" fill="${PINK}"/>`;
  for (let i = 0; i < n; i++) s += `<rect x="${x + (w / n) * i}" y="${y}" width="${w / n}" height="${h}" fill="${i < shaded ? "#ffb347" : "none"}" opacity="${i < shaded ? 0.8 : 1}" stroke="#c9852b" stroke-width="1.6"/>`;
  return s;
};

// ------------------------------------------------------------------ scenes per lesson and card
const SCENES = {
  "climbing-vine": {
    cover: (l) => svg(brickWall(120, 80) + `<path d="M105 140 C95 110 125 95 112 70 C100 48 125 30 118 0" stroke="${GREEN}" stroke-width="7" fill="none" stroke-linecap="round"/>` + leaf(88, 108, 200) + leaf(120, 70, -20) + leaf(92, 40, 200) + disc(121, 96, 6) + disc(122, 52, 6), "#e9f7ee"),
    k1: (l) => svg(`<path d="M80 135 V12" stroke="${GREEN}" stroke-width="9" stroke-linecap="round"/><path d="M80 62 Q62 52 52 54" stroke="${GREEN_D}" stroke-width="4" fill="none"/>` + leaf(34, 56, -20, 1.1) +
      `<path d="M80 64 Q100 70 112 84" stroke="${RED}" stroke-width="4" fill="none" stroke-linecap="round"/>` + disc(114, 86, 6) +
      txt(80, 150 - 4, L(l, "茎", "stem"), 11, GREEN_D) + txt(34, 30, L(l, "叶柄", "leaf stalk"), 10, GREEN_D) + txt(126, 106, L(l, "脚（在反面）", "foot (underside)"), 12, RED, "start"), "#f3fbf5"),
    k2: (l) => svg(`<path d="M24 118 C60 118 70 70 118 52" stroke="${RED}" stroke-width="6" fill="none" stroke-linecap="round"/>` + disc(128, 48, 16) + txt(60, 100, L(l, "细丝", "thread"), 13, RED) + txt(150, 26, L(l, "小圆片", "small disc"), 13, "#a93a1c") + `<path d="M140 30 L134 36" stroke="#a93a1c" stroke-width="2"/>`, "#fff5f0"),
    k3: (l) => svg(brickWall(130, 70) + `<path d="M10 100 C50 100 80 66 126 62" stroke="${RED}" stroke-width="6" fill="none" stroke-linecap="round"/>` + disc(128, 62, 11) +
      `<path d="M116 44 l6 8 M126 38 v10 M137 44 l-4 8" stroke="${SUN}" stroke-width="3" stroke-linecap="round"/>` + txt(70, 30, L(l, "碰到墙，巴住！", "touch, grip!"), 13, "#a93a1c"), "#fdf3e8"),
    k4: (l) => svg(brickWall(140, 60) + `<path d="M40 130 V10" stroke="#b7dcc2" stroke-width="9" stroke-linecap="round" stroke-dasharray="3 9"/><path d="M96 130 V10" stroke="${GREEN}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M96 70 C110 60 120 78 140 70" stroke="${RED}" stroke-width="5" fill="none" stroke-linecap="round"/>` + disc(141, 70, 7) +
      `<path d="M54 70 H82" stroke="${INK}" stroke-width="3" marker-end="url(#a)"/><defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="${INK}"/></marker></defs>` +
      txt(70, 40, L(l, "拉近", "pull in"), 12, INK) + txt(70, 128, L(l, "弯曲", "bends"), 12, RED).replace('x="70"', 'x="110"'), "#f3fbf5"),
    k5: (l) => svg(brickWall(100, 100) + `<path d="M30 135 C40 110 70 112 82 92 C92 76 78 62 96 46 C108 34 104 20 112 6" stroke="${GREEN}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      disc(102, 96, 6) + disc(104, 66, 6) + disc(110, 38, 6) + leaf(40, 112, 190, 0.9) + leaf(70, 80, 200, 0.9) + `<path d="M170 120 V40" stroke="${INK}" stroke-width="4" marker-end="url(#b)"/><defs><marker id="b" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 8 L4 0 L8 8Z" fill="${INK}"/></marker></defs>` +
      txt(48, 24, L(l, "一步一步", "step by step"), 12, GREEN_D), "#f3fbf5"),
    new: (l) => svg(brickWall(140, 60) + `<path d="M30 126 C50 110 60 90 66 56" stroke="${GREEN}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M66 64 C84 60 100 78 112 70" stroke="${RED}" stroke-width="5" fill="none" stroke-linecap="round"/>` + disc(114, 69, 8) +
      `<path d="M124 69 H138" stroke="${INK}" stroke-width="2.5" stroke-dasharray="3 3"/>` + txt(154, 30, "?", 26, RED).replace('x="154"', 'x="120"') + txt(70, 132, L(l, "没碰到墙！", "misses the wall!"), 12, RED), "#fff7ee"),
  },
  "cup-droplets": {
    cover: (l) => svg(glass(100, 28, 8, true, 1.1) + `<text x="150" y="40" font-size="22">❄️</text>`, "#eaf6ff"),
    k1: (l) => svg(glass(100, 30, 6) + `<path d="M100 72 H146" stroke="${RED}" stroke-width="4" stroke-linecap="round"/><path d="M116 62 l20 20 M136 62 l-20 20" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>` + txt(100, 20, L(l, "不是漏出来的", "not leaking"), 12, RED), "#eaf6ff"),
    k2: (l) => svg([30, 60, 90, 120].map((y, i) => `<path d="M${14 + i * 6} ${y} q15 -16 30 0 t30 0 t30 0 t30 0" stroke="#9ccfff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join("") + txt(100, 20, L(l, "空气里有水蒸气", "water vapour in air"), 12, "#2e6fb0") + txt(100, 134, L(l, "（看不见）", "(invisible)"), 11, GREY()), "#f3f9ff"),
    k3: (l) => svg(`<path d="M16 40 q15 -16 30 0 t30 0" stroke="#9ccfff" stroke-width="3.5" fill="none"/><path d="M16 70 q15 -16 30 0 t30 0" stroke="#9ccfff" stroke-width="3.5" fill="none"/>` + `<path d="M84 55 H112" stroke="${INK}" stroke-width="3" marker-end="url(#c)"/><defs><marker id="c" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="${INK}"/></marker></defs>` + glass(150, 24, 5, true, 0.95) + `<text x="130" y="22" font-size="18">❄️</text>` + txt(60, 110, L(l, "遇冷 → 小水珠", "cold → droplets"), 12, "#2e6fb0"), "#f3f9ff"),
    k4: (l) => svg(glass(56, 22, 8, true, 0.9) + glass(146, 22, 2, false, 0.9) + txt(56, 126, L(l, "更冷：更多", "colder: more"), 11, "#2e6fb0") + txt(146, 126, L(l, "不冷：更少", "less cold: fewer"), 11, GREY()), "#eaf6ff"),
    new: (l) => svg(`<rect x="0" y="0" width="90" height="140" fill="#cfe8ff"/><rect x="90" y="0" width="110" height="140" fill="#ffe3c4"/><text x="40" y="30" font-size="22">❄️</text><text x="150" y="30" font-size="22">☀️</text>` +
      `<circle cx="70" cy="86" r="22" fill="#fff" opacity=".85" stroke="${INK}" stroke-width="3"/><circle cx="124" cy="86" r="22" fill="#fff" opacity=".85" stroke="${INK}" stroke-width="3"/><path d="M92 84 H102" stroke="${INK}" stroke-width="3"/>` +
      [[62, 80], [76, 92], [118, 78], [130, 94], [70, 96], [124, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#9ccfff"/>`).join("") + txt(100, 134, L(l, "镜片起雾了！", "the lenses fog up!"), 12, INK), "#eaf6ff"),
  },
  "fraction-compare": {
    cover: (l) => svg(pie(60, 70, 36, 3, 1) + pie(144, 70, 36, 4, 1, "#7fd08f") + txt(102, 76, ">", 26, RED) + txt(60, 128, "1/3", 14) + txt(144, 128, "1/4", 14), "#fff9ee"),
    k1: (l) => svg(pie(70, 70, 46, 4, 1) + txt(150, 62, L(l, "分母 = 4", "denominator 4"), 12, INK) + txt(150, 82, L(l, "平均分成 4 份", "4 equal parts"), 12, INK), "#fff9ee"),
    k2: (l) => svg(pie(50, 66, 34, 2, 1) + pie(150, 66, 34, 6, 1, "#7fd08f") + txt(50, 118, L(l, "2 份：一份大", "2 parts: big"), 11) + txt(150, 118, L(l, "6 份：一份小", "6 parts: small"), 11), "#fff9ee"),
    k3: (l) => svg(pie(54, 70, 36, 3, 1) + pie(150, 70, 36, 4, 1, "#7fd08f") + txt(102, 76, ">", 28, RED) + txt(54, 126, "1/3", 14) + txt(150, 126, "1/4", 14), "#fff9ee"),
    new: (l) => svg(cake(14, 34, 5, 1) + cake(110, 34, 8, 1) + txt(52, 90, L(l, "5 份吃 1", "1 of 5"), 12) + txt(148, 90, L(l, "8 份吃 1", "1 of 8"), 12) + txt(100, 124, L(l, "谁吃得多？", "who eats more?"), 14, RED), "#fff9ee"),
  },
};
function GREY() { return "#6b7580"; }

// Generic picture card for lessons without a hand-drawn scene: a big emoji, a soft colour per card and the short label.
const TINT = ["#eaf6ff", "#fff3dd", "#eafaf0", "#fdeef3"];
function emojiScene(les, key, lang) {
  const i = Math.max(0, les.points.findIndex((p) => p.id === key));
  const pt = les.points[i];
  const big = key === "cover" ? les.emoji : key === "new" ? "🧪" : pt.emoji;
  const label = key === "cover" ? les.title[lang === "en" ? "en" : "zh"] : key === "new" ? "?" : pt.short[lang === "en" ? "en" : "zh"];
  const size = [...big].length > 3 ? 40 : 58;
  return svg(`<circle cx="100" cy="64" r="46" fill="#fff" opacity=".75"/><text x="100" y="${64 + size / 3}" font-size="${size}" text-anchor="middle">${big}</text>` + txt(100, 128, label.length > 18 ? label.slice(0, 18) + "…" : label, 11), key === "new" ? "#fff7ea" : TINT[i % TINT.length]);
}
export function scene(lessonId, key, lang = "zh") {
  const f = SCENES[lessonId]?.[key];
  if (f) return f(lang);
  const les = MORE.find((l) => l.id === lessonId);
  return les ? emojiScene(les, key, lang) : svg("");
}
