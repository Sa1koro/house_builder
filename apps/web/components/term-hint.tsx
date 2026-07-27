import Link from "next/link";
import { demoTerms } from "@/lib/demo";

export function TermHint({ slug }: { slug: string }) {
  const term = demoTerms[slug];
  if (!term) return <>{slug}</>;
  return <Link href={`/wiki/${slug}`} title={term.summary} style={{ textDecoration: "underline dotted" }}>{term.title}</Link>;
}
