export type Role = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
  suggestions?: string[] | undefined;
};

export type JournalEntry = {
  id: string;
  text: string;
  savedAt: number;
};

export type TasteProfile = {
  gravitates: string[];
  avoids: string[];
  budgetLow: number;
  budgetHigh: number;
  budgetNote: string;
  signals: number;
};

export const STORAGE = {
  messages: "chiti.messages.v1",
  journal: "chiti.journal.v1",
  taste: "chiti.taste.v1",
} as const;

export const defaultTaste: TasteProfile = {
  gravitates: [
    "tailored outerwear",
    "bone / ecru",
    "straight leg denim",
    "square-toe boots",
    "matte silver",
    "column silhouettes",
  ],
  avoids: ["logo prints", "skinny jeans", "fast-fashion sequins", "rose gold", "bootcut"],
  budgetLow: 80,
  budgetHigh: 260,
  budgetNote: "spends on outerwear and shoes, refuses to overpay for basics",
  signals: 14,
};

export const openers: string[] = [
  "what do I wear tonight?",
  "rate this outfit idea",
  "my closet feels stale",
  "one thing I should buy this month",
];

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const makeMessage = (
  role: Role,
  text: string,
  suggestions?: string[]
): ChatMessage => ({ id: uid(), role, text, createdAt: Date.now(), suggestions });

type Rule = {
  match: RegExp;
  reply: string;
  suggestions: string[];
};

const rules: Rule[] = [
  {
    match: /(dinner|date|tonight|drinks|party|going out)/i,
    reply:
      "Black column dress, no jewellery above the collarbone, square-toe boot. The restraint is the point. Don't add a belt — you always want to add a belt.",
    suggestions: ["what coat over it?", "swap the boots?", "too severe for a first date?"],
  },
  {
    match: /(work|office|interview|meeting|presentation)/i,
    reply:
      "Grey wool trouser, ecru knit, one structured layer. Nothing shiny. You want to look like the person who decides, not the person who prepared.",
    suggestions: ["what shoes?", "can I do denim instead?", "make it less serious"],
  },
  {
    match: /(closet|wardrobe|nothing to wear|stale|bored)/i,
    reply:
      "Your closet isn't the problem, your middle layer is. You have tops and you have coats and nothing in between. One good grey cardigan fixes 40% of your mornings.",
    suggestions: ["what should I cut?", "show me the gap list", "budget for the fix?"],
  },
  {
    match: /(buy|shopping|shop|purchase|worth it|invest)/i,
    reply:
      "One thing, not five. A wool overcoat in bone. Everything you already own gets better under it, and it survives ten winters. Skip the trend shoe.",
    suggestions: ["what's my ceiling on that?", "secondhand instead?", "convince me"],
  },
  {
    match: /(pink|floral|frill|ruffle|glitter|sequin|neon)/i,
    reply:
      "No. That's costume, not clothing. If you want the mood, get it from texture — not from decoration.",
    suggestions: ["ok what instead?", "even for a wedding?", "you're being harsh"],
  },
  {
    match: /(jeans|denim)/i,
    reply:
      "Straight leg, rigid, ankle break. Tuck the knit, keep the shoe heavy. Skinny is a decade behind you and we both know it.",
    suggestions: ["dark or light wash?", "what top with it?", "can I do a wide leg?"],
  },
  {
    match: /(coat|jacket|outerwear|cold|winter)/i,
    reply:
      "Long, unstructured, one shade off black. Outerwear is the only thing anyone actually sees in winter, so it carries the whole outfit. Buy it once.",
    suggestions: ["price range?", "belted or open?", "what about a leather one?"],
  },
  {
    match: /(budget|cheap|expensive|price|cost|afford)/i,
    reply:
      "Your lane is 80–260. Spend at the top of it on coats and shoes, at the bottom on anything that touches skin. Middle-priced trend pieces are how people waste money.",
    suggestions: ["is 300 ever ok?", "where do I cut?", "best value category?"],
  },
  {
    match: /(rate|thoughts|opinion|what do you think|does this work)/i,
    reply:
      "Two thirds there. The silhouette is right, the accessories are doing too much. Remove one thing — probably the one you're most attached to.",
    suggestions: ["which one?", "swap the shoes?", "keep the bag though"],
  },
];

const fallbacks: Rule[] = [
  {
    match: /.*/,
    reply:
      "Simplify it. One strong silhouette, one texture, nothing decorative. You dress best when you're slightly underdressed and completely certain.",
    suggestions: ["give me a full outfit", "what's missing in my closet?", "be more specific"],
  },
  {
    match: /.*/,
    reply:
      "Keep the palette to two tones and let the cut do the work. Colour is the easiest way to look like you tried too hard.",
    suggestions: ["which two tones?", "build it around the coat", "what about black on black?"],
  },
];

export function stylistReply(input: string, turn: number): { text: string; suggestions: string[] } {
  const rule = rules.find((r) => r.match.test(input)) ?? fallbacks[turn % fallbacks.length]!;
  return { text: rule.reply, suggestions: rule.suggestions };
}

const likeTags: Array<[RegExp, string]> = [
  [/(black on black|all black)/i, "all-black tonal"],
  [/(linen)/i, "linen"],
  [/(leather)/i, "leather"],
  [/(wool|cashmere|knit)/i, "heavy knits"],
  [/(oversize|oversized|baggy|wide leg)/i, "oversized cuts"],
  [/(minimal|clean|simple)/i, "minimalism"],
  [/(vintage|secondhand|thrift)/i, "secondhand"],
  [/(boots?)/i, "boots"],
  [/(trench|overcoat|coat)/i, "long outerwear"],
];

const avoidTags: Array<[RegExp, string]> = [
  [/(hate|can't stand|never wear|ugly)\s+([a-z\s]{3,18})/i, ""],
  [/(sequin|glitter)/i, "sequins"],
  [/(neon)/i, "neon"],
  [/(skinny)/i, "skinny fits"],
  [/(logo)/i, "logo prints"],
  [/(heels?)/i, "high heels"],
];

export function learnFromMessage(profile: TasteProfile, input: string): TasteProfile {
  const next: TasteProfile = {
    ...profile,
    gravitates: [...profile.gravitates],
    avoids: [...profile.avoids],
    signals: profile.signals + 1,
  };
  const negative = /(hate|don't like|dont like|never|avoid|no more)/i.test(input);

  for (const [re, tag] of likeTags) {
    if (tag && re.test(input)) {
      const bucket = negative ? next.avoids : next.gravitates;
      if (!bucket.includes(tag)) bucket.push(tag);
    }
  }
  for (const [re, tag] of avoidTags) {
    if (tag && re.test(input) && !next.avoids.includes(tag)) next.avoids.push(tag);
  }

  next.gravitates = next.gravitates.filter((t) => !next.avoids.includes(t)).slice(-14);
  next.avoids = next.avoids.slice(-12);
  return next;
}

export function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveState(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function formatStamp(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} — ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
