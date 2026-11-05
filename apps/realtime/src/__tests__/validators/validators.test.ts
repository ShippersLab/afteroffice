import { describe, expect, it } from "vitest";
import { BearerHeaderSchema } from "../../validators/auth";
import { LiveQuerySchema } from "../../validators/live";

describe("BearerHeaderSchema", () => {
  const token = "a".repeat(43);

  it("extracts the token", () => {
    expect(BearerHeaderSchema.parse(`Bearer ${token}`)).toBe(token);
  });

  it("rejects malformed headers", () => {
    expect(BearerHeaderSchema.safeParse(undefined).success).toBe(false);
    expect(BearerHeaderSchema.safeParse("Basic abc").success).toBe(false);
    expect(BearerHeaderSchema.safeParse("Bearer short").success).toBe(false);
  });
});

describe("LiveQuerySchema", () => {
  it("accepts a room id or none", () => {
    expect(LiveQuerySchema.safeParse({ roomId: "floor-3" }).success).toBe(true);
    expect(LiveQuerySchema.safeParse({}).success).toBe(true);
  });

  it("rejects a bad room id", () => {
    expect(LiveQuerySchema.safeParse({ roomId: "lobby" }).success).toBe(false);
  });
});
