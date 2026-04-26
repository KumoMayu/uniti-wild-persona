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

export const wildPersonaQuestions: WildQuestion[] = [
  {
    id: "Q1",
    text: "如果一件事还早，但你知道以后肯定得做，你通常会：",
    options: [
      { id: "A", text: "先弄一点，给未来留条活路", effect: { rhythm: 2, energy: 1 } },
      { id: "B", text: "先不动，等真正有感觉了再说", effect: { rhythm: -2, energy: -1 } },
      { id: "C", text: "看周围人有没有开始，再决定", effect: { social: -2, rhythm: -1 } },
      { id: "D", text: "先想想有没有更舒服的处理方式", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q2",
    text: "当你突然空出半天时间时，你更可能：",
    options: [
      { id: "A", text: "把一直拖着的事顺手处理掉", effect: { rhythm: 2, energy: 1 } },
      { id: "B", text: "放空一下，等状态自然长出来", effect: { energy: -2, posture: -1 } },
      { id: "C", text: "约人、聊天或者看看外面有没有局", effect: { social: -2, posture: -1 } },
      { id: "D", text: "凭当下兴趣走，想到啥做啥", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q3",
    text: "朋友临时叫你出门吃点好的，你第一反应更接近：",
    options: [
      { id: "A", text: "先看看自己原本安排会不会被打乱", effect: { rhythm: 1, posture: 2 } },
      { id: "B", text: "去不去都行，取决于我今天的电量", effect: { energy: 1, social: 1 } },
      { id: "C", text: "如果大家都去，我大概率也会去", effect: { social: -2, posture: -1 } },
      { id: "D", text: "好吃就去，别问那么多", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q4",
    text: "你买一件不算刚需但确实喜欢的东西时，更像：",
    options: [
      { id: "A", text: "会犹豫一阵，想清楚值不值", effect: { rhythm: 1, posture: 2 } },
      { id: "B", text: "拖着不买，直到某天突然下单", effect: { rhythm: -2, energy: -1 } },
      { id: "C", text: "容易被别人种草或带着一起买", effect: { social: -2, posture: -1 } },
      { id: "D", text: "这一刻喜欢就很有购买力", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q5",
    text: "当你对未来一段时间有点迷茫时，你通常会：",
    options: [
      { id: "A", text: "想先理清楚自己能控制的部分", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "先不想太多，等逼近了再面对", effect: { rhythm: -2, posture: -1 } },
      { id: "C", text: "听听别人怎么过、怎么选", effect: { social: -2, posture: 1 } },
      { id: "D", text: "转移一下注意力，让自己先活过今天", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q6",
    text: "在一群人里，你通常更像：",
    options: [
      { id: "A", text: "不一定最显眼，但比较稳定", effect: { posture: 2, energy: 1 } },
      { id: "B", text: "平时没太多动静，关键时刻会冒出来", effect: { energy: -2, posture: 1 } },
      { id: "C", text: "会根据别人状态决定自己怎么放", effect: { social: -2, posture: -1 } },
      { id: "D", text: "比较容易让人注意到你在场", effect: { posture: -2, social: -1 } },
    ],
  },
  {
    id: "Q7",
    text: "如果一天的计划突然被打乱了，你一般会：",
    options: [
      { id: "A", text: "重新排一下，尽量拉回轨道", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "干脆先乱着，后面再补救", effect: { rhythm: -2, energy: -1 } },
      { id: "C", text: "看看别人都怎么应对", effect: { social: -2, rhythm: -1 } },
      { id: "D", text: "顺势切到另一个想做的状态", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q8",
    text: "你最常见的一种拖延理由是：",
    options: [
      { id: "A", text: "我想先把条件准备得更合适一点", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "我现在真的没进入那个模式", effect: { energy: -2, rhythm: -1 } },
      { id: "C", text: "没人一起或者外界没推动感", effect: { social: -2, energy: -1 } },
      { id: "D", text: "眼前还有更有意思的东西", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q9",
    text: "出去玩的时候，你通常更像：",
    options: [
      { id: "A", text: "会提前看路线、时间和大概安排", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "到时候再说，别把自己框太死", effect: { posture: -2, rhythm: -1 } },
      { id: "C", text: "更享受和谁一起，而不只是去哪里", effect: { social: -2, posture: -1 } },
      { id: "D", text: "过程有感觉比计划完整更重要", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q10",
    text: "如果一个阶段很累，你更可能用哪种方式恢复：",
    options: [
      { id: "A", text: "把事情拆小，慢慢恢复秩序", effect: { energy: 2, rhythm: 1 } },
      { id: "B", text: "先彻底摆一下，等状态回升", effect: { energy: -2, posture: -1 } },
      { id: "C", text: "找人待一会儿，顺着气氛回电", effect: { social: -2, energy: -1 } },
      { id: "D", text: "吃点好的、出去走走、换个环境", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q11",
    text: "你面对很可能会翻车的任务时，更像：",
    options: [
      { id: "A", text: "越危险越想早点处理", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "不到最后不会真正启动", effect: { rhythm: -2, energy: -1 } },
      { id: "C", text: "如果有人一起扛会轻松很多", effect: { social: -2, energy: -1 } },
      { id: "D", text: "会先想办法让自己别太难受", effect: { posture: -3 } },
    ],
  },
  {
    id: "Q12",
    text: "你平时对人生规划更接近哪种状态：",
    options: [
      { id: "A", text: "不一定很细，但心里得有个方向", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "说实话常常是走一步看一步", effect: { rhythm: -2, posture: -1 } },
      { id: "C", text: "会参考很多同龄人的路径", effect: { social: -2, rhythm: -1 } },
      { id: "D", text: "更在意自己想不想那样活", effect: { posture: -2, social: 1 } },
    ],
  },
  {
    id: "Q13",
    text: "在吃、玩、生活方式这些事上，你更偏：",
    options: [
      { id: "A", text: "喜欢有自己稳定偏好的东西", effect: { energy: 2, posture: 1 } },
      { id: "B", text: "经常过一阵子就换口味", effect: { energy: -2, posture: -1 } },
      { id: "C", text: "会被朋友推荐和周围风气影响", effect: { social: -2, posture: -1 } },
      { id: "D", text: "只要当下爽或者有意思就行", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q14",
    text: "如果一个朋友突然情绪不太对，你通常会：",
    options: [
      { id: "A", text: "稳稳接住，先陪着梳理一下", effect: { social: 2, posture: 1 } },
      { id: "B", text: "不一定会立刻处理，但会记着", effect: { social: 1, energy: 1 } },
      { id: "C", text: "很容易被对方情绪带进去", effect: { social: -2, energy: -1 } },
      { id: "D", text: "会先想办法把气氛救回来", effect: { posture: -2, social: -1 } },
    ],
  },
  {
    id: "Q15",
    text: "你更容易在哪种情况下发挥得不错：",
    options: [
      { id: "A", text: "时间充足，节奏能自己掌握", effect: { energy: 2, rhythm: 1 } },
      { id: "B", text: "有明确节点，压迫感已经上来", effect: { energy: -2, rhythm: -1 } },
      { id: "C", text: "身边有人一起推进的时候", effect: { social: -2, energy: -1 } },
      { id: "D", text: "事情本身让我有表达欲或兴趣", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q16",
    text: "如果别人对你的第一印象有误，你通常会：",
    options: [
      { id: "A", text: "无所谓，时间久了自然会看出来", effect: { posture: 2, social: 1 } },
      { id: "B", text: "平时懒得解释，关键时刻再说", effect: { posture: 1, energy: -1 } },
      { id: "C", text: "挺在意别人怎么看自己", effect: { social: -2, posture: -1 } },
      { id: "D", text: "会主动把自己的风格亮出来", effect: { posture: -2, social: -1 } },
    ],
  },
  {
    id: "Q17",
    text: "面对长期关系或长期目标，你更像：",
    options: [
      { id: "A", text: "慢慢来，但希望整体可控", effect: { rhythm: 1, posture: 2 } },
      { id: "B", text: "常常阶段性投入，阶段性游离", effect: { energy: -2, rhythm: -1 } },
      { id: "C", text: "比较依赖互动和反馈维持热度", effect: { social: -2, energy: -1 } },
      { id: "D", text: "先保证自己别活得太无聊", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q18",
    text: "如果你今天已经很烦了，又遇到一点小破事，你会：",
    options: [
      { id: "A", text: "想先把它处理掉，别越堆越烦", effect: { posture: 2, rhythm: 1 } },
      { id: "B", text: "先不碰，免得自己直接炸掉", effect: { energy: -2, posture: -1 } },
      { id: "C", text: "找人吐槽一下会舒服很多", effect: { social: -2, posture: -1 } },
      { id: "D", text: "先逃离现场，换个状态再说", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q19",
    text: "你在朋友眼里更可能是哪种人：",
    options: [
      { id: "A", text: "比较靠谱，有自己的节奏", effect: { posture: 2, rhythm: 1 } },
      { id: "B", text: "有点神出鬼没，但总能补上", effect: { energy: -2, posture: 1 } },
      { id: "C", text: "跟谁在一起就会切到哪种频道", effect: { social: -2, energy: -1 } },
      { id: "D", text: "自带一点个人风格和节目效果", effect: { posture: -2, social: -1 } },
    ],
  },
  {
    id: "Q20",
    text: "你做选择时，通常更容易被什么推动：",
    options: [
      { id: "A", text: "长远上更稳妥", effect: { rhythm: 2, posture: 1 } },
      { id: "B", text: "眼下终于有感觉了", effect: { energy: -2, rhythm: -1 } },
      { id: "C", text: "周围人的建议或陪伴", effect: { social: -2, posture: -1 } },
      { id: "D", text: "当下的冲动、趣味和体验感", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q21",
    text: "如果要开始一个新爱好，你通常会：",
    options: [
      { id: "A", text: "先了解一下自己能不能长期搞", effect: { rhythm: 2, energy: 1 } },
      { id: "B", text: "先上手再说，后面再决定要不要继续", effect: { energy: -2, posture: -1 } },
      { id: "C", text: "有人一起的话更容易坚持", effect: { social: -2, energy: -1 } },
      { id: "D", text: "主要看这东西现在够不够吸引我", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q22",
    text: "你对自己是不是活得有点乱这件事：",
    options: [
      { id: "A", text: "会介意，所以总想拉回一点秩序", effect: { posture: 2, rhythm: 1 } },
      { id: "B", text: "经常乱，但也不是第一次了", effect: { energy: -2, posture: -1 } },
      { id: "C", text: "乱不乱和身边环境关系很大", effect: { social: -2, posture: -1 } },
      { id: "D", text: "只要总体开心，也不一定非得很整齐", effect: { posture: -2, social: 1 } },
    ],
  },
  {
    id: "Q23",
    text: "如果最近状态很差，你最可能的真实问题是：",
    options: [
      { id: "A", text: "想太多、背太多，自己把自己绷住了", effect: { posture: 2, energy: 1 } },
      { id: "B", text: "一直没真正启动，越拖越沉", effect: { rhythm: -2, energy: -1 } },
      { id: "C", text: "太受别人和外界影响", effect: { social: -2, posture: -1 } },
      { id: "D", text: "太想活得舒服，结果现实不同意", effect: { posture: -2, energy: -1 } },
    ],
  },
  {
    id: "Q24",
    text: "如果让你给自己的大学这几年下一个底色，你更接近：",
    options: [
      { id: "A", text: "一边调整一边尽量稳住", effect: { posture: 2, rhythm: 1 } },
      { id: "B", text: "时常混乱，但总能在关键时刻活回来", effect: { energy: -2, rhythm: -1 } },
      { id: "C", text: "很大程度上是在人和环境里被塑造成现在这样", effect: { social: -2, posture: 1 } },
      { id: "D", text: "比起标准答案，我更想活出点自己的味道", effect: { posture: -2, social: 1 } },
    ],
  },
];
