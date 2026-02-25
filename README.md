# @quercle/langchain

Quercle web search, fetch, and extraction tools for [LangChain.js](https://js.langchain.com/).

## Installation

```bash
bun add @quercle/langchain
# or
npm install @quercle/langchain
```

## Setup

Set your API key as an environment variable:

```bash
export QUERCLE_API_KEY=qk_...
```

Get your API key at [quercle.dev](https://quercle.dev).

## Quick Start

```ts
import {
  quercleSearch,
  quercleFetch,
  quercleRawSearch,
  quercleRawFetch,
  quercleExtract,
} from "@quercle/langchain";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });
const modelWithTools = model.bindTools([
  quercleSearch,
  quercleFetch,
  quercleRawSearch,
  quercleRawFetch,
  quercleExtract,
]);

const result = await modelWithTools.invoke("Search for the latest AI news");
console.log(result);
```

## Tools

### `quercleSearch` -- AI-Synthesized Web Search

Searches the web and returns an AI-synthesized answer with citations.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | `string` | Yes | Search query |
| `allowedDomains` | `string[]` | No | Only include results from these domains |
| `blockedDomains` | `string[]` | No | Exclude results from these domains |

### `quercleFetch` -- Fetch URL and Analyze with AI

Fetches a URL and processes its content with an AI prompt.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | URL to fetch |
| `prompt` | `string` | Yes | Instructions for how to process the page content |

### `quercleRawSearch` -- Raw Web Search

Searches the web and returns raw search results without AI synthesis.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | `string` | Yes | Search query |
| `format` | `"markdown" \| "json"` | No | Response format |
| `useSafeguard` | `boolean` | No | Enable content safety filtering |

### `quercleRawFetch` -- Raw URL Content

Fetches a URL and returns its raw content without AI processing.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | URL to fetch |
| `format` | `"markdown" \| "html"` | No | Response format |
| `useSafeguard` | `boolean` | No | Enable content safety filtering |

### `quercleExtract` -- Extract Relevant Content from URL

Fetches a URL and returns only the chunks relevant to a query.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | URL to fetch |
| `query` | `string` | Yes | Query describing what content to extract |
| `format` | `"markdown" \| "json"` | No | Response format |
| `useSafeguard` | `boolean` | No | Enable content safety filtering |

## Direct Tool Usage

Use the tools directly without an LLM:

```ts
import {
  quercleSearch,
  quercleFetch,
  quercleRawSearch,
  quercleRawFetch,
  quercleExtract,
} from "@quercle/langchain";

// AI-synthesized search
const searchResult = await quercleSearch.invoke({
  query: "best practices for building AI agents",
});

// Search with domain filtering
const filtered = await quercleSearch.invoke({
  query: "TypeScript documentation",
  allowedDomains: ["typescriptlang.org"],
});

// Fetch and analyze a page with AI
const fetchResult = await quercleFetch.invoke({
  url: "https://en.wikipedia.org/wiki/TypeScript",
  prompt: "Summarize the key features of TypeScript",
});

// Raw search results as JSON
const rawResults = await quercleRawSearch.invoke({
  query: "LangChain.js tutorials",
  format: "json",
});

// Raw page content as markdown
const rawPage = await quercleRawFetch.invoke({
  url: "https://en.wikipedia.org/wiki/TypeScript",
  format: "markdown",
});

// Extract relevant content from a page
const extracted = await quercleExtract.invoke({
  url: "https://example.com/pricing",
  query: "pricing plans and features",
  format: "json",
});
```

### Custom API Key

```ts
import { createQuercleTools } from "@quercle/langchain";

const {
  quercleSearch,
  quercleFetch,
  quercleRawSearch,
  quercleRawFetch,
  quercleExtract,
} = createQuercleTools({ apiKey: "qk_..." });
```

## Agentic Usage

### With LangGraph ReAct Agent

```ts
import {
  quercleSearch,
  quercleFetch,
  quercleRawSearch,
  quercleRawFetch,
  quercleExtract,
} from "@quercle/langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const model = new ChatOpenAI({ model: "gpt-4o" });

const agent = createReactAgent({
  llm: model,
  tools: [quercleSearch, quercleFetch, quercleRawSearch, quercleRawFetch, quercleExtract],
});

const response = await agent.invoke({
  messages: [
    {
      role: "user",
      content:
        "Search for the latest developments in WebAssembly, then fetch the most relevant page and summarize it",
    },
  ],
});

console.log(response.messages.at(-1)?.content);
```

### Streaming

```ts
for await (const chunk of await agent.stream(
  {
    messages: [
      { role: "user", content: "Research AI agent frameworks and compare them" },
    ],
  },
  { streamMode: "values" },
)) {
  const lastMessage = chunk.messages.at(-1);
  if (lastMessage) console.log(lastMessage.content);
}
```

## API Reference

| Export | Description |
|---|---|
| `quercleSearch` | `DynamicStructuredTool` -- AI-synthesized web search with citations |
| `quercleFetch` | `DynamicStructuredTool` -- Fetch a URL and analyze content with AI |
| `quercleRawSearch` | `DynamicStructuredTool` -- Raw web search results (markdown/json) |
| `quercleRawFetch` | `DynamicStructuredTool` -- Raw URL content (markdown/html) |
| `quercleExtract` | `DynamicStructuredTool` -- Extract relevant content from a URL |
| `createQuercleTools(options?)` | Factory returning all 5 tools with custom API key or config |

All tools use the `QUERCLE_API_KEY` environment variable by default. Use `createQuercleTools()` to provide a custom API key.

## License

MIT
