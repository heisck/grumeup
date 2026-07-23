import { describe, expect, it } from "vitest";
import { makeQueryClient } from "./query-client";

describe("QueryClient Factory", () => {
  it("should create a valid QueryClient instance with defaults", () => {
    const client = makeQueryClient();
    expect(client).toBeDefined();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(60 * 1000);
  });
});
