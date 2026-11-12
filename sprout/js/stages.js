// Age stages: one product, three ways in. Same wall (the child's own words only reach memory), different surface.
// To rename the product, change BRAND only (the strings in app.js/brain.js use the same word).
export const BRAND = { en: "Sprout", zh: "芽伴" };

export const STAGES = {
  seed: {
    id: "seed", icon: "🌰", age: "3-6", maxMinutes: 10, typing: false, confetti: true, hintJumpsToCard: true,
    name: { zh: "种子", en: "Seed" },
    tag: { zh: "3-6岁 · 家长陪着玩", en: "Ages 3-6 · with a parent" },
    brain: `AUDIENCE: a child aged 3-6, usually with a parent beside them, speaking one short sentence.
- Accept a few words or one short sentence as covering a point. Do not demand full explanations or reasons.
- followup: ONE concrete WHAT/WHICH/WHERE question of at most 10 words, simple everyday words. Never ask why.`,
  },
  grow: {
    id: "grow", icon: "🌱", age: "7-11", maxMinutes: 0, typing: false, confetti: true, hintJumpsToCard: false,
    name: { zh: "嫩芽", en: "Shoot" },
    tag: { zh: "7-11岁 · 小学生", en: "Ages 7-11 · primary school" },
    brain: `AUDIENCE: a school child aged 7-11 (Grade 1-6).
- Be fair to short or simple wording; ask for the reason or the missing link of ONE point.`,
  },
  teen: {
    id: "teen", icon: "🌳", age: "12-15", maxMinutes: 0, typing: true, confetti: false, hintJumpsToCard: false,
    name: { zh: "大树", en: "Tree" },
    tag: { zh: "12-15岁 · 初中生，自己用", en: "Ages 12-15 · middle school, on your own" },
    brain: `AUDIENCE: a teenager aged 12-15 who is explaining as if to a younger student.
- Expect precise wording. A label alone does not cover a point: the cause or mechanism must be there.
- followup: ONE question that asks WHY, WHAT IF, or to compare/contrast, at most 30 words. Do not state the answer.`,
  },
};
export const STAGE_ORDER = ["seed", "grow", "teen"];
export const DEFAULT_STAGE = "grow";
export const stageOf = (id) => STAGES[id] || STAGES[DEFAULT_STAGE];
