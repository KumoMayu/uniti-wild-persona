export type ScoreKey = "rhythm" | "energy" | "social" | "posture";

export type Scores = Record<ScoreKey, number>;

export type PersonaCode =
  | "AAAA"
  | "AAAB"
  | "AABA"
  | "AABB"
  | "ABAA"
  | "ABAB"
  | "ABBA"
  | "ABBB"
  | "BAAA"
  | "BAAB"
  | "BABA"
  | "BABB"
  | "BBAA"
  | "BBAB"
  | "BBBA"
  | "BBBB";

export type PersonaType = {
  code: PersonaCode;
  name: string;
  englishName: string;
  line: string;
  highlights: string[];
  risks: string[];
  advice: string[];
  description: string;
};

export const personaTypes: Record<PersonaCode, PersonaType> = {
  AAAA: {
    code: "AAAA",
    name: "温吞热水瓶",
    englishName: "Warm Thermos",
    line: "稳、慢、清醒，像一杯一直温着的水。",
    highlights: ["节奏稳定", "不爱瞎折腾", "后劲很足"],
    risks: ["容易太保守", "有时不够痛快"],
    advice: ["少想“完美启动”，先动就行", "该抢的时候别总让"],
    description:
      "你属于那种表面没什么动静，但一直在往前走的人。别人以为你很佛，实际上你只是懒得高调。你最大的优点是稳，最大的风险是太稳。",
  },
  AAAB: {
    code: "AAAB",
    name: "半熟电鳗",
    englishName: "Half-Cooked Eel",
    line: "平时温吞，偶尔带电，状态来了会突然很亮。",
    highlights: ["有个人节奏", "灵感来得快", "不容易被完全带跑"],
    risks: ["节奏忽明忽暗", "容易凭感觉活"],
    advice: ["给自己留一点固定锚点", "别全靠灵感救场"],
    description:
      "你不是完全乱，也不是完全稳。你更像带点电流感的人，平时慢一点，来劲的时候很有存在感。适合保留自由度，但别放太飞。",
  },
  AABA: {
    code: "AABA",
    name: "人间校准器",
    englishName: "Human Calibrator",
    line: "不抢戏，但总能把人和事调到一个舒服的位置。",
    highlights: ["分寸感强", "比较会看场合", "很少特别失控"],
    risks: ["容易顾全太多", "自己的感受可能被压后"],
    advice: ["别什么都替大家兜", "先确认自己想不想"],
    description:
      "你有一种很强的“校准感”。你不一定最跳，但通常是最不容易让局面变尴尬的人。你适合做连接点，但别总当缓冲垫。",
  },
  AABB: {
    code: "AABB",
    name: "气氛永动机",
    englishName: "Mood Engine",
    line: "会带节奏，也会带气氛，属于一启动就能转起来的人。",
    highlights: ["存在感强", "容易把场子带热", "很会边玩边推进"],
    risks: ["容易分心", "有时会把自己转太快"],
    advice: ["重要节点给自己留缓冲", "少一点即兴，多一点收尾"],
    description:
      "你不是那种安静活着的人。你更像能把周围也一起带动起来的类型，体验感很强，动能也很强。问题不在开始，而在别转过头。",
  },
  ABAA: {
    code: "ABAA",
    name: "隐形推进器",
    englishName: "Silent Propeller",
    line: "不吵不闹，但一旦切到任务模式就挺能推。",
    highlights: ["关键时刻很能干", "不太依赖外界", "有隐秘爆发力"],
    risks: ["平时容易憋着", "不到节点不想动"],
    advice: ["把爆发拆一点到平时", "别每次都等压力点火"],
    description:
      "你平时可能像没上线，但需要推进的时候又很能顶。你是典型“安静但能办事”的人，只是别总把启动交给最后关头。",
  },
  ABAB: {
    code: "ABAB",
    name: "反复横跳兽",
    englishName: "Ping-Pong Beast",
    line: "状态波动大，但灵感和冲劲也是真的多。",
    highlights: ["有创造性", "爆发力强", "很难完全无聊"],
    risks: ["节奏不稳定", "容易前后反复"],
    advice: ["给冲动留出口，但要有底线", "先保住最基本的秩序"],
    description:
      "你的人格里有一种很明显的跳跃感。你不是靠一条线往前走的人，而是靠忽然来电和状态跃迁。上限不低，波动也不小。",
  },
  ABBA: {
    code: "ABBA",
    name: "临场变形怪",
    englishName: "Stage Shifter",
    line: "会看情况切状态，越到变化多的时候越能活。",
    highlights: ["适应力强", "对场面变化敏感", "不容易被单一路线卡死"],
    risks: ["容易太依赖环境", "有时不够坚持自我"],
    advice: ["给自己一条固定主线", "别什么场都跟着变"],
    description:
      "你很擅长“看情况活”。局势一变，你的状态也会跟着切换。这种能力很实用，但也别让自己只剩应变，没有主心骨。",
  },
  ABBB: {
    code: "ABBB",
    name: "抽象回旋镖",
    englishName: "Abstract Boomerang",
    line: "飞出去的时候很抽象，最后居然还能绕回来落地。",
    highlights: ["戏剧性强", "有临场手感", "体验感很足"],
    risks: ["容易把日子过成实验", "稳定性一般"],
    advice: ["给自己留兜底方案", "别每次都玩极限"],
    description:
      "你有一种很难预测但又莫名其妙能圆回来的气质。别人看你常常觉得“这都能行”，而你自己也未必解释得清。好玩是真的，心惊也是真的。",
  },
  BAAA: {
    code: "BAAA",
    name: "慢热蘑菇人",
    englishName: "Slow Mushroom",
    line: "启动慢，但适应之后会默默长出来。",
    highlights: ["耐受度不错", "不容易一下子崩", "节奏一旦建立很稳"],
    risks: ["开机慢", "容易错过最佳起步点"],
    advice: ["把启动门槛降得更低", "别等“完全准备好”"],
    description:
      "你不是快型选手。你更像需要一点时间慢慢长出来的人。别把“慢”理解成“不行”，但也别总等到不得不长的时候才开始长。",
  },
  BAAB: {
    code: "BAAB",
    name: "游离信号塔",
    englishName: "Floating Signal",
    line: "不一定总在线，但总有自己的频道。",
    highlights: ["有个人风格", "不容易被彻底同化", "经常有自己的奇怪灵感"],
    risks: ["容易飘", "有时不够落地"],
    advice: ["留住你的频道感，但加一点执行", "想到的事尽量落下一点"],
    description:
      "你像一座时好时坏但很有自己频道的信号塔。别人不一定总能懂你，但你通常知道自己在接什么波。问题是，接到之后也要记得发射出来。",
  },
  BABA: {
    code: "BABA",
    name: "柔性生存体",
    englishName: "Soft Survivor",
    line: "不硬扛，不死磕，但总能以自己的方式活过去。",
    highlights: ["适应力强", "不容易彻底断电", "很会保命"],
    risks: ["容易太顺着环境", "不知不觉把自己放后面"],
    advice: ["关键节点主动一点", "先问自己想不想"],
    description:
      "你不是特别硬的那种人，但你很会活。你知道什么时候该退一点，什么时候该顺一点。好处是能活很久，坏处是有时活得太柔了。",
  },
  BABB: {
    code: "BABB",
    name: "快乐串台王",
    englishName: "Channel Hopper",
    line: "频道很多，兴趣很多，人生体验感也很多。",
    highlights: ["新鲜感强", "容易找到乐子", "社交和体验都不差"],
    risks: ["注意力容易散", "长线推进偏弱"],
    advice: ["同时别开太多窗口", "给自己设一个最低完成线"],
    description:
      "你很难长期只待在一个频道里。你需要切换、需要新鲜感、需要一点好玩的东西来维持活力。问题不是你不行，是你太容易被下一个有趣的东西吸走。",
  },
  BBAA: {
    code: "BBAA",
    name: "截止唤醒器",
    englishName: "Deadline Awakener",
    line: "平时像休眠，逼近节点时人格突然上线。",
    highlights: ["压力下执行力会冒出来", "真到关键时刻能扛", "意外地能收尾"],
    risks: ["太依赖最后唤醒", "精神成本高"],
    advice: ["提前做一点低成本铺垫", "别把所有希望都押给最后一晚"],
    description:
      "你最经典的状态就是“平时像没醒，最后突然醒很大”。你不是没有能力，而是总想把系统唤醒留到最后。偶尔好用，长期伤身。",
  },
  BBAB: {
    code: "BBAB",
    name: "过载小马达",
    englishName: "Overclock Pony",
    line: "一旦转起来就很猛，但也很容易转过头。",
    highlights: ["爆发力强", "很有行动感", "情绪能转化成动能"],
    risks: ["波动很大", "容易过载"],
    advice: ["把高功率模式用在关键处", "留恢复时间，别硬烧"],
    description:
      "你不是那种慢慢来的机器。你更像一台会突然超频的小马达，冲起来很带感，但也很容易发烫。你的问题不是没动力，是动力管理。",
  },
  BBBA: {
    code: "BBBA",
    name: "群体感应器",
    englishName: "Crowd Sensor",
    line: "对外界特别敏感，容易被氛围和关系带着启动。",
    highlights: ["很懂气氛", "能快速接住外部节奏", "在群体中有适配力"],
    risks: ["太受环境影响", "一旦周围都摆就容易一起摆"],
    advice: ["给自己一点独立锚点", "别把状态完全交给别人"],
    description:
      "你很像一个对外部环境特别灵的感应器。周围热，你容易热；周围摆，你也容易摆。你的人格不是没主见，而是太容易共振。",
  },
  BBBB: {
    code: "BBBB",
    name: "卡点艺术家",
    englishName: "Deadline Artist",
    line: "总在危险边缘起笔，居然还常常能画完。",
    highlights: ["戏剧张力拉满", "最后关头很能打", "经常把极限活成风格"],
    risks: ["风险偏高", "稳定性偏低"],
    advice: ["少用命换结果", "先保底，再耍帅"],
    description:
      "你是那种特别容易把生活过成“最后居然还行”的人。你的风险管理方式主要靠心脏，执行方式主要靠最后觉醒。确实有点帅，但不建议一直这么帅。",
  },
};
