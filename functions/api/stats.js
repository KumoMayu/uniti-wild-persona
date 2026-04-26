const personaNames = [
  "温吞热水瓶",
  "半熟电鳗",
  "人间校准器",
  "气氛永动机",
  "隐形推进器",
  "反复横跳兽",
  "临场变形怪",
  "抽象回旋镖",
  "慢热蘑菇人",
  "游离信号塔",
  "柔性生存体",
  "快乐串台王",
  "截止唤醒器",
  "过载小马达",
  "群体感应器",
  "卡点艺术家",
];

export async function onRequestGet({ env }) {
  if (!env.STATS) {
    return json({ totalCompleted: 0, personas: emptyPersonaCounts() });
  }

  const totalCompleted = toCount(await env.STATS.get("total_completed"));
  const entries = await Promise.all(
    personaNames.map(async (name) => [name, toCount(await env.STATS.get(`persona_${name}`))]),
  );

  return json({
    totalCompleted,
    personas: Object.fromEntries(entries),
  });
}

function emptyPersonaCounts() {
  return Object.fromEntries(personaNames.map((name) => [name, 0]));
}

function toCount(value) {
  const count = Number(value ?? "0");
  return Number.isFinite(count) && count > 0 ? count : 0;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
