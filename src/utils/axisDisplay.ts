import type { Scores, ScoreKey } from "../data/wildPersonaTypes";
import { axisPercent } from "./scoring";

export const axisRows: Array<{ key: ScoreKey; label: string; positive: string; negative: string }> = [
  { key: "rhythm", label: "节奏", positive: "提前铺垫", negative: "卡点启动" },
  { key: "energy", label: "能量", positive: "稳定续航", negative: "波动爆发" },
  { key: "social", label: "状态来源", positive: "自己消化", negative: "靠外界带动" },
  { key: "posture", label: "生活姿态", positive: "收着活", negative: "放着活" },
];

export function getAxisDisplay(scores: Scores, key: ScoreKey) {
  const axis = axisRows.find((item) => item.key === key)!;
  const percents = axisPercent(scores[key], key);

  return {
    ...axis,
    positivePercent: percents.positive,
    negativePercent: percents.negative,
    fillPercent: percents.positive,
  };
}
