import type { PersonaCode, ScoreKey } from "./wildPersonaTypes";

export type PersonaPrototype = Record<ScoreKey, number>;

export const dimensionWeights: Record<ScoreKey, number> = {
  rhythm: 1,
  energy: 1,
  social: 0.9,
  posture: 0.9,
};

export const personaPrototypes: Record<PersonaCode, PersonaPrototype> = {
  AAAA: { rhythm: 50, energy: 49, social: 45, posture: 50 },
  AAAB: { rhythm: 44, energy: 35, social: 47, posture: -39 },
  AABA: { rhythm: 47, energy: 47, social: -40, posture: 48 },
  AABB: { rhythm: 41, energy: 41, social: -50, posture: -46 },
  ABAA: { rhythm: 41, energy: -41, social: 50, posture: 44 },
  ABAB: { rhythm: 35, energy: -51, social: 44, posture: -49 },
  ABBA: { rhythm: 38, energy: -40, social: -51, posture: 37 },
  ABBB: { rhythm: 30, energy: -46, social: -38, posture: -52 },
  BAAA: { rhythm: -48, energy: 50, social: 47, posture: 47 },
  BAAB: { rhythm: -42, energy: 40, social: 52, posture: -40 },
  BABA: { rhythm: -39, energy: 45, social: -40, posture: 51 },
  BABB: { rhythm: -45, energy: 37, social: -47, posture: -52 },
  BBAA: { rhythm: -52, energy: -45, social: 44, posture: 41 },
  BBAB: { rhythm: -49, energy: -52, social: 41, posture: -42 },
  BBBA: { rhythm: -43, energy: -40, social: -52, posture: 39 },
  BBBB: { rhythm: -52, energy: -49, social: -37, posture: -43 },
};
