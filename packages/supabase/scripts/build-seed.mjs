#!/usr/bin/env node
/**
 * 从单一数据源生成 seed.sql：
 *   - content/seed/terms.json  → terms（+ content/seed/wiki/<slug>.md → wiki_pages）
 *   - content/seed/brands.json → brands
 *   - houses/demo-90sqm/       → 公开示例房 + AEs/A5s 两份方案 + 明细
 *
 * 用法：node packages/supabase/scripts/build-seed.mjs
 * 输出：packages/supabase/seed.sql（已入库，改种子数据后重新生成并提交）
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const seedDir = join(root, "content/seed");
const demoDir = join(root, "houses/demo-90sqm");
const outFile = join(root, "packages/supabase/seed.sql");

const q = (v) => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
};
const arr = (v) => {
  if (!v || v.length === 0) return "'{}'::text[]";
  return `array[${v.map((x) => q(x)).join(", ")}]::text[]`;
};
const jsonb = (v) => `${q(JSON.stringify(v))}::jsonb`;

const lines = [
  "-- house_builder · seed.sql（由 packages/supabase/scripts/build-seed.mjs 生成，勿手改）",
  "-- 应用方式：Supabase SQL Editor 粘贴执行，或 psql -f seed.sql（需先跑 migrations）",
  "",
];

// ---------- terms + wiki_pages ----------
const terms = JSON.parse(readFileSync(join(seedDir, "terms.json"), "utf8"));
lines.push("-- ===== terms =====");
for (const t of terms) {
  lines.push(
    `insert into public.terms (slug, name, short_def, aliases, source, confidence) values (` +
      `${q(t.slug)}, ${q(t.name)}, ${q(t.short_def)}, ${arr(t.aliases)}, ${q(t.source ?? "seed")}, ${t.confidence ?? 1})` +
      ` on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();`
  );
}

lines.push("", "-- ===== wiki_pages =====");
const wikiDir = join(seedDir, "wiki");
if (existsSync(wikiDir)) {
  for (const file of readdirSync(wikiDir).filter((f) => f.endsWith(".md")).sort()) {
    const slug = file.replace(/\.md$/, "");
    const body = readFileSync(join(wikiDir, file), "utf8").trim();
    const term = terms.find((t) => t.slug === slug);
    const title = body.match(/^#\s+(.+)$/m)?.[1] ?? term?.name ?? slug;
    lines.push(
      `insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values (` +
        `${q(slug)}, ${term ? q(slug) : "null"}, ${q(title)}, ${q(body)}, 'published', 'seed')` +
        ` on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();`
    );
  }
}

// ---------- brands ----------
const brands = JSON.parse(readFileSync(join(seedDir, "brands.json"), "utf8"));
lines.push("", "-- ===== brands =====");
for (const b of brands) {
  lines.push(
    `insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values (` +
      `${q(b.slug)}, ${q(b.name)}, ${arr(b.aliases)}, ${arr(b.categories)}, ${q(b.tier)}, ${q(b.one_liner)}, ${q(b.country)}, ${q(b.source ?? "seed")}, ${b.confidence ?? 1})` +
      ` on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();`
  );
}

// ---------- demo house + proposals ----------
const house = JSON.parse(readFileSync(join(demoDir, "house.json"), "utf8"));
lines.push("", "-- ===== 公开示例房（未登录可浏览对比） =====");
lines.push(
  `insert into public.houses (id, owner_id, name, city, layout, sales_area_sqm, billing_area_sqm, is_public_demo) values (` +
    `${q(house.id)}, null, ${q(house.name)}, ${q(house.city)}, ${q(house.layout)}, ${house.sales_area_sqm}, ${house.billing_area_sqm}, true)` +
    ` on conflict (id) do update set name = excluded.name, billing_area_sqm = excluded.billing_area_sqm;`
);

for (const file of ["proposal-aes.json", "proposal-a5s.json"]) {
  const p = JSON.parse(readFileSync(join(demoDir, file), "utf8"));
  lines.push("", `-- demo proposal: ${p.package_name}`);
  lines.push(
    `insert into public.proposals (id, house_id, company, package_name, version, status, source, pricing, total_base, total_with_fees, notes) values (` +
      `${q(p.id)}, ${q(house.id)}, ${q(p.company)}, ${q(p.package_name)}, ${q(p.version)}, 'confirmed', 'demo', ${jsonb(p.pricing)}, ${p.pricing.total_base}, ${p.pricing.total_with_fees}, ${arr(p.notes)})` +
      ` on conflict (id) do update set pricing = excluded.pricing, total_base = excluded.total_base, total_with_fees = excluded.total_with_fees, notes = excluded.notes;`
  );
  lines.push(`delete from public.proposal_line_items where proposal_id = ${q(p.id)};`);
  p.line_items.forEach((li, i) => {
    lines.push(
      `insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values (` +
        `${q(p.id)}, ${i}, ${q(li.space)}, ${q(li.category)}, ${arr(li.brands)}, ${q(li.spec)}, ${q(li.note)}, ${arr(li.term_slugs)});`
    );
  });
}

lines.push("");
writeFileSync(outFile, lines.join("\n"), "utf8");
console.log(`Wrote ${outFile}`);
console.log(`  terms: ${terms.length}, brands: ${brands.length}, demo line items: seeded`);
