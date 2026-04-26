import { personaTypes, type PersonaCode, type Scores, type ScoreKey } from "../data/wildPersonaTypes";
import type { OptionEffect } from "../data/wildPersonaQuestions";

export const scoreKeys: ScoreKey[] = ["rhythm", "energy", "social", "posture"];

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
  return [
    scores.rhythm > 0 ? "A" : "B",
    scores.energy > 0 ? "A" : "B",
    scores.social > 0 ? "A" : "B",
    scores.posture > 0 ? "A" : "B",
  ].join("") as PersonaCode;
}

export function getPersona(scores: Scores) {
  return personaTypes[getPersonaCode(scores)];
}

export function axisPercent(value: number) {
  const normalized = Math.max(-24, Math.min(24, value));
  const positive = Math.round(((normalized + 24) / 48) * 100);
  return {
    positive,
    negative: 100 - positive,
  };
}
