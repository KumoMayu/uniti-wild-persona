import type { OptionEffect } from "../data/wildPersonaQuestions";
import { dimensionWeights, personaPrototypes, type PersonaPrototype } from "../data/wildPersonaPrototypes";
import { personaTypes, type PersonaCode, type Scores, type ScoreKey } from "../data/wildPersonaTypes";

export const scoreKeys: ScoreKey[] = ["rhythm", "energy", "social", "posture"];

type PersonaCandidate = {
  code: PersonaCode;
  name: string;
  distance: number;
};

export type PersonaMatchDebug = {
  rawScores: Scores;
  normalizedScores: Scores;
  candidates: PersonaCandidate[];
};

const dimensionRawLimit = 12;

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
      name: personaTypes[code].name,
      distance: getWeightedManhattanDistance(normalizedScores, personaPrototypes[code]),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    ...candidates[0],
    rawScores: { ...scores },
    normalizedScores,
    candidates: candidates.slice(0, 5),
  };
}

export function normalizeScores(scores: Scores): Scores {
  return scoreKeys.reduce<Scores>((next, key) => {
    return {
      ...next,
      [key]: Math.round(Math.max(-100, Math.min(100, (scores[key] / dimensionRawLimit) * 100))),
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
  return Math.max(-100, Math.min(100, (value / dimensionRawLimit) * 100));
}
