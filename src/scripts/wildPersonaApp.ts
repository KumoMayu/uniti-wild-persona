import { wildPersonaQuestions, type WildOption, type WildQuestion } from "../data/wildPersonaQuestions";
import { personaTypes, type PersonaCode, type Scores, type ScoreKey } from "../data/wildPersonaTypes";
import { addEffect, axisPercent, emptyScores, getPersona, getPersonaCode } from "../utils/scoring";
import { downloadShareImage, previewShareImage } from "../utils/share";
import { shuffle } from "../utils/shuffle";
import { readStoredResult, saveStoredResult, type StoredResult } from "../utils/storage";

type PreparedQuestion = Omit<WildQuestion, "options"> & {
  options: WildOption[];
};

type Answer = {
  questionId: string;
  optionId: string;
  effect: WildOption["effect"];
};

type Mode = "start" | "quiz" | "result";

type StatsPayload = {
  totalCompleted: number;
  personas: Record<string, number>;
};

const pageSize = 6;

const axisRows: Array<{ key: ScoreKey; label: string; positive: string; negative: string }> = [
  { key: "rhythm", label: "节奏", positive: "提前铺垫", negative: "卡点启动" },
  { key: "energy", label: "能量", positive: "稳定续航", negative: "波动爆发" },
  { key: "social", label: "状态来源", positive: "自己消化", negative: "靠外界带动" },
  { key: "posture", label: "生活姿态", positive: "收着活", negative: "放着活" },
];

const state: {
  mode: Mode;
  questions: PreparedQuestion[];
  pageIndex: number;
  answers: Record<string, Answer>;
  resultScores: Scores | null;
  resultCode: PersonaCode | null;
  storedResult: StoredResult | null;
  stats: StatsPayload | null;
} = {
  mode: "start",
  questions: [],
  pageIndex: 0,
  answers: {},
  resultScores: null,
  resultCode: null,
  storedResult: null,
  stats: null,
};

const root = document.querySelector<HTMLDivElement>("#wild-persona-root");

function prepareQuestions(): PreparedQuestion[] {
  return shuffle(wildPersonaQuestions).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

function calculateScores(answers: Answer[]): Scores {
  return answers.reduce((scores, answer) => addEffect(scores, answer.effect), emptyScores());
}

function answeredCount() {
  return Object.keys(state.answers).length;
}

function pageCount() {
  return Math.ceil(state.questions.length / pageSize);
}

function currentPageQuestions() {
  const start = state.pageIndex * pageSize;
  return state.questions.slice(start, start + pageSize);
}

function currentPageMissing() {
  return currentPageQuestions().filter((question) => !state.answers[question.id]);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  if (!root) return;

  if (state.mode === "quiz") {
    renderQuiz();
    return;
  }

  if (state.mode === "result" && state.resultScores && state.resultCode) {
    renderResult();
    return;
  }

  renderStart();
}

function renderStart() {
  if (!root) return;

  const lastPersona = state.storedResult ? personaTypes[state.storedResult.code] : null;
  root.innerHTML = `
    <section class="wild-card wild-start" aria-labelledby="wild-title">
      <div class="wild-kicker">24 题，约 3 分钟</div>
      <h1 id="wild-title">大学生野生人格图鉴</h1>
      <p>测测你到底是什么校园活人</p>
      <div class="wild-actions">
        <button class="wild-button wild-button-primary" type="button" data-action="start">开始测</button>
        ${
          lastPersona
            ? '<button class="wild-button wild-button-ghost" type="button" data-action="last">查看上次结果</button>'
            : ""
        }
      </div>
      ${lastPersona ? `<div class="wild-last">上次：${escapeHtml(lastPersona.name)}</div>` : ""}
      ${renderStatsLine()}
    </section>
  `;

  root.querySelector('[data-action="start"]')?.addEventListener("click", startQuiz);
  root.querySelector('[data-action="last"]')?.addEventListener("click", showLastResult);
}

function renderQuiz() {
  if (!root) return;

  const pageQuestions = currentPageQuestions();
  const pageStart = state.pageIndex * pageSize + 1;
  const pageEnd = pageStart + pageQuestions.length - 1;
  const missing = currentPageMissing().length;

  root.innerHTML = `
    <section class="wild-quiz-flow" aria-labelledby="quiz-title">
      <div class="wild-quiz-head">
        <div>
          <div class="wild-kicker">第 ${state.pageIndex + 1}/${pageCount()} 页</div>
          <h1 id="quiz-title">选最像你的</h1>
        </div>
        <div class="wild-progress-stack">
          <span data-progress-text>${answeredCount()}/${state.questions.length}</span>
          <div class="wild-progress" aria-label="答题进度">
            <div data-progress-bar style="width: ${(answeredCount() / state.questions.length) * 100}%"></div>
          </div>
        </div>
      </div>

      <div class="wild-card wild-page-card">
        <div class="wild-page-title">
          <span>${pageStart}-${pageEnd}</span>
          <span data-page-hint>${missing ? `还差 ${missing} 题` : "本页完成"}</span>
        </div>
        <div class="wild-page-questions">
          ${pageQuestions.map((question, index) => renderQuestionBlock(question, pageStart + index)).join("")}
        </div>
      </div>

      <div class="wild-submit-bar">
        <button class="wild-button wild-button-ghost" type="button" data-action="prev" ${state.pageIndex === 0 ? "disabled" : ""}>
          上一页
        </button>
        <button class="wild-button wild-button-primary" type="button" data-action="advance"></button>
      </div>
    </section>
  `;

  root.querySelectorAll<HTMLButtonElement>("[data-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = button.dataset.question;
      const optionId = button.dataset.option;
      const question = state.questions.find((item) => item.id === questionId);
      const option = question?.options.find((item) => item.id === optionId);
      if (question && option) chooseOption(question, option, button);
    });
  });

  root.querySelector('[data-action="prev"]')?.addEventListener("click", previousPage);
  root.querySelector('[data-action="advance"]')?.addEventListener("click", advancePage);
  updateQuizProgress();
}

function renderQuestionBlock(question: PreparedQuestion, number: number) {
  const answer = state.answers[question.id];
  return `
    <article class="wild-question-block" data-question-block="${question.id}">
      <div class="wild-question-number">Q${number}</div>
      <h2>${escapeHtml(question.text)}</h2>
      <div class="wild-options">
        ${question.options
          .map(
            (option) => `
              <button
                class="wild-option${answer?.optionId === option.id ? " is-selected" : ""}"
                type="button"
                data-question="${question.id}"
                data-option="${option.id}"
              >
                ${escapeHtml(option.text)}
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderResult() {
  if (!root || !state.resultScores) return;

  const persona = getPersona(state.resultScores);
  const barMarkup = axisRows
    .map((axis) => {
      const percents = axisPercent(state.resultScores?.[axis.key] ?? 0);
      return `
        <div class="wild-bar-item">
          <div class="wild-bar-copy">
            <strong>${axis.label}</strong>
            <span>${axis.positive} ${percents.positive}% ｜ ${axis.negative} ${percents.negative}%</span>
          </div>
          <div class="wild-bar-track"><div style="width: ${percents.positive}%"></div></div>
        </div>
      `;
    })
    .join("");

  root.innerHTML = `
    <section class="wild-result-layout" aria-labelledby="result-title">
      <div class="wild-card wild-result-primary">
        <div class="wild-kicker">你的类型</div>
        <div class="wild-title-row">
          <h1 id="result-title">${escapeHtml(persona.name)}</h1>
          <span>${escapeHtml(persona.englishName)}</span>
        </div>
        <p class="wild-line">${escapeHtml(persona.line)}</p>
        <p class="wild-desc">${escapeHtml(persona.description)}</p>
        <div class="wild-statement-grid">
          <div class="wild-statement">
            <h2>你最像的状态</h2>
            <p>${escapeHtml(persona.state)}</p>
          </div>
          <div class="wild-statement">
            <h2>你大概会说的话</h2>
            <p>${persona.quotes.map((quote) => escapeHtml(quote)).join("<br />")}</p>
          </div>
        </div>
        <div class="wild-result-notes">
          ${renderMiniList("高光", persona.highlights)}
          ${renderMiniList("翻车点", persona.risks)}
          ${renderMiniList("活法", persona.life)}
        </div>
      </div>
      <aside class="wild-result-side">
        <div class="wild-card wild-side-card">
          <h2>四维剖面</h2>
          <div class="wild-bars">${barMarkup}</div>
        </div>
        <div class="wild-card wild-side-card wild-action-card">
          ${renderStatsLine()}
          <button class="wild-button wild-button-primary" type="button" data-action="share">下载结果图</button>
          <button class="wild-button wild-button-ghost" type="button" data-action="preview">预览分享图</button>
          <button class="wild-button wild-button-ghost" type="button" data-action="restart">重新测</button>
        </div>
      </aside>
    </section>
  `;

  root.querySelector('[data-action="share"]')?.addEventListener("click", async () => {
    if (!state.resultScores) return;
    const ok = await downloadShareImage(persona, state.resultScores);
    if (!ok) previewShareImage(persona, state.resultScores);
  });
  root.querySelector('[data-action="preview"]')?.addEventListener("click", () => {
    if (state.resultScores) previewShareImage(persona, state.resultScores);
  });
  root.querySelector('[data-action="restart"]')?.addEventListener("click", startQuiz);
}

function renderMiniList(title: string, items: string[]) {
  return `
    <div class="wild-mini-list">
      <h2>${title}</h2>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function renderStatsLine() {
  if (!state.stats || state.stats.totalCompleted <= 0) return "";

  const common = getMostCommonPersona(state.stats.personas);
  const commonCopy = common ? `，当前最常见是 ${escapeHtml(common)}` : "";
  return `<div class="wild-stats-line">已有 ${state.stats.totalCompleted} 人测过${commonCopy}</div>`;
}

function getMostCommonPersona(personas: Record<string, number>) {
  const [name, count] =
    Object.entries(personas).sort((a, b) => b[1] - a[1])[0] ?? [];
  return count > 0 ? name : "";
}

function startQuiz() {
  state.mode = "quiz";
  state.questions = prepareQuestions();
  state.pageIndex = 0;
  state.answers = {};
  state.resultScores = null;
  state.resultCode = null;
  render();
  scrollToTop();
}

function showLastResult() {
  if (!state.storedResult) return;
  state.mode = "result";
  state.resultScores = state.storedResult.scores;
  state.resultCode = state.storedResult.code;
  render();
  scrollToTop();
}

function chooseOption(question: PreparedQuestion, option: WildOption, button: HTMLButtonElement) {
  const wasComplete = currentPageMissing().length === 0;
  state.answers[question.id] = {
    questionId: question.id,
    optionId: option.id,
    effect: option.effect,
  };

  root?.querySelectorAll<HTMLButtonElement>(`[data-question="${question.id}"]`).forEach((item) => {
    item.classList.toggle("is-selected", item === button);
  });
  root?.querySelector(`[data-question-block="${question.id}"]`)?.classList.remove("is-missing");
  updateQuizProgress();

  const isNowComplete = currentPageMissing().length === 0;
  if (!wasComplete && isNowComplete && state.pageIndex < pageCount() - 1) {
    window.setTimeout(() => {
      if (currentPageMissing().length === 0) nextPage();
    }, 420);
  }
}

function updateQuizProgress() {
  const count = answeredCount();
  const total = state.questions.length;
  const missing = currentPageMissing().length;
  const progress = total ? (count / total) * 100 : 0;

  root?.querySelector("[data-progress-text]")?.replaceChildren(document.createTextNode(`${count}/${total}`));
  root?.querySelector("[data-page-hint]")?.replaceChildren(document.createTextNode(missing ? `还差 ${missing} 题` : "本页完成"));

  const bar = root?.querySelector<HTMLElement>("[data-progress-bar]");
  if (bar) bar.style.width = `${progress}%`;

  const advance = root?.querySelector<HTMLButtonElement>('[data-action="advance"]');
  if (!advance) return;

  if (state.pageIndex === pageCount() - 1) {
    advance.textContent = missing ? `还差 ${missing} 题` : "看结果";
  } else {
    advance.textContent = missing ? `还差 ${missing} 题` : "下一页";
  }

  advance.classList.toggle("is-ready", missing === 0);
}

function previousPage() {
  if (state.pageIndex === 0) return;
  state.pageIndex -= 1;
  render();
  scrollToTop();
}

function nextPage() {
  if (state.pageIndex >= pageCount() - 1) return;
  state.pageIndex += 1;
  render();
  scrollToTop();
}

function advancePage() {
  const missing = currentPageMissing();
  if (missing.length > 0) {
    markMissing(missing[0]);
    return;
  }

  if (state.pageIndex === pageCount() - 1) {
    finishQuiz();
    return;
  }

  nextPage();
}

function markMissing(question: PreparedQuestion) {
  const block = root?.querySelector<HTMLElement>(`[data-question-block="${question.id}"]`);
  if (!block) return;
  block.classList.add("is-missing");
  block.scrollIntoView({ behavior: "smooth", block: "center" });
}

function finishQuiz() {
  const scores = calculateScores(Object.values(state.answers));
  const code = getPersonaCode(scores);
  const result = {
    code,
    scores,
    answeredAt: new Date().toISOString(),
  };

  saveStoredResult(result);
  state.storedResult = result;
  state.resultScores = scores;
  state.resultCode = code;
  state.mode = "result";
  render();
  void trackCompletion(getPersona(scores).name, result.answeredAt);
  scrollToTop();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

state.storedResult = readStoredResult();
render();
void loadStats();

async function loadStats() {
  try {
    const response = await fetch("/api/stats", { headers: { accept: "application/json" } });
    if (!response.ok) return;
    state.stats = (await response.json()) as StatsPayload;
    if (state.mode === "start" || state.mode === "result") render();
  } catch {
    // Static preview without Pages Functions is fine.
  }
}

async function trackCompletion(persona: string, answeredAt: string) {
  const key = `wild-persona:tracked:${answeredAt}`;
  if (window.localStorage.getItem(key)) return;

  try {
    const response = await fetch("/api/track-complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ persona }),
    });

    if (!response.ok) return;
    window.localStorage.setItem(key, "1");
    await loadStats();
  } catch {
    // Do not block the result page if stats are unavailable.
  }
}
