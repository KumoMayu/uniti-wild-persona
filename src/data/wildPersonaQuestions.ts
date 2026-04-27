import type { Scores } from "./wildPersonaTypes";

export type OptionEffect = Partial<Scores>;

export type WildOption = {
  id: "A" | "B" | "C" | "D";
  text: string;
  effect: OptionEffect;
};

export type WildQuestion = {
  id: string;
  text: string;
  options: WildOption[];
};

const rhythm = [
  { rhythm: 2 },
  { rhythm: 1 },
  { rhythm: -1 },
  { rhythm: -2 },
];

const energy = [
  { energy: 2 },
  { energy: 1 },
  { energy: -1 },
  { energy: -2 },
];

const social = [
  { social: 2 },
  { social: 1 },
  { social: -1 },
  { social: -2 },
];

const posture = [
  { posture: 2 },
  { posture: 1 },
  { posture: -1 },
  { posture: -2 },
];

export const wildPersonaQuestions: WildQuestion[] = [
  {
    id: "Q1",
    text: "老师说这份作业两周后交，你第一反应通常是：",
    options: [
      { id: "A", text: "今天先动一点，后面压力会小很多", effect: rhythm[0] },
      { id: "B", text: "至少先把要求和资料捋清楚", effect: rhythm[1] },
      { id: "C", text: "先放着，临近了再集中处理", effect: rhythm[2] },
      { id: "D", text: "不到最后几天，很难真正启动", effect: rhythm[3] },
    ],
  },
  {
    id: "Q2",
    text: "要准备一次课堂展示时，你一般怎么起步：",
    options: [
      { id: "A", text: "提前搭好框架，再慢慢填内容", effect: rhythm[0] },
      { id: "B", text: "先把最关键的几页定下来", effect: rhythm[1] },
      { id: "C", text: "等脑子里有画面了再动手", effect: rhythm[2] },
      { id: "D", text: "快到时间了再一口气做出来", effect: rhythm[3] },
    ],
  },
  {
    id: "Q3",
    text: "新学期刚开始，放到你身上更常见的是：",
    options: [
      { id: "A", text: "早点把大节奏排出来", effect: rhythm[0] },
      { id: "B", text: "不排太满，但先有个基本盘", effect: rhythm[1] },
      { id: "C", text: "先观察一阵，没必要太早定死", effect: rhythm[2] },
      { id: "D", text: "边走边看，卡点也能活", effect: rhythm[3] },
    ],
  },
  {
    id: "Q4",
    text: "和别人约一件比较正式的事时，你多半会：",
    options: [
      { id: "A", text: "尽早定下时间，心里踏实", effect: rhythm[0] },
      { id: "B", text: "先敲一个大概范围", effect: rhythm[1] },
      { id: "C", text: "等更近一点再约，不急着锁死", effect: rhythm[2] },
      { id: "D", text: "临近再说，省点脑子", effect: rhythm[3] },
    ],
  },
  {
    id: "Q5",
    text: "知道下个月会很忙时，你一般会：",
    options: [
      { id: "A", text: "现在就分摊一点压力", effect: rhythm[0] },
      { id: "B", text: "先处理最容易卡住的部分", effect: rhythm[1] },
      { id: "C", text: "心里记着，但不会太早动", effect: rhythm[2] },
      { id: "D", text: "忙到眼前再开始应对", effect: rhythm[3] },
    ],
  },
  {
    id: "Q6",
    text: "必须完成但不想做的事，你大概会先这样：",
    options: [
      { id: "A", text: "先做一个最小版本，给后面接上", effect: rhythm[0] },
      { id: "B", text: "先铺点基础，避免之后更难收拾", effect: rhythm[1] },
      { id: "C", text: "先拖着，等状态自己上来", effect: rhythm[2] },
      { id: "D", text: "靠 ddl 把自己叫醒", effect: rhythm[3] },
    ],
  },
  {
    id: "Q7",
    text: "最近事情堆得比较多时，更符合你的状态是：",
    options: [
      { id: "A", text: "按住节奏，一件件往前推", effect: energy[0] },
      { id: "B", text: "分段处理，别一次耗干", effect: energy[1] },
      { id: "C", text: "前面普通，后面突然冲起来", effect: energy[2] },
      { id: "D", text: "平时低电量，最后一波爆发", effect: energy[3] },
    ],
  },
  {
    id: "Q8",
    text: "今天必须高效，但状态一般，你会先怎么救场：",
    options: [
      { id: "A", text: "从最稳妥的部分做起", effect: energy[0] },
      { id: "B", text: "降低难度，先保住持续输出", effect: energy[1] },
      { id: "C", text: "先晃一会儿，等感觉上来", effect: energy[2] },
      { id: "D", text: "等压力够大再直接冲", effect: energy[3] },
    ],
  },
  {
    id: "Q9",
    text: "别人描述你的能量状态，可能会说：",
    options: [
      { id: "A", text: "挺稳定，很少大起大落", effect: energy[0] },
      { id: "B", text: "不一定快，但续航不错", effect: energy[1] },
      { id: "C", text: "来劲的时候特别能打", effect: energy[2] },
      { id: "D", text: "起伏很明显，像心电图", effect: energy[3] },
    ],
  },
  {
    id: "Q10",
    text: "碰到很长的任务，对你来说更顺手的是：",
    options: [
      { id: "A", text: "保持匀速推进", effect: energy[0] },
      { id: "B", text: "中间留出缓冲，别绷太紧", effect: energy[1] },
      { id: "C", text: "分几个阶段集中爆发", effect: energy[2] },
      { id: "D", text: "前面先拖着，后面狠冲一轮", effect: energy[3] },
    ],
  },
  {
    id: "Q11",
    text: "你把状态找回来时，更常见的路径是：",
    options: [
      { id: "A", text: "慢慢恢复秩序", effect: energy[0] },
      { id: "B", text: "减轻一点负担，重新续航", effect: energy[1] },
      { id: "C", text: "换个刺激点，让自己重新来劲", effect: energy[2] },
      { id: "D", text: "先彻底歇着，回头突然上线", effect: energy[3] },
    ],
  },
  {
    id: "Q12",
    text: "周末有一整天空出来，你多半会：",
    options: [
      { id: "A", text: "稳稳做点事，也留些空白", effect: energy[0] },
      { id: "B", text: "安排一点，但不把自己排满", effect: energy[1] },
      { id: "C", text: "前半天松着，后半天突然很能干", effect: energy[2] },
      { id: "D", text: "看当天心情，可能两种极端", effect: energy[3] },
    ],
  },
  {
    id: "Q13",
    text: "遇到烦心事时，你第一反应更可能是：",
    options: [
      { id: "A", text: "先自己消化，不急着说出来", effect: social[0] },
      { id: "B", text: "自己想一轮，再决定要不要聊", effect: social[1] },
      { id: "C", text: "找人说说，心里会松很多", effect: social[2] },
      { id: "D", text: "得有人拉我一下，不然很难出来", effect: social[3] },
    ],
  },
  {
    id: "Q14",
    text: "做决定这件事，你更容易靠什么定下来：",
    options: [
      { id: "A", text: "自己想明白最重要", effect: social[0] },
      { id: "B", text: "意见可以听，但最后不被它左右", effect: social[1] },
      { id: "C", text: "和人聊过后更容易下判断", effect: social[2] },
      { id: "D", text: "身边人的状态会明显改变我", effect: social[3] },
    ],
  },
  {
    id: "Q15",
    text: "进到一个新环境，你通常先进入哪种模式：",
    options: [
      { id: "A", text: "自己观察，慢慢适应", effect: social[0] },
      { id: "B", text: "先找到适合自己的节奏", effect: social[1] },
      { id: "C", text: "会先感受大家现在是什么状态", effect: social[2] },
      { id: "D", text: "环境一变，我也会跟着切换表现", effect: social[3] },
    ],
  },
  {
    id: "Q16",
    text: "朋友约你做一件事，你一般怎么判断：",
    options: [
      { id: "A", text: "先问自己到底想不想", effect: social[0] },
      { id: "B", text: "别人能影响我，但不能替我决定", effect: social[1] },
      { id: "C", text: "大家都去，我会更容易跟上", effect: social[2] },
      { id: "D", text: "有人带着走和没人带，差别很大", effect: social[3] },
    ],
  },
  {
    id: "Q17",
    text: "情绪低下来的时候，你更容易这样处理：",
    options: [
      { id: "A", text: "先自己整理一下", effect: social[0] },
      { id: "B", text: "主要自己消化，需要时再找人", effect: social[1] },
      { id: "C", text: "和人待一会儿会好很多", effect: social[2] },
      { id: "D", text: "外界不推我，我可能会陷很久", effect: social[3] },
    ],
  },
  {
    id: "Q18",
    text: "一件事纠结很久时，你最后通常靠什么推进：",
    options: [
      { id: "A", text: "自己一点点想通", effect: social[0] },
      { id: "B", text: "参考别人，但最后自己消化", effect: social[1] },
      { id: "C", text: "聊过之后才更容易明确", effect: social[2] },
      { id: "D", text: "当时身边的人和氛围，会直接改方向", effect: social[3] },
    ],
  },
  {
    id: "Q19",
    text: "说到平时怎么过日子，更贴近你的是：",
    options: [
      { id: "A", text: "希望生活有点稳定感", effect: posture[0] },
      { id: "B", text: "可以有弹性，但别乱到失控", effect: posture[1] },
      { id: "C", text: "规不规整其次，先要有自己的感觉", effect: posture[2] },
      { id: "D", text: "好玩、舒服、顺手更重要", effect: posture[3] },
    ],
  },
  {
    id: "Q20",
    text: "看到一个不刚需但很喜欢的东西，你一般会：",
    options: [
      { id: "A", text: "先想清楚值不值", effect: posture[0] },
      { id: "B", text: "可以买，但不想太随手", effect: posture[1] },
      { id: "C", text: "它让我开心，这点就很重要", effect: posture[2] },
      { id: "D", text: "当下想要的时候购买力很强", effect: posture[3] },
    ],
  },
  {
    id: "Q21",
    text: "周末没有硬性安排时，你更可能把时间用来：",
    options: [
      { id: "A", text: "整理一下生活，顺便休息", effect: posture[0] },
      { id: "B", text: "轻松过，但保留一点秩序", effect: posture[1] },
      { id: "C", text: "找点让自己觉得有意思的事", effect: posture[2] },
      { id: "D", text: "哪边舒服、哪边有趣就去哪边", effect: posture[3] },
    ],
  },
  {
    id: "Q22",
    text: "对于生活要不要很整齐，你的真实态度更像：",
    options: [
      { id: "A", text: "会在意，乱了心里不舒服", effect: posture[0] },
      { id: "B", text: "不用完美，但基本底线要在", effect: posture[1] },
      { id: "C", text: "整齐不是重点，过得自在更重要", effect: posture[2] },
      { id: "D", text: "开心就行，乱一点也能接受", effect: posture[3] },
    ],
  },
  {
    id: "Q23",
    text: "别人对你的生活状态评价，更可能是：",
    options: [
      { id: "A", text: "比较稳，也比较收得住", effect: posture[0] },
      { id: "B", text: "不算极端，做事有分寸", effect: posture[1] },
      { id: "C", text: "有自己的趣味和松弛感", effect: posture[2] },
      { id: "D", text: "明显更跟着状态和体验走", effect: posture[3] },
    ],
  },
  {
    id: "Q24",
    text: "给自己的大学生活选一个底色，更像是：",
    options: [
      { id: "A", text: "稳住、推进，别太失控", effect: posture[0] },
      { id: "B", text: "有弹性，但整体还在轨道上", effect: posture[1] },
      { id: "C", text: "想过得有一点自己的味道", effect: posture[2] },
      { id: "D", text: "比起标准答案，先活舒服更重要", effect: posture[3] },
    ],
  },
];
