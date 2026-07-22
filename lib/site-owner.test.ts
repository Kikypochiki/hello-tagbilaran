import { describe, expect, it } from "vitest";
import { siteOwner, supportProfile } from "@/content/site-owner";
import { validateSiteOwner } from "@/lib/site-owner";

describe("developer and support safeguards", () => {
  it("identifies development placeholders before publication", () => {
    expect(validateSiteOwner(siteOwner, supportProfile)).toContain("Developer profile is still a placeholder.");
    expect(validateSiteOwner(siteOwner, supportProfile)).toContain("Support destination is still a placeholder.");
  });
});
