import { describe, expect, it } from "bun:test";
import { createQuercleTools, quercleFetch, quercleSearch } from "./tools.js";

describe("quercleSearch", () => {
	it("should have a name", () => {
		expect(quercleSearch.name).toBe("quercle_search");
	});

	it("should have a description", () => {
		expect(quercleSearch.description).toBeDefined();
		expect(typeof quercleSearch.description).toBe("string");
		expect(quercleSearch.description.length).toBeGreaterThan(0);
	});

	it("should have a schema", () => {
		expect(quercleSearch.schema).toBeDefined();
	});

	it("should have an invoke function", () => {
		expect(typeof quercleSearch.invoke).toBe("function");
	});
});

describe("quercleFetch", () => {
	it("should have a name", () => {
		expect(quercleFetch.name).toBe("quercle_fetch");
	});

	it("should have a description", () => {
		expect(quercleFetch.description).toBeDefined();
		expect(typeof quercleFetch.description).toBe("string");
		expect(quercleFetch.description.length).toBeGreaterThan(0);
	});

	it("should have a schema", () => {
		expect(quercleFetch.schema).toBeDefined();
	});

	it("should have an invoke function", () => {
		expect(typeof quercleFetch.invoke).toBe("function");
	});
});

describe("createQuercleTools", () => {
	// All tests use a test API key since QuercleClient requires one
	const testConfig = { apiKey: "qk_test_key" };

	it("should return quercleSearch and quercleFetch tools", () => {
		const tools = createQuercleTools(testConfig);
		expect(tools.quercleSearch).toBeDefined();
		expect(tools.quercleFetch).toBeDefined();
	});

	it("should return tools with correct names", () => {
		const tools = createQuercleTools(testConfig);
		expect(tools.quercleSearch.name).toBe("quercle_search");
		expect(tools.quercleFetch.name).toBe("quercle_fetch");
	});

	it("should return tools with invoke functions", () => {
		const tools = createQuercleTools(testConfig);
		expect(typeof tools.quercleSearch.invoke).toBe("function");
		expect(typeof tools.quercleFetch.invoke).toBe("function");
	});

	it("should return tools with descriptions", () => {
		const tools = createQuercleTools(testConfig);
		expect(tools.quercleSearch.description).toBeDefined();
		expect(tools.quercleFetch.description).toBeDefined();
	});

	it("should return tools with schemas", () => {
		const tools = createQuercleTools(testConfig);
		expect(tools.quercleSearch.schema).toBeDefined();
		expect(tools.quercleFetch.schema).toBeDefined();
	});
});
