import { wildPersonaQuestions, type WildOption, type WildQuestion } from "../data/wildPersonaQuestions";
import { personaTypes, type PersonaCode, type Scores, type ScoreKey } from "../data/wildPersonaTypes";
import { addEffect, axisPercent, emptyScores, getPersona, getPersonaCode } from "../utils/scoring";
import { shuffle } from "../utils/shuffle";
import { downloadShareImage } from "../utils/share";
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
  index: number;
  answers: Answer[];
  resultScores: Scores | null;
  resultCode: PersonaCode | null;
  storedResult: StoredResult | null;
  locked: boolean;
} = {
  mode: "start",
  questions: [],
  index: 0,
  answers: [],
  resultScores: null,
  resultCode: null,
  storedResult: null,
  locked: false,
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
    renderQuestion();
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

function renderQuestion() {
  if (!root) {
    return;
  }

  const question = state.questions[state.index];
  const progress = ((state.index + 1) / state.questions.length) * 100;
  root.innerHTML = `
    <section class="wild-card wild-question" aria-labelledby="question-title">
      <div class="wild-progress-row">
        <span>${state.index + 1}/${state.questions.length}</span>
        <div class="wild-progress" aria-label="答题进度">
          <div style="width: ${progress}%"></div>
        </div>
      </div>
      <h1 id="question-title">${escapeHtml(question.text)}</h1>
      <div class="wild-options">
        ${question.options
          .map(
            (option) => `
              <button class="wild-option" type="button" data-option="${option.id}">
                ${escapeHtml(option.text)}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  root.querySelectorAll<HTMLButtonElement>("[data-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.option;
      const option = question.options.find((item) => item.id === id);
      if (!option) {
        return;
      }
      chooseOption(option, button);
    });
  });
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
    <section class="wild-result-grid" aria-labelledby="result-title">
      <div class="wild-card wild-result-main">
        <div class="wild-kicker">你的类型</div>
        <h1 id="result-title">${escapeHtml(persona.name)}</h1>
        <div class="wild-english">${escapeHtml(persona.englishName)}</div>
        <p class="wild-line">${escapeHtml(persona.line)}</p>
        <p class="wild-desc">${escapeHtml(persona.description)}</p>
      </div>
      <div class="wild-card wild-result-panel">
        <h2>四维剖面</h2>
        <div class="wild-bars">${barMarkup}</div>
      </div>
      ${renderListCard("高光", persona.highlights)}
      ${renderListCard("翻车点", persona.risks)}
      ${renderListCard("建议", persona.advice)}
      <div class="wild-result-actions">
        <button class="wild-button wild-button-primary" type="button" data-action="share">下载结果图</button>
        <button class="wild-button wild-button-ghost" type="button" data-action="restart">重新测</button>
      </div>
    </section>
  `;

  root.querySelector('[data-action="share"]')?.addEventListener("click", () => {
    if (state.resultScores) {
      downloadShareImage(persona, state.resultScores);
    }
  });
  root.querySelector('[data-action="restart"]')?.addEventListener("click", startQuiz);
}

function renderListCard(title: string, items: string[]) {
  return `
    <div class="wild-card wild-list-card">
      <h2>${title}</h2>
      <ul>
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function startQuiz() {
  state.mode = "quiz";
  state.questions = prepareQuestions();
  state.index = 0;
  state.answers = [];
  state.resultScores = null;
  state.resultCode = null;
  state.locked = false;
  render();
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

function chooseOption(option: WildOption, button: HTMLButtonElement) {
  if (state.locked) {
    return;
  }

  state.locked = true;
  root?.querySelectorAll<HTMLButtonElement>(".wild-option").forEach((item) => {
    item.disabled = true;
  });
  button.classList.add("is-selected");

  const nextAnswers = [
    ...state.answers,
    {
      questionId: state.questions[state.index].id,
      optionId: option.id,
      effect: option.effect,
    },
  ];

  window.setTimeout(() => {
    state.answers = nextAnswers;
    state.locked = false;

    if (state.index >= state.questions.length - 1) {
      finishQuiz();
      return;
    }

    state.index += 1;
    render();
  }, 180);
}

function finishQuiz() {
  const scores = calculateScores(state.answers);
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
}

state.storedResult = readStoredResult();
render();
