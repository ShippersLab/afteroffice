import { describe, expect, it } from "vitest";
import { priceToBeat } from "../price-to-beat";

describe("priceToBeat", () => {
  it("is the list price when nobody holds the spot", () => {
    expect(priceToBeat({ listPrice: 100, holderPrice: null }, 25)).toBe(100);
  });

  it("adds the minimum raise to the holder price", () => {
    expect(priceToBeat({ listPrice: 175, holderPrice: 175 }, 25)).toBe(200);
  });
});
