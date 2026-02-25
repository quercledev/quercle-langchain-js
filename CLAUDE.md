# CLAUDE.md - Quercle LangChain.js Integration

## Project Overview

TypeScript package integrating Quercle web tools with LangChain.js. Provides 5 tools (`quercleSearch`, `quercleFetch`, `quercleRawSearch`, `quercleRawFetch`, `quercleExtract`) using LangChain's `DynamicStructuredTool` class.

## Development Guidelines

**IMPORTANT:**
- Always use the **latest stable versions** of all dependencies
- Use **`bun`** for package management (NOT npm/yarn)
- Use modern TypeScript patterns and strict types
- Check npm for current versions before specifying dependencies

## Quercle API

### Authentication
- Header: `Authorization: Bearer qk_...`
- Env var: `QUERCLE_API_KEY`

### Endpoints

**POST https://api.quercle.dev/v1/search**
```json
// Request
{"query": "...", "allowed_domains": ["*.edu"], "blocked_domains": ["spam.com"]}
// Response
{"result": "Synthesized answer with [1] citations...\n\nSources:\n[1] Title - URL"}
```

**POST https://api.quercle.dev/v1/fetch**
```json
// Request
{"url": "https://...", "prompt": "Summarize this page"}
// Response
{"result": "AI-processed content..."}
```

**POST https://api.quercle.dev/v1/raw_search**
```json
// Request
{"query": "...", "format": "markdown", "use_safeguard": true}
// Response
{"result": "Raw search results...", "unsafe": false}
```

**POST https://api.quercle.dev/v1/raw_fetch**
```json
// Request
{"url": "https://...", "format": "markdown", "use_safeguard": true}
// Response
{"result": "Raw page content...", "unsafe": false}
```

**POST https://api.quercle.dev/v1/extract**
```json
// Request
{"url": "https://...", "query": "pricing info", "format": "json", "use_safeguard": true}
// Response
{"result": "Extracted content...", "unsafe": false}
```

## Package Structure

```
src/
├── index.ts             # Exports all 5 tools + createQuercleTools + re-exported SDK types
├── tools.ts             # LangChain DynamicStructuredTool definitions (5 tools)
└── tools.test.ts        # Unit tests
dist/                    # Compiled output
package.json
tsconfig.json
biome.json               # Linting/formatting
knip.json                # Unused code detection
README.md
LICENSE                  # MIT
```

## Tool Implementation

Uses `@quercle/sdk` for the client and `toolMetadata` for descriptions. Zod schemas are defined locally in `tools.ts`.

```typescript
import { DynamicStructuredTool } from "@langchain/core/tools";
import { QuercleClient, toolMetadata, type QuercleClientOptions } from "@quercle/sdk";
import { z } from "zod";

const searchToolSchema = z.object({
  query: z.string().describe(toolMetadata.search.parameters.query),
  allowedDomains: z.array(z.string()).optional()
    .describe(toolMetadata.search.parameters.allowed_domains),
  blockedDomains: z.array(z.string()).optional()
    .describe(toolMetadata.search.parameters.blocked_domains),
});

export const quercleSearch = new DynamicStructuredTool({
  name: "quercle_search",
  description: toolMetadata.search.description,
  schema: searchToolSchema,
  func: async ({ query, allowedDomains, blockedDomains }) => {
    return (await getDefaultClient().search(query, { allowedDomains, blockedDomains })).result;
  },
});
```

### All 5 Tools

| Export | Tool name | SDK method | Description |
|---|---|---|---|
| `quercleSearch` | `quercle_search` | `client.search()` | AI-synthesized search with citations |
| `quercleFetch` | `quercle_fetch` | `client.fetch()` | Fetch URL and analyze with AI |
| `quercleRawSearch` | `quercle_raw_search` | `client.rawSearch()` | Raw web search results |
| `quercleRawFetch` | `quercle_raw_fetch` | `client.rawFetch()` | Raw URL content (markdown/HTML) |
| `quercleExtract` | `quercle_extract` | `client.extract()` | Extract relevant chunks from a URL |

## Commands

```bash
bun install              # Install deps
bun run build           # Build TypeScript
bun run test            # Run tests
bun run lint            # Lint with Biome
bun run knip            # Check for unused code
bun publish             # Publish to npm
```

## Dependencies

- @quercle/sdk ^1.0.0 (client, toolMetadata)
- @langchain/core >= 0.3.0 (peer dependency)
- zod
- TypeScript 5+

## Usage Example

```typescript
import { quercleSearch, quercleFetch, quercleRawSearch, quercleRawFetch, quercleExtract } from "@quercle/langchain";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o" });
const modelWithTools = model.bindTools([
  quercleSearch, quercleFetch, quercleRawSearch, quercleRawFetch, quercleExtract,
]);

const response = await modelWithTools.invoke("Search for the latest AI news");
```

### With Custom API Key

```typescript
import { createQuercleTools } from "@quercle/langchain";

const { quercleSearch, quercleFetch, quercleRawSearch, quercleRawFetch, quercleExtract } = createQuercleTools({
  apiKey: "qk_...",
});
```

## Publishing

- Package name on npm: `@quercle/langchain`
- Use npm OIDC with GitHub Actions
