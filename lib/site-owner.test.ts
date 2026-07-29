import { describe, expect, it } from "vitest";
import { siteOwner, supportProfile } from "@/content/site-owner";
import { validateSiteOwner } from "@/lib/site-owner";

describe("developer and support safeguards", () => {
  it("accepts the reviewed developer profile and local payment QR", () => {
    const errors = validateSiteOwner(siteOwner, supportProfile);

    expect(errors).not.toContain("Developer profile is still a placeholder.");
    expect(errors).not.toContain("Developer portrait must be a local reviewed asset.");
    expect(errors).not.toContain("Developer links must use HTTPS.");
    expect(errors).not.toContain("Support destination is still a placeholder.");
    expect(errors).not.toContain("Support requires an HTTPS destination or a local reviewed QR asset.");
  });
});
