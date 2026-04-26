import type { PersonaCode, Scores } from "../data/wildPersonaTypes";

const STORAGE_KEY = "wild-persona:last-result";

export type StoredResult = {
  code: PersonaCode;
  scores: Scores;
  answeredAt: string;
};

export function readStoredResult(): StoredResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredResult) : null;
  } catch {
    return null;
  }
}

export function saveStoredResult(result: StoredResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}
