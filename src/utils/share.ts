import { axisPercent } from "./scoring";
import type { PersonaType, Scores } from "../data/wildPersonaTypes";

const axisCopy = [
  ["rhythm", "提前铺垫", "卡点启动"],
  ["energy", "稳定续航", "波动爆发"],
  ["social", "自己消化", "靠外界带动"],
  ["posture", "收着活", "放着活"],
] as const;

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

export function downloadShareImage(persona: PersonaType, scores: Scores) {
  const canvas = document.createElement("canvas");
  const scale = window.devicePixelRatio || 1;
  canvas.width = 900 * scale;
  canvas.height = 1200 * scale;
  canvas.style.width = "900px";
  canvas.style.height = "1200px";

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  ctx.scale(scale, scale);
  const gradient = ctx.createLinearGradient(0, 0, 900, 1200);
  gradient.addColorStop(0, "#f7fbff");
  gradient.addColorStop(0.58, "#edf7fb");
  gradient.addColorStop(1, "#fff9fb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 1200);

  ctx.shadowColor = "rgba(80, 132, 160, 0.16)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  roundedRect(ctx, 80, 88, 740, 990, 42);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(130, 174, 195, 0.26)";
  ctx.lineWidth = 1;
  roundedRect(ctx, 80, 88, 740, 990, 42);
  ctx.stroke();

  ctx.fillStyle = "#7895a7";
  ctx.font = "500 28px system-ui, sans-serif";
  ctx.fillText("大学生野生人格图鉴", 132, 170);

  ctx.fillStyle = "#24313a";
  ctx.font = "700 72px system-ui, sans-serif";
  ctx.fillText(persona.name, 132, 292);

  ctx.fillStyle = "#7a96a7";
  ctx.font = "500 30px system-ui, sans-serif";
  ctx.fillText(persona.englishName, 132, 342);

  ctx.fillStyle = "#40505a";
  ctx.font = "500 34px system-ui, sans-serif";
  ctx.fillText(persona.line, 132, 430);

  ctx.fillStyle = "#d8eef7";
  roundedRect(ctx, 130, 500, 640, 190, 34);
  ctx.fill();
  ctx.fillStyle = "#244151";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText("四维剖面", 166, 566);

  axisCopy.forEach(([key, left, right], index) => {
    const y = 625 + index * 86;
    const percents = axisPercent(scores[key]);
    const label = percents.positive >= 50 ? left : right;

    ctx.fillStyle = "#536a78";
    ctx.font = "500 26px system-ui, sans-serif";
    ctx.fillText(label, 166, y);

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    roundedRect(ctx, 360, y - 24, 330, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#80c8dc";
    roundedRect(ctx, 360, y - 24, Math.max(16, (330 * percents.positive) / 100), 18, 9);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(99, 170, 195, 0.5)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(690, 206, 42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(706, 222, 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#7895a7";
  ctx.font = "500 28px system-ui, sans-serif";
  ctx.fillText("测测你到底是什么校园活人", 132, 1018);

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `大学生野生人格图鉴-${persona.name}.png`;
  link.href = url;
  link.click();
}
