import type { Brand, Term, WikiPage } from "@house-builder/schema";
import brandsSeed from "../../../../content/seed/brands.json";
import termsSeed from "../../../../content/seed/terms.json";
import houseDemo from "../../../../houses/demo-90sqm/house.json";
import proposalAes from "../../../../houses/demo-90sqm/proposal-aes.json";
import proposalA5s from "../../../../houses/demo-90sqm/proposal-a5s.json";

export type House = {
  id: string;
  name: string;
  city?: string | null;
  layout?: string | null;
  sales_area_sqm?: number | null;
  billing_area_sqm?: number | null;
  is_public_demo: boolean;
  notes?: string | null;
  owner_id?: string | null;
};

export type ProposalRecord = {
  id: string;
  house_id: string;
  company: string;
  package_name: string;
  version?: string;
  billing_area_sqm?: number;
  sales_area_sqm?: number;
  costs: Record<string, number | string>;
  notes?: string[];
  source?: string;
  is_public_demo?: boolean;
  line_items: Array<{
    space: string;
    category: string;
    spec: string;
    brands?: string[];
    term_slugs?: string[];
    notes?: string;
  }>;
};

type Store = {
  brands: Brand[];
  terms: Term[];
  wiki: WikiPage[];
  enrichJobs: Array<Record<string, unknown>>;
  drafts: Array<Record<string, unknown>>;
  houses: House[];
  proposals: ProposalRecord[];
};

declare global {
  // Persists seed + enrich results across HMR in local demo mode.
  var __houseBuilderStore: Store | undefined;
}

function wikiFromTerms(terms: Term[]): WikiPage[] {
  return terms.map((t) => ({
    slug: t.wiki_slug || t.slug,
    title: t.name,
    body_md: `# ${t.name}\n\n${t.summary}\n`,
    term_slug: t.slug,
    source: t.source ?? "seed",
  }));
}

function createStore(): Store {
  const terms = termsSeed as Term[];
  return {
    brands: structuredClone(brandsSeed as Brand[]),
    terms: structuredClone(terms),
    wiki: wikiFromTerms(terms).concat([
      {
        slug: "brand-tata",
        title: "TATA 木门",
        body_md:
          "# TATA 木门\n\n一线木门品牌。在本 Demo 中属于 **A5s 相对 AEs 的升级选项**。\n",
        brand_slug: "tata",
        source: "seed",
      },
      {
        slug: "brand-sika",
        title: "西卡防水",
        body_md: "# 西卡\n\n国际防水材料品牌，A5s 阳台/卫浴可选升级。\n",
        brand_slug: "sika",
        source: "seed",
      },
    ]),
    enrichJobs: [],
    drafts: [],
    houses: [houseDemo as House],
    proposals: [
      proposalAes as ProposalRecord,
      proposalA5s as ProposalRecord,
    ],
  };
}

export function getLocalStore(): Store {
  if (!globalThis.__houseBuilderStore) {
    globalThis.__houseBuilderStore = createStore();
  }
  return globalThis.__houseBuilderStore;
}

export function resetLocalStore() {
  globalThis.__houseBuilderStore = createStore();
}

export const DEMO_HOUSE_ID = "aaaaaaaa-bbbb-cccc-dddd-000000000001";
export const DEMO_AES_ID = "aaaaaaaa-bbbb-cccc-dddd-0000000000a1";
export const DEMO_A5S_ID = "aaaaaaaa-bbbb-cccc-dddd-0000000000a5";

export function matchBrand(query: string, brands: Brand[]): Brand | null {
  const q = query.trim().toLowerCase();
  return (
    brands.find(
      (b) =>
        b.slug === q ||
        b.name.toLowerCase() === q ||
        b.aliases.some((a) => a.toLowerCase() === q),
    ) ?? null
  );
}

export function matchTerm(query: string, terms: Term[]): Term | null {
  const q = query.trim().toLowerCase();
  return (
    terms.find(
      (t) =>
        t.slug === q ||
        t.name.toLowerCase() === q ||
        t.aliases.some((a) => a.toLowerCase() === q),
    ) ?? null
  );
}
