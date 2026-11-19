import { RootLocalePage } from "@lumenary/core/site";

/** `/` picks a language: a remembered choice, else the browser's preferences, else English. */
export default function RootPage() {
  return <RootLocalePage title="Lumenary Lingua" tagline="Languages, each taught through one you already know." />;
}
