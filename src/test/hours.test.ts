import { describe, it, expect } from "vitest";
import { isOpenNow } from "@/lib/hours";
describe("opening hours (2 PM – 12 AM Baghdad)", () => {
  it("is closed at 1:59 PM Baghdad", () => expect(isOpenNow(new Date("2026-11-06T10:59:00Z"))).toBe(false));
  it("is open at 2:00 PM Baghdad", () => expect(isOpenNow(new Date("2026-11-06T11:00:00Z"))).toBe(true));
  it("is open at 11:59 PM Baghdad", () => expect(isOpenNow(new Date("2026-11-06T20:59:00Z"))).toBe(true));
  it("is closed at midnight Baghdad", () => expect(isOpenNow(new Date("2026-11-06T21:00:00Z"))).toBe(false));
});
