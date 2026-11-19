/**
 * No learner-facing text may describe, or implicitly encourage, actions that could hurt people or
 * damage property: every lesson, exercise file, syllabus and interface string.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./helpers";
import { safetyProblems } from "./safety-rules";

function files(dir: string, ext: RegExp): string[] {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { recursive: true, encoding: "utf8" }).filter((f) => ext.test(f)).map((f) => path.join(dir, f));
}

const SOURCES = [...files("content/lingua", /\.(mdx|json)$/), ...files("src/i18n/messages", /\.json$/)];

describe("safety of examples", () => {
  it("finds the sources", () => expect(SOURCES.length).toBeGreaterThan(140));
  it("detects an unsafe example and allows a warning", () => {
    expect(safetyProblems("A stone is dropped from a bridge.")).not.toEqual([]);
    expect(safetyProblems("Do not look directly at the Sun.")).toEqual([]);
    expect(safetyProblems("Never touch a live wire or open a mains plug.")).toEqual([]);
  });
  for (const file of SOURCES)
    it(file, () => {
      expect(safetyProblems(fs.readFileSync(path.join(ROOT, file), "utf8"))).toEqual([]);
    });
});
