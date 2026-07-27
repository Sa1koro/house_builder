export type EnrichKind = "brand" | "term";

export interface EnrichProvider {
  readonly name: string;
  lookup(kind: EnrichKind, query: string): Promise<unknown>;
}

export function normalizeSlug(value: string): string {
  const slug = value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  if (!slug) throw new Error("Cannot create a stable slug from an empty value");
  return slug.slice(0, 100);
}
