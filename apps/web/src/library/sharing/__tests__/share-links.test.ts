import { describe, expect, it } from "vitest";
import { SHARE } from "../../../content/profile";
import { profileUrl, xIntentUrl } from "../share-links";

describe("share links", () => {
  it("builds the profile url", () => {
    expect(profileUrl("sleepy-otter-42")).toBe("https://afteroffice.club/@sleepy-otter-42");
  });

  it("builds an x intent with prefilled text and url", () => {
    const link = new URL(xIntentUrl("hello there", "https://afteroffice.club/@a-b"));
    expect(link.origin).toBe("https://x.com");
    expect(link.searchParams.get("text")).toBe("hello there");
    expect(link.searchParams.get("url")).toBe("https://afteroffice.club/@a-b");
  });

  it("keeps the share copy clean", () => {
    const text = `${SHARE.profile("sleepy-otter-42")}${SHARE.spotted("sleepy-otter-42", "dancing")}`;
    expect(text).not.toContain("—");
    expect(text).not.toContain("!");
  });
});
