import { z } from "zod";

export const proposalDraftSchema = z.object({
  company: z.string().min(1),
  packageName: z.string().min(1),
  version: z.string().min(1).default("OCR draft"),
  currency: z.literal("CNY").default("CNY"),
  pricingArea: z.number().nonnegative().optional(),
  costs: z.object({
    hardFit: z.number().nonnegative(),
    customization: z.number().nonnegative(),
    management: z.number().nonnegative(),
    projectManager: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  lineItems: z.array(z.object({
    space: z.string(),
    category: z.string(),
    specification: z.string(),
    brands: z.array(z.string()),
    termSlugs: z.array(z.string()).optional(),
    notes: z.string().optional(),
  })),
  sourceAssetUrl: z.string().url().optional(),
  ocrConfidence: z.number().min(0).max(1).optional(),
});

export type ProposalDraft = z.infer<typeof proposalDraftSchema>;
