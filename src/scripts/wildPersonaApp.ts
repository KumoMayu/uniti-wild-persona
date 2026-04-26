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

const axisRows: Array<{ key: ScoreKey; label: string; positive: string; negative: string }> = [
  { key: "rhythm", label: "节奏", positive: "提前铺垫", negative: "卡点启动" },
  { key: "energy", label: "能量", positive: "稳定续航", negative: "波动爆发" },
  { key: "social", label: "状态来源", positive: "自己消化", negative: "靠外界带动" },
  { key: "posture", label: "生活姿态", positive: "收着活", negative: "放着活" },
];

const state: {
  mode: Mode;
  questions: PreparedQuestion[];
  answers: Record<string, Answer>;
  resultScores: Scores | null;
  resultCode: PersonaCode | null;
  storedResult: StoredResult | null;
} = {
  mode: "start",
  questions: [],
  answers: {},
  resultScores: null,
  resultCode: null,
  storedResult: null,
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  if (!root) {
    return;
  }

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
  if (!root) {
    return;
  }

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
    </section>
  `;

  root.querySelector('[data-action="start"]')?.addEventListener("click", startQuiz);
  root.querySelector('[data-action="last"]')?.addEventListener("click", showLastResult);
}

function renderQuiz() {
  if (!root) {
    return;
  }

  const groups = chunkQuestions(state.questions, 6);
  root.innerHTML = `
    <section class="wild-quiz-flow" aria-labelledby="quiz-title">
      <div class="wild-quiz-head">
        <div>
          <div class="wild-kicker">滚动答题</div>
          <h1 id="quiz-title">选最像你的</h1>
        </div>
        <div class="wild-progress-stack">
          <span data-progress-text>${answeredCount()}/${state.questions.length}</span>
          <div class="wild-progress" aria-label="答题进度">
            <div data-progress-bar style="width: ${(answeredCount() / state.questions.length) * 100}%"></div>
          </div>
        </div>
      </div>
      <div class="wild-question-groups">
        ${groups
          .map(
            (group, groupIndex) => `
              <div class="wild-card wild-question-group">
                <div class="wild-group-title">第 ${groupIndex * 6 + 1}-${groupIndex * 6 + group.length} 题</div>
                ${group.map((question) => renderQuestionBlock(question)).join("")}
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="wild-submit-bar">
        <button class="wild-button wild-button-primary" type="button" data-action="submit">看结果</button>
      </div>
    </section>
  `;

  root.querySelectorAll<HTMLButtonElement>("[data-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = button.dataset.question;
      const optionId = button.dataset.option;
      const question = state.questions.find((item) => item.id === questionId);
      const option = question?.options.find((item) => item.id === optionId);

      if (!question || !option) {
        return;
      }

      chooseOption(question, option, button);
    });
  });

  root.querySelector('[data-action="submit"]')?.addEventListener("click", submitQuiz);
  updateQuizProgress();
}

function renderQuestionBlock(question: PreparedQuestion) {
  const answer = state.answers[question.id];
  return `
    <article class="wild-question-block" data-question-block="${question.id}">
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
  if (!root || !state.resultScores) {
    return;
  }

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
          <button class="wild-button wild-button-primary" type="button" data-action="share">下载结果图</button>
          <button class="wild-button wild-button-ghost" type="button" data-action="preview">预览分享图</button>
          <button class="wild-button wild-button-ghost" type="button" data-action="restart">重新测</button>
        </div>
      </aside>
    </section>
  `;

  root.querySelector('[data-action="share"]')?.addEventListener("click", async () => {
    if (!state.resultScores) {
      return;
    }
    const ok = await downloadShareImage(persona, state.resultScores);
    if (!ok) {
      previewShareImage(persona, state.resultScores);
    }
  });
  root.querySelector('[data-action="preview"]')?.addEventListener("click", () => {
    if (state.resultScores) {
      previewShareImage(persona, state.resultScores);
    }
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

function chunkQuestions(items: PreparedQuestion[], size: number) {
  const groups: PreparedQuestion[][] = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

function startQuiz() {
  state.mode = "quiz";
  state.questions = prepareQuestions();
  state.answers = {};
  state.resultScores = null;
  state.resultCode = null;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLastResult() {
  if (!state.storedResult) {
    return;
  }
  state.mode = "result";
  state.resultScores = state.storedResult.scores;
  state.resultCode = state.storedResult.code;
  render();
}

function chooseOption(question: PreparedQuestion, option: WildOption, button: HTMLButtonElement) {
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
}

function updateQuizProgress() {
  const count = answeredCount();
  const total = state.questions.length;
  const progress = total ? (count / total) * 100 : 0;
  root?.querySelector("[data-progress-text]")?.replaceChildren(document.createTextNode(`${count}/${total}`));
  const bar = root?.querySelector<HTMLElement>("[data-progress-bar]");
  if (bar) {
    bar.style.width = `${progress}%`;
  }
  const submit = root?.querySelector<HTMLButtonElement>('[data-action="submit"]');
  if (submit) {
    submit.textContent = count === total ? "看结果" : `还差 ${total - count} 题`;
    submit.classList.toggle("is-ready", count === total);
  }
}

function submitQuiz() {
  if (answeredCount() < state.questions.length) {
    const missing = state.questions.find((question) => !state.answers[question.id]);
    const block = missing ? root?.querySelector<HTMLElement>(`[data-question-block="${missing.id}"]`) : null;
    if (block) {
      block.classList.add("is-missing");
      block.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  finishQuiz();
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

state.storedResult = readStoredResult();
render();
