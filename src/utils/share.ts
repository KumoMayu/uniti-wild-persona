import { getPersonaIcon } from "../data/personaIcons";
import type { PersonaType, Scores } from "../data/wildPersonaTypes";
import { axisRows, getAxisDisplay } from "./axisDisplay";

const shareUrl = "https://uniti.pages.dev";

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
  let line = "";
  let nextY = y;

  Array.from(text).forEach((char) => {
    const test = line + char;
    if (line && ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, nextY);
      line = char;
      nextY += lineHeight;
    } else {
      line = test;
    }
  });

  if (line) ctx.fillText(line, x, nextY);
  return nextY + lineHeight;
}

function drawQr(ctx: CanvasRenderingContext2D, matrix: boolean[][], x: number, y: number, size: number) {
  const count = matrix.length;
  const quiet = 4;
  const module = size / (count + quiet * 2);

  ctx.fillStyle = "#ffffff";
  roundedRect(ctx, x, y, size, size, 28);
  ctx.fill();

  ctx.fillStyle = "#263943";
  matrix.forEach((row, rowIndex) => {
    row.forEach((dark, colIndex) => {
      if (!dark) return;
      ctx.fillRect(x + (colIndex + quiet) * module, y + (rowIndex + quiet) * module, module + 0.1, module + 0.1);
    });
  });
}

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

function isWechat() {
  return /MicroMessenger/i.test(navigator.userAgent);
}

function getSaveHint() {
  if (isWechat()) return "微信里请长按图片保存";
  if (isTouchDevice()) return "手机上可长按图片保存到相册";
  return "可右键保存图片，或点击下载";
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawIllustrationCard(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.fillStyle = "rgba(248, 253, 255, 0.96)";
  roundedRect(ctx, x, y, width, height, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(126, 178, 199, 0.22)";
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, width, height, 32);
  ctx.stroke();
  if (image) drawContainImage(ctx, image, x + 16, y + 16, width - 32, height - 32);
}

function drawAxisComparison(ctx: CanvasRenderingContext2D, scores: Scores, x: number, y: number, width: number) {
  axisRows.forEach((axis, index) => {
    const rowY = y + index * 82;
    const display = getAxisDisplay(scores, axis.key);

    ctx.fillStyle = "#30434d";
    ctx.font = "700 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(display.label, x, rowY);

    ctx.fillStyle = "#607986";
    ctx.font = "590 22px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${display.positive} ${display.positivePercent}%`, x, rowY + 32);

    ctx.textAlign = "right";
    ctx.fillText(`${display.negative} ${display.negativePercent}%`, x + width, rowY + 32);
    ctx.textAlign = "left";

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundedRect(ctx, x, rowY + 50, width, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#8fcfe0";
    roundedRect(ctx, x, rowY + 50, Math.max(18, (width * display.fillPercent) / 100), 18, 9);
    ctx.fill();
  });
}

async function createShareCanvas(persona: PersonaType, scores: Scores) {
  const icon = getPersonaIcon(persona);
  const iconImage = await loadImage(icon.src);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#f8fcff");
  bg.addColorStop(0.55, "#eef8fb");
  bg.addColorStop(1, "#fffafc");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  roundedRect(ctx, 88, 108, 904, 1704, 56);
  ctx.fill();
  ctx.strokeStyle = "rgba(126, 178, 199, 0.28)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 88, 108, 904, 1704, 56);
  ctx.stroke();

  ctx.fillStyle = "#6f8d9d";
  ctx.font = "600 34px system-ui, -apple-system, sans-serif";
  ctx.fillText("大学生野生人格图鉴", 150, 224);

  ctx.fillStyle = "#253640";
  ctx.font = "850 88px system-ui, -apple-system, sans-serif";
  ctx.fillText(persona.name, 150, 390);

  ctx.fillStyle = "#7895a4";
  ctx.font = "620 38px system-ui, -apple-system, sans-serif";
  ctx.fillText(persona.englishName, 150, 456);

  drawIllustrationCard(ctx, iconImage, 650, 286, 250, 250);

  ctx.fillStyle = "#344954";
  ctx.font = "760 42px system-ui, -apple-system, sans-serif";
  wrapText(ctx, persona.line, 150, 600, 780, 58);

  ctx.fillStyle = "#e6f5f9";
  roundedRect(ctx, 150, 860, 780, 480, 42);
  ctx.fill();

  ctx.fillStyle = "#29414d";
  ctx.font = "760 32px system-ui, -apple-system, sans-serif";
  ctx.fillText("四维剖面", 204, 940);
  drawAxisComparison(ctx, scores, 204, 1000, 672);

  ctx.fillStyle = "#6f8d9d";
  ctx.font = "560 30px system-ui, -apple-system, sans-serif";
  ctx.fillText("扫码进入 UniTI", 150, 1578);
  ctx.fillStyle = "#405660";
  ctx.font = "660 34px system-ui, -apple-system, sans-serif";
  ctx.fillText("测测你到底是什么校园活人", 150, 1632);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  roundedRect(ctx, 700, 1488, 230, 230, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(126, 178, 199, 0.24)";
  ctx.stroke();
  drawQr(ctx, createQrMatrix(shareUrl), 716, 1504, 198);

  return canvas;
}

export async function createShareImageUrl(persona: PersonaType, scores: Scores) {
  const canvas = await createShareCanvas(persona, scores);
  return canvas?.toDataURL("image/png") ?? "";
}

export async function downloadShareImage(persona: PersonaType, scores: Scores) {
  const url = await createShareImageUrl(persona, scores);
  if (!url) return false;

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

export async function previewShareImage(persona: PersonaType, scores: Scores) {
  const url = await createShareImageUrl(persona, scores);
  if (!url) return;
  renderPreview(url, "分享图预览", getSaveHint(), `大学生野生人格图鉴-${persona.name}.png`);
}

function renderPreview(url: string, title: string, hint: string, filename: string) {
  document.querySelector(".wild-share-preview")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "wild-share-preview";
  overlay.innerHTML = `
    <div class="wild-share-preview-panel">
      <div class="wild-share-preview-head">
        <span>${title}</span>
        <button type="button" aria-label="关闭">关闭</button>
      </div>
      <img src="${url}" alt="${title}" />
      <p>${hint}</p>
      <a class="wild-preview-download" href="${url}" download="${filename}">下载图片</a>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector("button")?.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.remove();
  });
}

function createQrMatrix(text: string) {
  const version = 2;
  const size = 17 + version * 4;
  const dataCodewords = 28;
  const eccCodewords = 16;
  const matrix: Array<Array<boolean | null>> = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => false));

  function set(x: number, y: number, dark: boolean, reserve = true) {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    matrix[y][x] = dark;
    if (reserve) reserved[y][x] = true;
  }

  addFinder(set, 0, 0, size);
  addFinder(set, size - 7, 0, size);
  addFinder(set, 0, size - 7, size);
  addTiming(set, reserved, size);
  addAlignment(set, reserved, 18, 18);
  set(8, 4 * version + 9, true);
  reserveFormat(reserved, size);

  const data = makeDataCodewords(text, dataCodewords);
  const ecc = reedSolomon(data, eccCodewords);
  placeData(matrix, reserved, [...data, ...ecc], 0);
  addFormatBits(set, size, 0, 0);

  return matrix.map((row) => row.map(Boolean));
}

function addFinder(set: (x: number, y: number, dark: boolean, reserve?: boolean) => void, x: number, y: number, size: number) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= size || yy >= size) continue;
      const dark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      set(xx, yy, dark);
    }
  }
}

function addTiming(
  set: (x: number, y: number, dark: boolean, reserve?: boolean) => void,
  reserved: boolean[][],
  size: number,
) {
  for (let i = 8; i < size - 8; i += 1) {
    if (!reserved[6][i]) set(i, 6, i % 2 === 0);
    if (!reserved[i][6]) set(6, i, i % 2 === 0);
  }
}

function addAlignment(
  set: (x: number, y: number, dark: boolean, reserve?: boolean) => void,
  reserved: boolean[][],
  cx: number,
  cy: number,
) {
  if (reserved[cy][cx]) return;
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
}

function reserveFormat(reserved: boolean[][], size: number) {
  for (let i = 0; i <= 8; i += 1) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i += 1) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }
}

function makeDataCodewords(text: string, dataCodewords: number) {
  const bytes = Array.from(text).map((char) => char.charCodeAt(0));
  const bits: number[] = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  bytes.forEach((byte) => appendBits(bits, byte, 8));

  const capacity = dataCodewords * 8;
  appendBits(bits, 0, Math.min(4, capacity - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    codewords.push(bits.slice(i, i + 8).reduce((value, bit) => (value << 1) | bit, 0));
  }

  for (let pad = 0xec; codewords.length < dataCodewords; pad = pad === 0xec ? 0x11 : 0xec) {
    codewords.push(pad);
  }

  return codewords;
}

function appendBits(bits: number[], value: number, length: number) {
  for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
}

function placeData(matrix: Array<Array<boolean | null>>, reserved: boolean[][], codewords: number[], mask: number) {
  const size = matrix.length;
  const bits = codewords.flatMap((byte) => Array.from({ length: 8 }, (_, index) => (byte >>> (7 - index)) & 1));
  let bitIndex = 0;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vert = 0; vert < size; vert += 1) {
      const y = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        if (reserved[y][x]) continue;
        const bit = bitIndex < bits.length ? bits[bitIndex] === 1 : false;
        bitIndex += 1;
        matrix[y][x] = bit !== getMask(mask, x, y);
      }
    }
    upward = !upward;
  }
}

function getMask(mask: number, x: number, y: number) {
  if (mask === 0) return (x + y) % 2 === 0;
  return false;
}

function addFormatBits(
  set: (x: number, y: number, dark: boolean, reserve?: boolean) => void,
  size: number,
  eccLevelBits: number,
  mask: number,
) {
  const data = (eccLevelBits << 3) | mask;
  let value = data << 10;
  for (let i = 14; i >= 10; i -= 1) {
    if (((value >>> i) & 1) !== 0) value ^= 0x537 << (i - 10);
  }
  const format = ((data << 10) | value) ^ 0x5412;
  const bit = (i: number) => ((format >>> i) & 1) !== 0;

  for (let i = 0; i <= 5; i += 1) set(8, i, bit(i));
  set(8, 7, bit(6));
  set(8, 8, bit(7));
  set(7, 8, bit(8));
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i += 1) set(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i += 1) set(8, size - 15 + i, bit(i));
  set(8, size - 8, true);
}

function reedSolomon(data: number[], degree: number) {
  const generator = rsGenerator(degree);
  const result = Array.from({ length: degree }, () => 0);

  data.forEach((byte) => {
    const factor = byte ^ result.shift()!;
    result.push(0);
    for (let i = 0; i < degree; i += 1) {
      result[i] ^= gfMul(generator[i + 1], factor);
    }
  });

  return result;
}

function rsGenerator(degree: number) {
  let generator = [1];
  for (let i = 0; i < degree; i += 1) {
    generator = polyMul(generator, [1, gfPow(i)]);
  }
  return generator;
}

function polyMul(a: number[], b: number[]) {
  const result = Array.from({ length: a.length + b.length - 1 }, () => 0);
  a.forEach((av, i) => {
    b.forEach((bv, j) => {
      result[i + j] ^= gfMul(av, bv);
    });
  });
  return result;
}

const gf = (() => {
  const exp = Array.from({ length: 512 }, () => 0);
  const log = Array.from({ length: 256 }, () => 0);
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) exp[i] = exp[i - 255];
  return { exp, log };
})();

function gfPow(power: number) {
  return gf.exp[power];
}

function gfMul(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return gf.exp[gf.log[a] + gf.log[b]];
}
