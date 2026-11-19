/**
 * The main repository's safety rules for learner-facing text (its tests/lesson-rules.ts and
 * docs/authoring-guide.md §9): no example may describe, and so implicitly encourage, actions that
 * could hurt people or damage property. The patterns are English, so they check the English text
 * of every course (the explanations of Spanish taught in English, the English taught in Spanish).
 */
/**
 * Phrases that describe, and so may implicitly encourage, actions that could hurt people or
 * damage property. Falling-object examples use natural events (an apple from a tree), safe
 * sport, or a supervised laboratory demonstration instead. See docs/authoring-guide.md §9.
 */
export const SAFETY_PATTERNS: { re: RegExp; why: string }[] = [
  {
    re: /\b(?:drop|dropp|throw|threw|thrown|toss|fling|flung|hurl|push|roll|lob|launch|fir(?:e|es|ed|ing))\w*\b[^.!?\n]{0,80}?\b(?:from|off|over)\s+(?:the\s+|a\s+|an\s+|your\s+|their\s+)?(?:[\w-]+\s+){0,2}?(?:bridge|balcony|window|roof|rooftop|cliff|tower|overpass|ledge|parapet|stairwell)s?\b/gi,
    why: "dropping or throwing something from a height where it could hurt someone",
  },
  {
    re: /\b(?:stone|rock|brick|object|ball|coin|egg)s?\b[^.!?\n]{0,40}?\b(?:dropped|thrown|tossed|falls?|falling|fell)\b[^.!?\n]{0,40}?\b(?:from|off)\s+(?:the\s+|a\s+|an\s+)?(?:[\w-]+\s+){0,2}?(?:bridge|balcony|window|roof|rooftop|cliff|tower|overpass|ledge|parapet|building)s?\b/gi,
    why: "an object falling from a height where it could hurt someone",
  },
  { re: /\b(?:look|looking|stare|staring|gaze|gazing|peek|peeking)\s+(?:directly\s+|straight\s+)?(?:at|into)\s+the\s+sun\b/gi, why: "looking at the Sun" },
  { re: /\b(?:play|playing|walk|walking|stand|standing|count|counting)\b[^.!?\n]{0,30}?\b(?:on|along|across)\s+(?:the\s+|a\s+)?(?:railway|railroad|train)\s+tracks?\b/gi, why: "being on railway tracks" },
  {
    re: /\b(?:touch|touching|grab|grabbing|poke|poking|probe|probing|open|opening|lick|licking)\b[^.!?\n]{0,40}?\b(?:mains|wall sockets?|power outlets?|live wires?|power lines?|plugs? sockets?)\b/gi,
    why: "touching or opening mains electricity",
  },
];

/** Safety problems in a piece of learner-facing text (empty = fine). Warnings against a danger are allowed. */
export function safetyProblems(text: string): string[] {
  const out: string[] = [];
  for (const { re, why } of SAFETY_PATTERNS)
    for (const m of text.matchAll(re)) {
      const before = text.slice(Math.max(0, (m.index ?? 0) - 30), m.index);
      if (/\b(?:never|not|n't|no one|nobody|avoid)\b[^.!?]*$/i.test(before)) continue;
      out.push(`unsafe example (${why}): "${m[0].slice(0, 100)}"`);
    }
  return out;
}
