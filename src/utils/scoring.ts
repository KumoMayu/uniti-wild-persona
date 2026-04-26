import type { OptionEffect } from "../data/wildPersonaQuestions";
import { wildPersonaQuestions } from "../data/wildPersonaQuestions";
import { personaTypes, type PersonaCode, type Scores, type ScoreKey } from "../data/wildPersonaTypes";

export const scoreKeys: ScoreKey[] = ["rhythm", "energy", "social", "posture"];

type PersonaPrototype = Record<ScoreKey, number>;

type PersonaCandidate = {
  code: PersonaCode;
  distance: number;
};

export type PersonaMatchDebug = {
  normalizedScores: Scores;
  candidates: PersonaCandidate[];
};

const dimensionWeights: Record<ScoreKey, number> = {
  rhythm: 1,
  energy: 1,
  social: 0.9,
  posture: 0.9,
};

const personaPrototypes: Record<PersonaCode, PersonaPrototype> = {
  AAAA: { rhythm: 75, energy: 70, social: 55, posture: 70 },
  AAAB: { rhythm: 55, energy: -35, social: 65, posture: -25 },
  AABA: { rhythm: 60, energy: 55, social: -40, posture: 65 },
  AABB: { rhythm: 45, energy: -10, social: -75, posture: -70 },
  ABAA: { rhythm: 35, energy: -45, social: 80, posture: 55 },
  ABAB: { rhythm: -10, energy: -80, social: 60, posture: -75 },
  ABBA: { rhythm: 0, energy: -40, social: -70, posture: -30 },
  ABBB: { rhythm: -35, energy: -65, social: 10, posture: -90 },
  BAAA: { rhythm: -45, energy: 65, social: 70, posture: 60 },
  BAAB: { rhythm: -20, energy: 20, social: 85, posture: -35 },
  BABA: { rhythm: -15, energy: 40, social: -30, posture: 75 },
  BABB: { rhythm: -40, energy: -20, social: -55, posture: -85 },
  BBAA: { rhythm: -85, energy: -55, social: 60, posture: 35 },
  BBAB: { rhythm: -70, energy: -90, social: 40, posture: -40 },
  BBBA: { rhythm: -50, energy: -25, social: -90, posture: 25 },
  BBBB: { rhythm: -90, energy: -70, social: 15, posture: -55 },
};

const scoreScale = getScoreScale();

export const emptyScores = (): Scores => ({
  rhythm: 0,
  energy: 0,
  social: 0,
  posture: 0,
});

export function addEffect(scores: Scores, effect: OptionEffect): Scores {
  return scoreKeys.reduce<Scores>(
    (next, key) => ({
      ...next,
      [key]: next[key] + (effect[key] ?? 0),
    }),
    { ...scores },
  );
}

export function getPersonaCode(scores: Scores): PersonaCode {
  return getPersonaMatch(scores).code;
}

export function getPersona(scores: Scores) {
  return personaTypes[getPersonaCode(scores)];
}

export function getPersonaMatch(scores: Scores): PersonaCandidate & PersonaMatchDebug {
  const normalizedScores = normalizeScores(scores);
  const candidates = (Object.keys(personaPrototypes) as PersonaCode[])
    .map((code) => ({
      code,
      distance: getWeightedManhattanDistance(normalizedScores, personaPrototypes[code]),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    ...candidates[0],
    normalizedScores,
    candidates: candidates.slice(0, 3),
  };
}

export function normalizeScores(scores: Scores): Scores {
  return scoreKeys.reduce<Scores>((next, key) => {
    const scale = scoreScale[key] || 1;
    return {
      ...next,
      [key]: Math.round(Math.max(-100, Math.min(100, (scores[key] / scale) * 100))),
    };
  }, emptyScores());
}

export function axisPercent(value: number, key?: ScoreKey) {
  const normalized = normalizeAxisValue(value, key);
  const positive = Math.round((normalized + 100) / 2);
  return {
    positive,
    negative: 100 - positive,
  };
}

function getWeightedManhattanDistance(scores: Scores, prototype: PersonaPrototype) {
  return scoreKeys.reduce((distance, key) => {
    return distance + Math.abs(scores[key] - prototype[key]) * dimensionWeights[key];
  }, 0);
}

function normalizeAxisValue(value: number, key?: ScoreKey) {
  const fallbackScale = 24;
  const scale = key ? scoreScale[key] || fallbackScale : Math.max(...Object.values(scoreScale), fallbackScale);
  return Math.max(-100, Math.min(100, (value / scale) * 100));
}

function getScoreScale() {
  return wildPersonaQuestions.reduce<Record<ScoreKey, number>>(
    (scales, question) => {
      scoreKeys.forEach((key) => {
        const maxEffect = Math.max(...question.options.map((option) => Math.abs(option.effect[key] ?? 0)));
        scales[key] += maxEffect;
      });
      return scales;
    },
    { rhythm: 0, energy: 0, social: 0, posture: 0 },
  );
}
