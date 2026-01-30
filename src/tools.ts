import { DynamicStructuredTool } from "@langchain/core/tools";
import {
	type FetchToolInput,
	QuercleClient,
	type QuercleConfig,
	type SearchToolInput,
	TOOL_DESCRIPTIONS,
	fetchToolSchema,
	searchToolSchema,
} from "@quercle/sdk";

/**
 * Search the web using Quercle and get AI-synthesized answers with citations.
 *
 * Uses the QUERCLE_API_KEY environment variable for authentication.
 *
 * @example
 * ```typescript
 * import { quercleSearch } from "@quercle/langchain";
 * import { ChatOpenAI } from "@langchain/openai";
 *
 * const model = new ChatOpenAI({ model: "gpt-4o" });
 * const modelWithTools = model.bindTools([quercleSearch]);
 * const response = await modelWithTools.invoke("Search for the latest AI news");
 * ```
 */
export const quercleSearch = new DynamicStructuredTool({
	name: "quercle_search",
	description: TOOL_DESCRIPTIONS.SEARCH,
	schema: searchToolSchema,
	func: async ({ query, allowedDomains, blockedDomains }: SearchToolInput) => {
		const client = new QuercleClient();
		return await client.search(query, { allowedDomains, blockedDomains });
	},
});

/**
 * Fetch a URL and analyze its content with AI using Quercle.
 *
 * Uses the QUERCLE_API_KEY environment variable for authentication.
 *
 * @example
 * ```typescript
 * import { quercleFetch } from "@quercle/langchain";
 * import { ChatOpenAI } from "@langchain/openai";
 *
 * const model = new ChatOpenAI({ model: "gpt-4o" });
 * const modelWithTools = model.bindTools([quercleFetch]);
 * const response = await modelWithTools.invoke("Fetch https://example.com and summarize it");
 * ```
 */
export const quercleFetch = new DynamicStructuredTool({
	name: "quercle_fetch",
	description: TOOL_DESCRIPTIONS.FETCH,
	schema: fetchToolSchema,
	func: async ({ url, prompt }: FetchToolInput) => {
		const client = new QuercleClient();
		return await client.fetch(url, prompt);
	},
});

/**
 * Create Quercle tools with custom configuration.
 *
 * Use this when you need to provide a custom API key instead of
 * using the QUERCLE_API_KEY environment variable.
 *
 * @example
 * ```typescript
 * import { createQuercleTools } from "@quercle/langchain";
 * import { ChatOpenAI } from "@langchain/openai";
 *
 * const { quercleSearch, quercleFetch } = createQuercleTools({
 *   apiKey: "qk_...",
 * });
 *
 * const model = new ChatOpenAI({ model: "gpt-4o" });
 * const modelWithTools = model.bindTools([quercleSearch, quercleFetch]);
 * const response = await modelWithTools.invoke("Search for TypeScript best practices");
 * ```
 */
export function createQuercleTools(config?: QuercleConfig) {
	const client = new QuercleClient(config);

	return {
		quercleSearch: new DynamicStructuredTool({
			name: "quercle_search",
			description: TOOL_DESCRIPTIONS.SEARCH,
			schema: searchToolSchema,
			func: async ({ query, allowedDomains, blockedDomains }: SearchToolInput) => {
				return await client.search(query, { allowedDomains, blockedDomains });
			},
		}),
		quercleFetch: new DynamicStructuredTool({
			name: "quercle_fetch",
			description: TOOL_DESCRIPTIONS.FETCH,
			schema: fetchToolSchema,
			func: async ({ url, prompt }: FetchToolInput) => {
				return await client.fetch(url, prompt);
			},
		}),
	};
}
