import data from "./data/catalog.json";
import type { Locale } from "./shared";
type Translation = { en: string; ar: string;  };
export type CatalogEntry = {
  id: string;
  recommendedDensity?: string;
  group: string;
  name: Translation;
  description: Translation;
  icon: string;
  states: string[];
  variants: string[];
  keywords: string[];
  tokens: string[];
  verification: string[];
  guidance?: Translation[];
  accessibility?: Translation[];
  specimens?: { id: string; name: Translation; description: Translation }[];
};
export const catalog: CatalogEntry[] = data;
export const groups = [
  "Foundations",
  "Components",
  "Patterns",
  "Review",
] as const;
export const tabs = [
  "playground",
  "variants",
  "states",
  "tokens",
  "usage",
  "accessibility",
] as const;
export type ContentTab = (typeof tabs)[number];
export function label(value: Record<string, string>, locale: Locale) {
  return value[locale] ?? value.en;
}
