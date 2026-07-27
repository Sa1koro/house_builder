export interface EnrichConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  /** 外搜 provider；目前支持 tavily。留空跳过外搜，直接走 LLM。 */
  searchProvider?: "tavily" | "";
  tavilyApiKey?: string;
  /** OpenAI 兼容端点（OpenAI / DeepSeek / Moonshot / vLLM ...） */
  llmBaseUrl?: string;
  llmApiKey?: string;
  llmModel?: string;
}

/** 从环境变量装配配置；在 Route Handler / Server Action 里调用（勿在客户端）。 */
export function enrichConfigFromEnv(): EnrichConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY，enrich 无法写公共表");
  }
  return {
    supabaseUrl,
    serviceRoleKey,
    searchProvider: (process.env.ENRICH_SEARCH_PROVIDER ?? "") as EnrichConfig["searchProvider"],
    tavilyApiKey: process.env.TAVILY_API_KEY,
    llmBaseUrl: process.env.ENRICH_LLM_BASE_URL,
    llmApiKey: process.env.ENRICH_LLM_API_KEY,
    llmModel: process.env.ENRICH_LLM_MODEL,
  };
}

export function hasLlm(config: EnrichConfig): boolean {
  return Boolean(config.llmBaseUrl && config.llmApiKey && config.llmModel);
}
