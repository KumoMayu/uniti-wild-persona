import type { PersonaType, Scores, ScoreKey } from "../data/wildPersonaTypes";
import { axisPercent } from "./scoring";

const axisCopy: Array<{ key: ScoreKey; label: string; positive: string; negative: string }> = [
  { key: "rhythm", label: "节奏", positive: "提前铺垫", negative: "卡点启动" },
  { key: "energy", label: "能量", positive: "稳定续航", negative: "波动爆发" },
  { key: "social", label: "状态", positive: "自己消化", negative: "靠外界带动" },
  { key: "posture", label: "姿态", positive: "收着活", negative: "放着活" },
];

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = Array.from(text);
  let line = "";
  let nextY = y;

  chars.forEach((char) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, nextY);
      line = char;
      nextY += lineHeight;
    } else {
      line = test;
    }
  });

  if (line) {
    ctx.fillText(line, x, nextY);
  }

  return nextY + lineHeight;
}

function makeCanvas(persona: PersonaType, scores: Scores) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }

  const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#f8fcff");
  bg.addColorStop(0.58, "#edf8fb");
  bg.addColorStop(1, "#fffafc");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  roundedRect(ctx, 90, 110, 900, 1700, 54);
  ctx.fill();
  ctx.strokeStyle = "rgba(126, 178, 199, 0.28)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 90, 110, 900, 1700, 54);
  ctx.stroke();

  ctx.fillStyle = "#6f8d9d";
  ctx.font = "600 34px system-ui, -apple-system, sans-serif";
  ctx.fillText("大学生野生人格图鉴", 150, 220);

  ctx.fillStyle = "#253640";
  ctx.font = "800 88px system-ui, -apple-system, sans-serif";
  ctx.fillText(persona.name, 150, 390);

  ctx.fillStyle = "#7895a4";
  ctx.font = "600 38px system-ui, -apple-system, sans-serif";
  ctx.fillText(persona.englishName, 150, 455);

  ctx.fillStyle = "#344954";
  ctx.font = "700 42px system-ui, -apple-system, sans-serif";
  wrapText(ctx, persona.line, 150, 570, 780, 58);

  ctx.fillStyle = "#d9f0f7";
  roundedRect(ctx, 150, 780, 780, 460, 40);
  ctx.fill();

  ctx.fillStyle = "#29414d";
  ctx.font = "700 32px system-ui, -apple-system, sans-serif";
  ctx.fillText("四维短条", 200, 858);

  axisCopy.forEach((axis, index) => {
    const y = 940 + index * 78;
    const percents = axisPercent(scores[axis.key]);
    const tendency = percents.positive >= 50 ? axis.positive : axis.negative;

    ctx.fillStyle = "#4b6571";
    ctx.font = "600 28px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${axis.label} · ${tendency}`, 200, y);

    ctx.fillStyle = "rgba(255,255,255,0.88)";
    roundedRect(ctx, 200, y + 24, 610, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#7dc9df";
    roundedRect(ctx, 200, y + 24, Math.max(18, (610 * percents.positive) / 100), 18, 9);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(115, 167, 188, 0.55)";
  ctx.lineWidth = 3;
  roundedRect(ctx, 150, 1370, 210, 210, 24);
  ctx.stroke();
  ctx.fillStyle = "#7895a4";
  ctx.font = "600 26px system-ui, -apple-system, sans-serif";
  ctx.fillText("二维码预留", 188, 1485);

  ctx.fillStyle = "#6f8d9d";
  ctx.font = "500 30px system-ui, -apple-system, sans-serif";
  ctx.fillText("测测你到底是什么校园活人", 150, 1688);

  return canvas;
}

export function createShareImageUrl(persona: PersonaType, scores: Scores) {
  const canvas = makeCanvas(persona, scores);
  return canvas?.toDataURL("image/png") ?? "";
}

export async function downloadShareImage(persona: PersonaType, scores: Scores) {
  const url = createShareImageUrl(persona, scores);
  if (!url) {
    return false;
  }

  try {
    const link = document.createElement("a");
    link.download = `大学生野生人格图鉴-${persona.name}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch {
    return false;
  }
}

export function previewShareImage(persona: PersonaType, scores: Scores) {
  const url = createShareImageUrl(persona, scores);
  if (!url) {
    return;
  }

  const existing = document.querySelector(".wild-share-preview");
  existing?.remove();

  const overlay = document.createElement("div");
  overlay.className = "wild-share-preview";
  overlay.innerHTML = `
    <div class="wild-share-preview-panel">
      <div class="wild-share-preview-head">
        <span>分享图预览</span>
        <button type="button" aria-label="关闭">关闭</button>
      </div>
      <img src="${url}" alt="分享图预览" />
      <p>长按图片保存</p>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector("button")?.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });
}
