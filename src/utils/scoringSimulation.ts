import { wildPersonaQuestions } from "../data/wildPersonaQuestions";
import { personaTypes, type PersonaCode } from "../data/wildPersonaTypes";
import { addEffect, emptyScores, getPersonaCode } from "./scoring";

export type SimulationRow = {
  code: PersonaCode;
  name: string;
  count: number;
  ratio: string;
};

export function simulateRandomDistribution(iterations = 5000): SimulationRow[] {
  const counts = new Map<PersonaCode, number>();

  for (let index = 0; index < iterations; index += 1) {
    let scores = emptyScores();

    for (const question of wildPersonaQuestions) {
      const option = question.options[Math.floor(Math.random() * question.options.length)];
      scores = addEffect(scores, option.effect);
    }

    const code = getPersonaCode(scores);
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  return (Object.keys(personaTypes) as PersonaCode[])
    .map((code) => {
      const count = counts.get(code) ?? 0;
      return {
        code,
        name: personaTypes[code].name,
        count,
        ratio: `${((count / iterations) * 100).toFixed(2)}%`,
      };
    })
    .sort((a, b) => b.count - a.count);
}
