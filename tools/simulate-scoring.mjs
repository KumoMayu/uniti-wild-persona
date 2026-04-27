const iterations = Number(process.argv[2] ?? 5000);
const scoreKeys = ["rhythm", "energy", "social", "posture"];
const optionValues = [-2, -1, 1, 2];
const dimensionWeights = {
  rhythm: 1,
  energy: 1,
  social: 0.9,
  posture: 0.9,
};

const personas = {
  AAAA: { name: "温吞热水瓶", rhythm: 50, energy: 49, social: 45, posture: 50 },
  AAAB: { name: "半熟电鳗", rhythm: 44, energy: 35, social: 47, posture: -39 },
  AABA: { name: "人间校准器", rhythm: 47, energy: 47, social: -40, posture: 48 },
  AABB: { name: "气氛永动机", rhythm: 41, energy: 41, social: -50, posture: -46 },
  ABAA: { name: "隐形推进器", rhythm: 41, energy: -41, social: 50, posture: 44 },
  ABAB: { name: "反复横跳兽", rhythm: 35, energy: -51, social: 44, posture: -49 },
  ABBA: { name: "临场变形怪", rhythm: 38, energy: -40, social: -51, posture: 37 },
  ABBB: { name: "抽象回旋镖", rhythm: 30, energy: -46, social: -38, posture: -52 },
  BAAA: { name: "慢热蘑菇人", rhythm: -48, energy: 50, social: 47, posture: 47 },
  BAAB: { name: "游离信号塔", rhythm: -42, energy: 40, social: 52, posture: -40 },
  BABA: { name: "柔性生存体", rhythm: -39, energy: 45, social: -40, posture: 51 },
  BABB: { name: "快乐串台王", rhythm: -45, energy: 37, social: -47, posture: -52 },
  BBAA: { name: "截止唤醒器", rhythm: -52, energy: -45, social: 44, posture: 41 },
  BBAB: { name: "过载小马达", rhythm: -49, energy: -52, social: 41, posture: -42 },
  BBBA: { name: "群体感应器", rhythm: -43, energy: -40, social: -52, posture: 39 },
  BBBB: { name: "卡点艺术家", rhythm: -52, energy: -49, social: -37, posture: -43 },
};

function normalize(value) {
  return Math.round(Math.max(-100, Math.min(100, (value / 12) * 100)));
}

function distance(scores, persona) {
  return scoreKeys.reduce((total, key) => {
    return total + Math.abs(scores[key] - persona[key]) * dimensionWeights[key];
  }, 0);
}

function pickPersona(rawScores) {
  const normalized = Object.fromEntries(scoreKeys.map((key) => [key, normalize(rawScores[key])]));
  return Object.entries(personas)
    .map(([code, persona]) => ({ code, name: persona.name, distance: distance(normalized, persona) }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function randomScore() {
  return optionValues[Math.floor(Math.random() * optionValues.length)];
}

const counts = Object.fromEntries(Object.keys(personas).map((code) => [code, 0]));

for (let index = 0; index < iterations; index += 1) {
  const rawScores = Object.fromEntries(scoreKeys.map((key) => [key, 0]));

  for (const key of scoreKeys) {
    for (let question = 0; question < 6; question += 1) {
      rawScores[key] += randomScore();
    }
  }

  counts[pickPersona(rawScores).code] += 1;
}

const rows = Object.entries(personas)
  .map(([code, persona]) => ({
    code,
    name: persona.name,
    count: counts[code],
    ratio: `${((counts[code] / iterations) * 100).toFixed(2)}%`,
  }))
  .sort((a, b) => b.count - a.count);

console.table(rows);
