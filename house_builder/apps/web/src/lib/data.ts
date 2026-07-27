import type { Brand, Term, WikiPage } from "@house-builder/schema";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import {
  DEMO_A5S_ID,
  DEMO_AES_ID,
  DEMO_HOUSE_ID,
  getLocalStore,
  matchBrand,
  matchTerm,
  type House,
  type ProposalRecord,
} from "@/lib/local-store";

export async function getDemoHouse(): Promise<House> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("houses")
      .select("*")
      .eq("id", DEMO_HOUSE_ID)
      .maybeSingle();
    if (data) return data as House;
  }
  return getLocalStore().houses[0];
}

export async function listHousesForUser(): Promise<House[]> {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("houses")
      .select("*")
      .or(
        user
          ? `is_public_demo.eq.true,owner_id.eq.${user.id}`
          : "is_public_demo.eq.true",
      )
      .order("created_at", { ascending: true });
    if (data?.length) return data as House[];
  }
  return getLocalStore().houses;
}

export async function getHouse(id: string): Promise<House | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("houses")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) return data as House;
  }
  return getLocalStore().houses.find((h) => h.id === id) ?? null;
}

export async function listProposals(houseId: string): Promise<ProposalRecord[]> {
  const supabase = await createClient();
  if (supabase) {
    const { data: proposals } = await supabase
      .from("proposals")
      .select("*")
      .eq("house_id", houseId)
      .order("package_name");
    if (proposals?.length) {
      const ids = proposals.map((p) => p.id);
      const { data: items } = await supabase
        .from("proposal_line_items")
        .select("*")
        .in("proposal_id", ids)
        .order("sort_order");
      return proposals.map((p) => ({
        ...(p as ProposalRecord),
        costs: (p.costs ?? {}) as Record<string, number | string>,
        notes: (p.notes as string[]) ?? [],
        line_items:
          items
            ?.filter((i) => i.proposal_id === p.id)
            .map((i) => ({
              space: i.space,
              category: i.category,
              spec: i.spec,
              brands: i.brands ?? [],
              term_slugs: i.term_slugs ?? [],
              notes: i.notes ?? undefined,
            })) ?? [],
      }));
    }
  }
  return getLocalStore().proposals.filter((p) => p.house_id === houseId);
}

export async function getProposal(id: string): Promise<ProposalRecord | null> {
  const all = [
    ...(await listProposals(DEMO_HOUSE_ID)),
  ];
  const local = getLocalStore().proposals.find((p) => p.id === id);
  if (id === DEMO_AES_ID || id === DEMO_A5S_ID || local) {
    const supabase = await createClient();
    if (supabase) {
      const { data: p } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (p) {
        const { data: items } = await supabase
          .from("proposal_line_items")
          .select("*")
          .eq("proposal_id", id)
          .order("sort_order");
        return {
          ...(p as ProposalRecord),
          costs: (p.costs ?? {}) as Record<string, number | string>,
          notes: (p.notes as string[]) ?? [],
          line_items:
            items?.map((i) => ({
              space: i.space,
              category: i.category,
              spec: i.spec,
              brands: i.brands ?? [],
              term_slugs: i.term_slugs ?? [],
            })) ?? [],
        };
      }
    }
    return local ?? all.find((p) => p.id === id) ?? null;
  }
  return local ?? null;
}

export async function listBrands(query?: string): Promise<Brand[]> {
  const supabase = await createClient();
  if (supabase) {
    let q = supabase.from("brands").select("*").order("name");
    if (query?.trim()) {
      q = q.or(
        `name.ilike.%${query}%,slug.ilike.%${query}%`,
      );
    }
    const { data } = await q;
    if (data?.length) return data as Brand[];
  }
  const brands = getLocalStore().brands;
  if (!query?.trim()) return brands;
  const qq = query.trim().toLowerCase();
  return brands.filter(
    (b) =>
      b.name.toLowerCase().includes(qq) ||
      b.slug.includes(qq) ||
      b.aliases.some((a) => a.toLowerCase().includes(qq)) ||
      b.categories.some((c) => c.includes(query.trim())),
  );
}

export async function listTerms(query?: string): Promise<Term[]> {
  const supabase = await createClient();
  if (supabase) {
    let q = supabase.from("terms").select("*").order("name");
    if (query?.trim()) {
      q = q.or(`name.ilike.%${query}%,slug.ilike.%${query}%`);
    }
    const { data } = await q;
    if (data?.length) return data as Term[];
  }
  const terms = getLocalStore().terms;
  if (!query?.trim()) return terms;
  const qq = query.trim().toLowerCase();
  return terms.filter(
    (t) =>
      t.name.toLowerCase().includes(qq) ||
      t.slug.includes(qq) ||
      t.aliases.some((a) => a.toLowerCase().includes(qq)),
  );
}

export async function getTermBySlug(slug: string): Promise<Term | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("terms")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Term;
  }
  return getLocalStore().terms.find((t) => t.slug === slug) ?? null;
}

export async function getWikiPage(slug: string): Promise<WikiPage | null> {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("wiki_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) {
      return {
        slug: data.slug,
        title: data.title,
        body_md: data.body_md,
        term_slug: data.term_slug ?? undefined,
        brand_slug: data.brand_slug ?? undefined,
        source: data.source,
      };
    }
  }
  return getLocalStore().wiki.find((w) => w.slug === slug) ?? null;
}

export async function listWikiPages(query?: string): Promise<WikiPage[]> {
  const supabase = await createClient();
  if (supabase) {
    let q = supabase.from("wiki_pages").select("*").eq("is_public", true).order("title");
    if (query?.trim()) {
      q = q.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
    }
    const { data } = await q;
    if (data?.length) {
      return data.map((d) => ({
        slug: d.slug,
        title: d.title,
        body_md: d.body_md,
        term_slug: d.term_slug ?? undefined,
        brand_slug: d.brand_slug ?? undefined,
        source: d.source,
      }));
    }
  }
  const pages = getLocalStore().wiki;
  if (!query?.trim()) return pages;
  const qq = query.trim().toLowerCase();
  return pages.filter(
    (p) => p.title.toLowerCase().includes(qq) || p.slug.includes(qq),
  );
}

export async function findBrandLocalOrDb(query: string): Promise<Brand | null> {
  const admin = createServiceClient();
  if (admin) {
    const { data } = await admin
      .from("brands")
      .select("*")
      .or(`name.eq.${query},slug.eq.${query}`)
      .maybeSingle();
    if (data) return data as Brand;
    const { data: all } = await admin.from("brands").select("*");
    if (all) {
      const hit = matchBrand(query, all as Brand[]);
      if (hit) return hit;
    }
  }
  return matchBrand(query, getLocalStore().brands);
}

export async function findTermLocalOrDb(query: string): Promise<Term | null> {
  const admin = createServiceClient();
  if (admin) {
    const { data: all } = await admin.from("terms").select("*");
    if (all) {
      const hit = matchTerm(query, all as Term[]);
      if (hit) return hit;
    }
  }
  return matchTerm(query, getLocalStore().terms);
}

export async function persistBrand(brand: Brand): Promise<Brand> {
  const admin = createServiceClient();
  if (admin) {
    const { data, error } = await admin
      .from("brands")
      .upsert(
        {
          slug: brand.slug,
          name: brand.name,
          aliases: brand.aliases,
          categories: brand.categories,
          tier: brand.tier,
          summary: brand.summary,
          source: brand.source,
          confidence: brand.confidence,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("*")
      .single();
    if (!error && data) return data as Brand;
  }
  const store = getLocalStore();
  const idx = store.brands.findIndex((b) => b.slug === brand.slug);
  if (idx >= 0) store.brands[idx] = brand;
  else store.brands.push(brand);
  return brand;
}

export async function persistTerm(
  term: Term,
  wikiDraft?: string,
): Promise<Term> {
  const admin = createServiceClient();
  if (admin) {
    const { data, error } = await admin
      .from("terms")
      .upsert(
        {
          slug: term.slug,
          name: term.name,
          aliases: term.aliases,
          summary: term.summary,
          category: term.category,
          source: term.source,
          confidence: term.confidence,
          wiki_slug: term.wiki_slug ?? term.slug,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("*")
      .single();
    if (wikiDraft) {
      await admin.from("wiki_pages").upsert(
        {
          slug: term.wiki_slug ?? term.slug,
          title: term.name,
          body_md: wikiDraft,
          term_slug: term.slug,
          source: "enrich",
          is_public: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      );
    }
    if (!error && data) return data as Term;
  }
  const store = getLocalStore();
  const idx = store.terms.findIndex((t) => t.slug === term.slug);
  if (idx >= 0) store.terms[idx] = term;
  else store.terms.push(term);
  if (wikiDraft) {
    const page = {
      slug: term.wiki_slug ?? term.slug,
      title: term.name,
      body_md: wikiDraft,
      term_slug: term.slug,
      source: "enrich" as const,
    };
    const widx = store.wiki.findIndex((w) => w.slug === page.slug);
    if (widx >= 0) store.wiki[widx] = page;
    else store.wiki.push(page);
  }
  return term;
}

export async function recordEnrichJob(job: Record<string, unknown>) {
  const admin = createServiceClient();
  if (admin) {
    await admin.from("enrich_jobs").insert({
      kind: job.kind,
      query: job.query,
      provider: job.provider,
      raw: job.raw ?? null,
      result_slug: job.result_slug ?? null,
      status: job.status ?? "ok",
      error: job.error ?? null,
    });
  }
  getLocalStore().enrichJobs.push({
    ...job,
    created_at: new Date().toISOString(),
  });
}

export function formatMoney(n: number | string | undefined | null) {
  const v = typeof n === "string" ? Number(n) : n;
  if (v == null || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 2,
  }).format(v);
}
