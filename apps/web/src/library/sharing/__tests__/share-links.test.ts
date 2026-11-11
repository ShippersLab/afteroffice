import { describe, expect, it } from "vitest";
import { SHARE } from "../../../content/share";
import { xIntentUrl } from "../share-links";

describe("share links", () => {
  it("builds an x intent with prefilled text and url", () => {
    const link = new URL(xIntentUrl("hello there", "https://afteroffice.club/"));
    expect(link.origin).toBe("https://x.com");
    expect(link.searchParams.get("text")).toBe("hello there");
    expect(link.searchParams.get("url")).toBe("https://afteroffice.club/");
  });

  it("keeps the share copy clean and names the handle and the site", () => {
    const text = SHARE.spotted("sleepy-otter-42", "dancing on the floor");
    expect(text).toContain("sleepy-otter-42");
    expect(text).toContain("afteroffice.club");
    expect(text).not.toContain("\u2014");
    expect(text).not.toContain("!");
  });
});
