# @quercle/langchain

Quercle web tools for [LangChain.js](https://js.langchain.com/).

Provides `quercleSearch` and `quercleFetch` tools that integrate seamlessly with AI applications built on LangChain.js.

## Installation

```bash
bun add @quercle/langchain
```

```bash
npm install @quercle/langchain
```

## Setup

Set your Quercle API key as an environment variable:

```bash
export QUERCLE_API_KEY=qk_...
```

Get your API key at [quercle.dev](https://quercle.dev).

## Usage

### With ChatOpenAI and bindTools

```typescript
import { quercleSearch, quercleFetch } from "@quercle/langchain";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });
const modelWithTools = model.bindTools([quercleSearch, quercleFetch]);

const response = await modelWithTools.invoke(
  "Search for the latest news about AI and summarize"
);
```

### With an Agent

```typescript
import { quercleSearch, quercleFetch } from "@quercle/langchain";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o" });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that can search the web."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createOpenAIToolsAgent({
  llm: model,
  tools: [quercleSearch, quercleFetch],
  prompt,
});

const executor = new AgentExecutor({
  agent,
  tools: [quercleSearch, quercleFetch],
});

const result = await executor.invoke({
  input: "Find information about TypeScript 5 and summarize the key features",
});
```

### With Custom API Key

```typescript
import { createQuercleTools } from "@quercle/langchain";
import { ChatOpenAI } from "@langchain/openai";

const { quercleSearch, quercleFetch } = createQuercleTools({
  apiKey: "qk_...",
});

const model = new ChatOpenAI({ model: "gpt-4o" });
const modelWithTools = model.bindTools([quercleSearch, quercleFetch]);

const response = await modelWithTools.invoke(
  "Search for TypeScript best practices"
);
```

### Direct Tool Invocation

```typescript
import { quercleSearch, quercleFetch } from "@quercle/langchain";

// Search the web
const searchResult = await quercleSearch.invoke({
  query: "latest TypeScript features",
});

// Fetch and analyze a URL
const fetchResult = await quercleFetch.invoke({
  url: "https://example.com",
  prompt: "Summarize the main content",
});
```

## Tools

### quercleSearch

Search the web and get AI-synthesized answers with citations.

**Parameters:**
- `query` (string, required): The search query
- `allowedDomains` (string[], optional): Only include results from these domains
- `blockedDomains` (string[], optional): Exclude results from these domains

### quercleFetch

Fetch a URL and analyze its content with AI.

**Parameters:**
- `url` (string, required): The URL to fetch
- `prompt` (string, required): Instructions for how to analyze the content

## License

MIT
