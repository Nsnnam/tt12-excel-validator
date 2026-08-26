import { describe, expect, it } from "vitest";
import { DOCUMENT_LIBRARY } from "./reference";

describe("DOCUMENT_LIBRARY", () => {
  it("có ID duy nhất để dùng ổn định làm khóa React", () => {
    expect(new Set(DOCUMENT_LIBRARY.map((document) => document.id)).size).toBe(DOCUMENT_LIBRARY.length);
  });
});
