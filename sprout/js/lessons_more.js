// Lessons for the other two age stages. Original key points written for this prototype, not yet teacher-reviewed.
// Each point has an `emoji` used by the generic picture card in art.js (no per-lesson drawing needed).
// Seed (age 3-6): one-sentence points, the child answers WHAT/WHICH. Tree (age 12-15): mechanisms, WHY / WHAT IF.
const P = (id, zh, en, shortZh, shortEn, keywords, probe, emoji) => ({ id, text: zh, text_en: en, keywords, probe, short: { zh: shortZh, en: shortEn }, emoji });
const Q = (zh, en, point) => ({ zh, en, point });

export const MORE = [
  {
    id: "plant-needs", band: "seed", age: "3-6",
    title: { zh: "小花要喝水晒太阳", en: "Flowers Need Water and Sun" },
    subject: { zh: "自然", en: "Nature" }, grade: 0, emoji: "🌻",
    intro: { zh: "小花是怎么长大的？看看图，再来教芽伴。", en: "How does a little flower grow? Look at the pictures, then teach Sprout." },
    source_note: "Original key points written for this prototype. Teacher review pending.",
    points: [
      P("k1", "植物需要喝水才能长大。", "Plants need to drink water to grow.", "小花要喝水", "Flowers drink water", ["水", "喝"], "小花渴了，要喝什么呀？", "🌱💧"),
      P("k2", "植物也需要太阳光。", "Plants also need sunshine.", "小花要晒太阳", "Flowers need the sun", ["太阳", "晒"], "除了水，小花还需要什么才长得高？", "🌻☀️"),
    ],
    misconceptions: [{ pattern: "不用(喝水|浇水)|不需要水", note: "says plants need no water" }],
    new_situation: {
      prompt: { zh: "小花被放在黑黑的柜子里，也没有人浇水，会怎么样呢？", en: "A little flower is in a dark cupboard and nobody waters it. What happens?" },
      rubric: "A good answer says it gets no water and no sun, so it wilts or cannot grow.",
      keywords: ["枯", "干", "死", "不长", "长不", "没有水", "蔫", "渴", "不好"],
      hint: { zh: "想一想：小花需要什么？", en: "Think: what does a flower need?" },
    },
    demo: ["小花要喝水。", "小花还要晒太阳。", "小花没有水，又没有太阳，会渴，会蔫，长不大。"],
    exam: [Q("小花要喝什么？", "What does a flower drink?", "k1"), Q("小花还需要什么？", "What else does a flower need?", "k2")],
  },
  {
    id: "wash-hands", band: "seed", age: "3-6",
    title: { zh: "怎样洗干净小手", en: "How to Wash Hands Clean" },
    subject: { zh: "生活", en: "Daily life" }, grade: 0, emoji: "🧼",
    intro: { zh: "洗手有小秘密。看看图，再来教芽伴。", en: "Hand washing has little secrets. Look at the pictures, then teach Sprout." },
    source_note: "Original key points written for this prototype. Teacher review pending.",
    points: [
      P("k1", "洗手要用肥皂和水。", "Wash hands with soap and water.", "用肥皂和水", "Use soap and water", ["肥皂", "香皂", "洗手液", "水"], "洗手的时候，要用什么才干净？", "🧼💧"),
      P("k2", "要搓手心、手背和手指缝。", "Rub the palms, the backs and between the fingers.", "搓手心手背手指缝", "Rub palms, backs, fingers", ["搓", "手心", "手背", "指缝"], "小手哪些地方都要搓一搓呀？", "🙌🫧"),
      P("k3", "洗手是为了冲走看不见的细菌；吃饭前、上厕所后要洗。", "We wash to rinse away germs we cannot see; before eating and after the toilet.", "洗掉看不见的细菌", "Wash away germs", ["细菌", "脏", "吃饭", "厕所"], "我们为什么要洗手呢？什么时候要洗？", "🦠🚽"),
    ],
    misconceptions: [{ pattern: "不用肥皂|不用洗", note: "says soap or washing is not needed" }],
    new_situation: {
      prompt: { zh: "小明玩完泥巴，只用水冲了一下就去吃饭，对吗？为什么？", en: "Sam played in mud, rinsed with water only and went to eat. Is that right? Why?" },
      rubric: "A good answer says no: water alone does not remove germs, soap and rubbing are needed, otherwise he may get sick.",
      keywords: ["不对", "细菌", "脏", "肥皂", "搓", "不干净", "生病"],
      hint: { zh: "想一想：只用水，能洗掉看不见的东西吗？", en: "Think: can water alone wash away things we cannot see?" },
    },
    demo: ["洗手要用肥皂和水。", "要搓手心、手背和手指缝，洗掉看不见的细菌，吃饭前要洗。", "不对，只用水冲不干净，还有细菌，会生病，要用肥皂搓。"],
    exam: [Q("洗手要用什么？", "What do we use to wash hands?", "k1"), Q("小手哪里要搓？", "Where do we rub?", "k2"), Q("为什么要洗手？", "Why wash hands?", "k3")],
  },
  {
    id: "photosynthesis", band: "teen", age: "12-15",
    title: { zh: "光合作用", en: "Photosynthesis" },
    subject: { zh: "科学", en: "Science" }, grade: 7, emoji: "🍃",
    intro: { zh: "植物没有嘴，怎么“吃饭”？把过程讲清楚，就像教一个十岁的孩子。", en: "Plants have no mouth. How do they make food? Explain it so a 10-year-old would get it." },
    source_note: "Original key points written for this prototype. Teacher review pending.",
    points: [
      P("k1", "光合作用是植物利用光能，把二氧化碳和水变成糖等有机物的过程。", "Photosynthesis is how a plant uses light energy to turn carbon dioxide and water into sugar and other organic matter.", "光 + CO₂ + 水 → 糖", "light + CO₂ + water → sugar", ["光", "二氧化碳", "水", "糖", "有机物", "淀粉"], "植物用什么原料、什么能量，造出了什么？", "☀️🍃"),
      P("k2", "场所是叶绿体，里面的叶绿素吸收光能。", "It happens in chloroplasts, where chlorophyll absorbs the light.", "叶绿体里的叶绿素吸光", "chlorophyll absorbs light", ["叶绿体", "叶绿素"], "这个过程发生在细胞的哪个结构里？谁来吸收光？", "🔬🟢"),
      P("k3", "光合作用同时释放氧气。", "Oxygen is released at the same time.", "同时放出氧气", "oxygen is released", ["氧气", "氧"], "除了糖，还有什么气体被放出来？", "💨O₂"),
      P("k4", "光照、二氧化碳浓度和温度会影响光合作用的速率。", "Light, CO₂ concentration and temperature change the rate.", "光、CO₂、温度影响速率", "light, CO₂, temperature set the rate", ["光照", "温度", "浓度", "速率", "越快", "影响"], "哪些条件变了，光合作用会变快或变慢？为什么会有上限？", "📈🌡️"),
    ],
    misconceptions: [{ pattern: "(从|靠)(土壤|泥土)[^，。]{0,6}(得到|获得|吸收)[^，。]{0,4}(食物|有机物|糖)", note: "thinks the sugar comes from the soil" }],
    new_situation: {
      prompt: { zh: "把一盆植物放进完全黑暗的房间一周，叶片会怎样？请用光合作用解释。", en: "A plant sits in a completely dark room for a week. What happens to its leaves? Explain with photosynthesis." },
      rubric: "A good answer says there is no light so photosynthesis stops, no sugar is made, the plant uses up reserves, chlorophyll fades and leaves turn yellow, and it eventually dies.",
      keywords: ["不能", "无法", "没有光", "缺光", "停止", "发黄", "变黄", "糖", "饿", "枯"],
      hint: { zh: "想一想：光合作用需要哪个条件？缺了它，糖还能造吗？", en: "Think: which input is missing? Can sugar still be made?" },
    },
    demo: ["植物利用光，把二氧化碳和水变成糖等有机物，这就是光合作用。", "场所是叶绿体，叶绿素吸收光能，同时释放氧气，光照越强速率越快，温度也有影响。", "没有光，光合作用不能进行，无法制造糖，叶绿素减少，叶子会发黄，最后枯死。"],
    exam: [Q("光合作用的原料和产物是什么？", "What goes in and what comes out?", "k1"), Q("光合作用在哪里发生？", "Where does it happen?", "k2"), Q("光合作用放出什么气体？", "Which gas is released?", "k3"), Q("什么会影响光合作用的速率？", "What changes the rate?", "k4")],
  },
  {
    id: "supply-demand", band: "teen", age: "12-15",
    title: { zh: "供求关系与价格", en: "Supply, Demand and Price" },
    subject: { zh: "经济", en: "Economics" }, grade: 8, emoji: "📈",
    intro: { zh: "为什么雨天打车更贵？讲清楚价格是怎么被“推”动的。", en: "Why do taxis cost more in the rain? Explain what pushes a price up or down." },
    source_note: "Original key points written for this prototype. Teacher review pending.",
    points: [
      P("k1", "需求大于供给时，商品供不应求，价格上涨。", "When demand is bigger than supply, the good is scarce and the price rises.", "需求 > 供给，涨价", "demand > supply, price up", ["供不应求", "需求", "价格", "上涨", "涨", "大于", "多于"], "如果想买的人比货多，会发生什么？为什么？", "🛒⬆️"),
      P("k2", "供给大于需求时，商品供过于求，价格下降。", "When supply is bigger than demand, there is a surplus and the price falls.", "供给 > 需求，降价", "supply > demand, price down", ["供过于求", "供给", "价格", "下降", "降", "大于", "多于"], "反过来，货比想买的人多，价格会怎样？为什么？", "📦⬇️"),
      P("k3", "价格涨跌会反过来调节供给和需求，最后趋向均衡价格。", "Price changes in turn adjust supply and demand, until the price settles at equilibrium.", "价格反过来调节，趋向均衡", "price adjusts both sides to equilibrium", ["均衡", "平衡", "调节"], "价格变了以后，买的人和卖的人会怎么做？最后停在哪里？", "⚖️"),
    ],
    misconceptions: [{ pattern: "价格(越高|上涨|变高)[^，。]{0,6}(需求|买的人)(越多|增加|变多|越大)", note: "reverses the law of demand" }],
    new_situation: {
      prompt: { zh: "突然下大雨，便利店的雨伞很快卖得只剩几把。店主该怎么调价？为什么？", en: "It suddenly pours and the shop's umbrellas almost sell out. How should the owner set the price? Why?" },
      rubric: "A good answer says demand jumped while stock is small, so the price can rise, which also encourages more supply; mention of fairness or long-run balance is fine.",
      keywords: ["涨", "提高", "上调", "需求", "供不应求", "库存", "少", "贵"],
      hint: { zh: "想一想：想买的人变多了，货变多了吗？", en: "Think: more buyers, but did the stock grow?" },
    },
    demo: ["需求大于供给时，供不应求，价格会上涨。", "供给大于需求时，供过于求，价格会下降，价格涨跌还会调节供需，最后趋向均衡。", "雨天需求突然变大，雨伞供不应求，库存又少，所以可以适当涨价，也能让供给增加。"],
    exam: [Q("需求大于供给，价格怎么变？", "Demand above supply: what happens to price?", "k1"), Q("供给大于需求，价格怎么变？", "Supply above demand: what happens to price?", "k2"), Q("价格最后会趋向哪里？", "Where does the price settle?", "k3")],
  },
];
