import type { PersonaCode, PersonaType } from "./wildPersonaTypes";

export type PersonaIcon = {
  code: PersonaCode;
  name: string;
  src: string;
};

export const personaIcons: Record<PersonaCode, PersonaIcon> = {
  AAAA: { code: "AAAA", name: "温吞热水瓶", src: "/persona-icons/wtrsp.png" },
  AAAB: { code: "AAAB", name: "半熟电鳗", src: "/persona-icons/bsdm.png" },
  AABA: { code: "AABA", name: "人间校准器", src: "/persona-icons/rjjzq.png" },
  AABB: { code: "AABB", name: "气氛永动机", src: "/persona-icons/qfydj.png" },
  ABAA: { code: "ABAA", name: "隐形推进器", src: "/persona-icons/yxtjq.png" },
  ABAB: { code: "ABAB", name: "反复横跳兽", src: "/persona-icons/ffhts.png" },
  ABBA: { code: "ABBA", name: "临场变形怪", src: "/persona-icons/cbxg.png" },
  ABBB: { code: "ABBB", name: "抽象回旋镖", src: "/persona-icons/cxhbg.png" },
  BAAA: { code: "BAAA", name: "慢热蘑菇人", src: "/persona-icons/mrmgr.png" },
  BAAB: { code: "BAAB", name: "游离信号塔", src: "/persona-icons/ylxht.png" },
  BABA: { code: "BABA", name: "柔性生存体", src: "/persona-icons/rxsct.png" },
  BABB: { code: "BABB", name: "快乐串台王", src: "/persona-icons/klctw.png" },
  BBAA: { code: "BBAA", name: "截止唤醒器", src: "/persona-icons/jzhxq.png" },
  BBAB: { code: "BBAB", name: "过载小马达", src: "/persona-icons/gzxmd.png" },
  BBBA: { code: "BBBA", name: "群体感应器", src: "/persona-icons/qtgyq.png" },
  BBBB: { code: "BBBB", name: "卡点艺术家", src: "/persona-icons/kdysj.png" },
};

export function getPersonaIcon(persona: PersonaType | PersonaCode) {
  const code = typeof persona === "string" ? persona : persona.code;
  return personaIcons[code];
}
