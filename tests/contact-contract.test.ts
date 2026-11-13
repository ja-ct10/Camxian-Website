import { describe, expect, it } from "vitest";
import { captureTracking, emptyContactValues, parsePublicForm, submissionReceipt, validateContactValues } from "../src/lib/contact-contract";
import { definition, productId, secondProductId, validValues } from "./fixtures";

describe("published form contract", () => {
  it("uses mappings rather than assumed field IDs and submits approved product UUIDs", () => {
    const form = parsePublicForm(definition());
    const checked = validateContactValues(form, validValues());
    expect(checked.errors).toEqual({});
    expect(checked.values).toMatchObject({ given: "Alice", family: "O’Connor", mail: "alice@example.com", mobile: "+639123456789", products: [productId] });
    expect(checked.values).not.toHaveProperty("firstName");
  });
  it("requires every website mapping and rejects extra required inputs", () => {
    const missing = definition(); missing.data.fields.pop();
    expect(() => parsePublicForm(missing)).toThrow(/unavailable/);
    const extra = definition(); extra.data.fields.push({ id: "unexpected", type: "single-line", label: "Tax number", required: true, mapToField: "" });
    expect(() => parsePublicForm(extra)).toThrow(/unavailable/);
    extra.data.fields.at(-1)!.required = false;
    expect(() => parsePublicForm(extra)).not.toThrow();
  });
  it("rejects duplicate mappings, invalid IDs and missing product labels", () => {
    const duplicate = definition(); duplicate.data.fields[2].mapToField = "firstName";
    expect(() => parsePublicForm(duplicate)).toThrow();
    const invalid = definition(); invalid.data.fields[0].id = "__proto__";
    expect(() => parsePublicForm(invalid)).toThrow();
    const unlabeled = definition(); unlabeled.data.productCatalog.products = [];
    expect(() => parsePublicForm(unlabeled)).toThrow();
  });
  it("validates empty answers, numbers in names, email, PH phone and unapproved products", () => {
    const form = parsePublicForm(definition());
    expect(Object.keys(validateContactValues(form, emptyContactValues()).errors)).toEqual(["given", "family", "mail", "products"]);
    const invalid = { ...validValues(), firstName: "Alice2", email: "alice@@example.com", phone: "09123456789", productInterest: ["invented"] };
    expect(Object.keys(validateContactValues(form, invalid).errors)).toEqual(["given", "mobile", "mail", "products"]);
    expect(validateContactValues(form, { ...validValues(), phone: "" }).errors).toEqual({});
    expect(validateContactValues(form, { ...validValues(), lastName: "x".repeat(101), address: "\u0000" }).errors).toHaveProperty("family");
  });
  it("matches public name character rules, message precedence and the pre-trim length limit", () => {
    const form = parsePublicForm(definition());
    const base = validValues();
    const given = " Jo\u0301se O‘Neil‑Pérez ";
    expect(validateContactValues(form, { ...base, firstName: given }).values.given).toBe(given.trim());
    expect(validateContactValues(form, { ...base, firstName: "A!2" + "x".repeat(100), lastName: "Ana\u2014María" }).errors).toEqual({ given: "First name must not contain numbers.", family: "Last name must not contain special characters." });
    expect(validateContactValues(form, { ...base, firstName: "A".repeat(100) }).errors).toEqual({});
    expect(validateContactValues(form, { ...base, firstName: "A".repeat(100) + " " }).errors.given).toBe("String must contain at most 100 character(s)");
  });
  it("applies the configured text limits, required flags and control rules", () => {
    const payload = definition(); payload.data.fields[2].required = true;
    const form = parsePublicForm(payload);
    const base = validValues();
    expect(validateContactValues(form, { ...base, companyName: "  ", address: "" }).errors).toEqual({ organization: "Company is required." });
    expect(validateContactValues(form, { ...base, companyName: "Acme\u0000", address: "x".repeat(4001) }).errors).toEqual({ organization: "Control characters are not allowed.", location: "String must contain at most 4000 character(s)" });
    expect(validateContactValues(form, { ...base, companyName: "x".repeat(255), email: "one..two@example.com" }).errors).toEqual({ organization: "String must contain at most 254 character(s)", mail: "Enter a valid email address." });
    expect(validateContactValues(form, { ...base, companyName: "x".repeat(254), address: "  Unit 4\nPasig  " }).values.location).toBe("Unit 4\nPasig");
    expect(validateContactValues(form, { ...base, phone: "8123456789" }).errors.mobile).toBe("Enter 10 digits starting with 9.");
  });
  it("keeps only bounded supported tracking parameters", () => {
    expect(captureTracking("?utm_source=company_website&utm_medium=website&secret=ignored&utm_campaign=" + "x".repeat(201))).toEqual({ utm_source: "company_website", utm_medium: "website" });
  });
});

describe("submission identity", () => {
  const firstId = "20000000-0000-4000-8000-000000000001";
  const nextId = "20000000-0000-4000-8000-000000000002";
  const content = { version: 3, values: { given: "Alice", products: [secondProductId, productId] }, tracking: { utm_source: "website" }, website: "" };
  it("reuses an immutable UUID and payload for unchanged retries", () => {
    const first = submissionReceipt(undefined, content, () => firstId);
    const retry = submissionReceipt(first, { ...content, values: { products: [productId, secondProductId], given: "Alice" } }, () => nextId);
    expect(retry).toBe(first);
    content.values.products.reverse();
    expect(first.payload.values.products).toEqual([productId, secondProductId]);
  });
  it("creates a new UUID for changed answers or published versions", () => {
    const first = submissionReceipt(undefined, content, () => firstId);
    expect(submissionReceipt(first, { ...content, version: 4 }, () => nextId).payload.requestId).toBe(nextId);
    expect(submissionReceipt(first, { ...content, values: { ...content.values, given: "Bob" } }, () => nextId).payload.requestId).toBe(nextId);
  });
});
