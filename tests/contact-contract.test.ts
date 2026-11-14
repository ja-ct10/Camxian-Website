import { describe, expect, it } from "vitest";
import { captureTracking, contactInputMaxLength, emptyContactValues, parsePublicForm, submissionReceipt, validateContactValues } from "../src/lib/contact-contract";
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
  it.each([["firstName", "given", "First name"], ["lastName", "family", "Last name"]] as const)("matches LeadCRM's allowed characters and combined error for %s", (key, id, label) => {
    const form = parsePublicForm(definition());
    const base = validValues();
    for (const value of ["Juan", "Dela Cruz", "O'Connor", "O’Connor", "Anne-Marie", "Anne‐Marie", "José", "María", "李", " Jo\u0301se O‘Neil‑Pérez "]) {
      const checked = validateContactValues(form, { ...base, [key]: value });
      expect(checked.errors, value).toEqual({});
      expect(checked.values[id]).toBe(value.trim());
    }
    const message = `${label} must not contain numbers or special characters such as @, #, $, %, &, *, !, _, +, =, /, ?, ., or ().`;
    for (const value of ["John123", "Juan@", "Maria#", "Smith123!", "John_Doe", "John١", "John²", "A!2" + "x".repeat(100), ...["$", "%", "&", "*", "!", "+", "=", "/", "?", ".", "(", ")", "—", "😀", "\t", "\n", "\u0000"].map(symbol => `John${symbol}`)]) {
      expect(validateContactValues(form, { ...base, [key]: value }).errors, value).toEqual({ [id]: message });
    }
  });
  it.each([
    ["firstName", "First name", 100], ["lastName", "Last name", 100],
    ["companyName", "Company name", 255], ["address", "Full address", 500],
  ] as const)("validates the trimmed %s boundary without modifying the draft", (key, label, max) => {
    const form = parsePublicForm(definition());
    const field = form.mapping[key];
    expect(contactInputMaxLength(field)).toBe(max);
    for (const value of ["A".repeat(max), `  ${"A".repeat(max)}  `]) {
      const input = { ...validValues(), [key]: value };
      const checked = validateContactValues(form, input);
      expect(checked.errors).toEqual({});
      expect(checked.values[field.id]).toBe("A".repeat(max));
      expect(input[key]).toBe(value);
    }
    expect(validateContactValues(form, { ...validValues(), [key]: ` ${"A".repeat(max + 1)} ` }).errors).toEqual({ [field.id]: `${label} must not exceed ${max} characters.` });
  });
  it("uses mapped limits for compatible company, email and address field types", () => {
    const payload = definition();
    payload.data.fields[2].type = "company-name";
    payload.data.fields[4].type = "contact-email";
    payload.data.fields[6].type = "single-line";
    const form = parsePublicForm(payload);
    expect(validateContactValues(form, { ...validValues(), companyName: "x".repeat(255), address: "x".repeat(500) }).errors).toEqual({});
    expect(validateContactValues(form, { ...validValues(), companyName: "x".repeat(256), address: "x".repeat(501) }).errors).toEqual({ organization: "Company name must not exceed 255 characters.", location: "Full address must not exceed 500 characters." });
  });
  it("preserves public email domains, normalization, format checks and the pre-trim limit", () => {
    const form = parsePublicForm(definition());
    for (const domain of ["gmail.com", "yahoo.com", "outlook.com", "company.com"]) {
      const checked = validateContactValues(form, { ...validValues(), email: ` CUSTOMER@${domain.toUpperCase()} ` });
      expect(checked.errors).toEqual({});
      expect(checked.values.mail).toBe(`customer@${domain}`);
    }
    const email = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`;
    expect(email).toHaveLength(254);
    expect(contactInputMaxLength(form.mapping.email)).toBe(254);
    expect(validateContactValues(form, { ...validValues(), email }).errors).toEqual({});
    for (const value of [email + "d", email + " "]) {
      expect(validateContactValues(form, { ...validValues(), email: value }).errors).toEqual({ mail: "Email address must not exceed 254 characters." });
    }
    for (const value of ["alice@@example.com", "alice", "alice@example", ".alice@example.com", "one..two@example.com"]) {
      expect(validateContactValues(form, { ...validValues(), email: value }).errors).toEqual({ mail: "Enter a valid email address." });
    }
  });
  it("applies the configured text limits, required flags and control rules", () => {
    const payload = definition(); payload.data.fields[2].required = true;
    const form = parsePublicForm(payload);
    const base = validValues();
    expect(validateContactValues(form, { ...base, companyName: "  ", address: "" }).errors).toEqual({ organization: "Company is required." });
    expect(validateContactValues(form, { ...base, companyName: "Acme\u0000", address: "x".repeat(501) }).errors).toEqual({ organization: "Control characters are not allowed.", location: "Full address must not exceed 500 characters." });
    expect(validateContactValues(form, { ...base, companyName: "x".repeat(255), email: "one..two@example.com" }).errors).toEqual({ mail: "Enter a valid email address." });
    expect(validateContactValues(form, { ...base, companyName: "x".repeat(255), address: "  Unit 4\nPasig  " }).values.location).toBe("Unit 4\nPasig");
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
