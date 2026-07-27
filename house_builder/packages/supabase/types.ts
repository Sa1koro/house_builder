// Database types (hand-written for Phase 1; regenerate with supabase gen types when linked)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BrandTier = "entry" | "mainstream" | "first_line" | "premium";
export type KnowledgeSource = "seed" | "enrich" | "editor";
export type OcrStatus =
  | "pending"
  | "processing"
  | "draft"
  | "reviewed"
  | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      houses: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          city: string | null;
          layout: string | null;
          sales_area_sqm: number | null;
          billing_area_sqm: number | null;
          is_public_demo: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          house_id: string;
          owner_id: string | null;
          company: string;
          package_name: string;
          version: string;
          billing_area_sqm: number | null;
          sales_area_sqm: number | null;
          costs: Json;
          notes: Json;
          source: string;
          is_public_demo: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      brands: {
        Row: {
          id: string;
          slug: string;
          name: string;
          aliases: string[];
          categories: string[];
          tier: BrandTier;
          summary: string | null;
          source: KnowledgeSource;
          confidence: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      terms: {
        Row: {
          id: string;
          slug: string;
          name: string;
          aliases: string[];
          summary: string;
          category: string | null;
          source: KnowledgeSource;
          confidence: number | null;
          wiki_slug: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
