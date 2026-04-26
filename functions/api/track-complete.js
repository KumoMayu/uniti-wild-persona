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

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

export async function onRequestPost({ request, env }) {
  if (!env.STATS) {
    return json({ error: "STATS KV binding is missing" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const persona = typeof body?.persona === "string" ? body.persona : "";
  if (!personaNames.includes(persona)) {
    return json({ error: "Unknown persona" }, 400);
  }

  const total = await increment(env.STATS, "total_completed");
  const personaTotal = await increment(env.STATS, `persona_${persona}`);

  return json({ ok: true, totalCompleted: total, persona, personaCount: personaTotal });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}

async function increment(kv, key) {
  const current = Number((await kv.get(key)) ?? "0");
  const next = Number.isFinite(current) ? current + 1 : 1;
  await kv.put(key, String(next));
  return next;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}
