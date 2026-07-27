import { describe, expect, it } from "vitest";
import { demoLines, proposals } from "./demo-data";

describe("public comparison seed", () => {
  it("keeps the verified 76.34㎡ totals", () => {
    expect(proposals.aes.total).toBeCloseTo(108091.57, 2);
    expect(proposals.a5s.total).toBeCloseTo(123405.19, 2);
    expect(proposals.a5s.total - proposals.aes.total).toBeCloseTo(15313.62, 2);
  });

  it("contains every manually verified configuration row", () => {
    expect(demoLines).toHaveLength(33);
    expect(demoLines.filter((line) => line.note !== "相同").length).toBeGreaterThan(0);
  });
});
