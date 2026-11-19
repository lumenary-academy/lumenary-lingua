/**
 * Lumenary Lingua's interface strings (src/i18n/messages): every locale has every key, with the same
 * placeholders; the site adds strings without overriding the ones @lumenary/core shares; and every
 * key the site's code looks up exists.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { CORE_MESSAGES, LOCALES, makeT } from "@lumenary/core/i18n";
import { i18n } from "@/lib/site";
import { ROOT, json } from "./helpers";

type Tree = { [k: string]: string | Tree };
function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.set(key, v);
    else for (const [kk, vv] of flatten(v, key)) out.set(kk, vv);
  }
  return out;
}
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const en = flatten(json<Tree>("src/i18n/messages/en.json"));
const core = flatten(CORE_MESSAGES as Tree);

describe("Lingua's message catalogues", () => {
  it("English has only string leaves (no arrays)", () => {
    const walk = (t: unknown): void => {
      expect(Array.isArray(t)).toBe(false);
      if (t && typeof t === "object") Object.values(t).forEach(walk);
    };
    walk(json("src/i18n/messages/en.json"));
  });
  it("add strings without overriding the shared ones (a site's English would lose to the core's translations)", () => {
    expect([...en.keys()].filter((k) => core.has(k))).toEqual([]);
  });
  for (const locale of LOCALES.filter((l) => l !== "en")) {
    describe(locale, () => {
      const flat = flatten(json<Tree>(`src/i18n/messages/${locale}.json`));
      it("has exactly the keys English has", () => {
        expect([...flat.keys()].filter((k) => !en.has(k)), "orphan keys").toEqual([]);
        expect([...en.keys()].filter((k) => !flat.has(k)), "missing keys").toEqual([]);
      });
      it("keeps the same {placeholders}", () => {
        for (const [k, v] of flat) expect(placeholders(v), `${locale}: ${k}`).toEqual(placeholders(en.get(k)!));
      });
      it("translates every string", async () => {
        const t = makeT(await i18n.getMessages(locale));
        const english = makeT(await i18n.getMessages("en"));
        // Brand names and similar may be identical; anything longer than a few words must differ.
        for (const k of en.keys()) if (en.get(k)!.split(" ").length > 3) expect(t(k), `${locale}: ${k}`).not.toBe(english(k));
      });
    });
  }
});

describe("the site's code", () => {
  const sources = fs
    .readdirSync(path.join(ROOT, "src"), { recursive: true, encoding: "utf8" })
    .filter((f) => /\.tsx?$/.test(f))
    .map((f) => fs.readFileSync(path.join(ROOT, "src", f), "utf8"));
  it("looks up only keys that exist", async () => {
    const all = flatten((await i18n.getMessages("en")) as Tree);
    const used = new Set(sources.flatMap((s) => [...s.matchAll(/\bt\("([a-zA-Z.]+)"/g)].map((m) => m[1]!)));
    expect(used.size).toBeGreaterThan(20);
    expect([...used].filter((k) => !all.has(k))).toEqual([]);
  });
});
