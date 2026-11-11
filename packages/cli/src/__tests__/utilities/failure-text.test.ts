import { describe, expect, it } from "vitest";
import { failureText } from "../../utilities/failure-text";

describe("failureText", () => {
  it("names the club url when the network fails", () => {
    expect(failureText("network")).toContain("https://api.afteroffice.club");
    expect(failureText("network")).toContain("AFTEROFFICE_URL");
  });

  it("keeps the reason for other failures", () => {
    expect(failureText("http")).toContain("http");
  });
});
