import type { EnrichConfig } from "./config";

export interface SearchSnippet {
  title: string;
  url: string;
  content: string;
}

/** 外部检索：目前实现 tavily；返回空数组表示未配置或失败（不阻塞主流程）。 */
export async function webSearch(query: string, config: EnrichConfig): Promise<SearchSnippet[]> {
  if (config.searchProvider !== "tavily" || !config.tavilyApiKey) return [];
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: config.tavilyApiKey,
        query,
        max_results: 5,
        search_depth: "basic",
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: SearchSnippet[] };
    return (data.results ?? []).map((r) => ({
      title: r.title ?? "",
      url: r.url ?? "",
      content: (r.content ?? "").slice(0, 500),
    }));
  } catch {
    return [];
  }
}

/** OpenAI 兼容 chat completions，要求返回 JSON。返回 null 表示未配置或调用失败。 */
export async function llmJson(
  systemPrompt: string,
  userPrompt: string,
  config: EnrichConfig
): Promise<Record<string, unknown> | null> {
  if (!config.llmBaseUrl || !config.llmApiKey || !config.llmModel) return null;
  try {
    const res = await fetch(`${config.llmBaseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.llmApiKey}`,
      },
      body: JSON.stringify({
        model: config.llmModel,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}
