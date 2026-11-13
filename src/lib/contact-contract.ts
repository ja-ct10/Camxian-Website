/** Standalone adapter for LeadCRM's anonymous public Forms contract.
 * No LeadCRM source or packages are imported into this application. */
export const contactKeys = ["firstName", "lastName", "companyName", "phone", "email", "productInterest", "address"] as const;
export type ContactKey = typeof contactKeys[number];
export type ContactValues = Record<Exclude<ContactKey, "productInterest">, string> & { productInterest: string[] };
export type FormField = { id: string; type: string; label: string; required?: boolean; mapToField?: string; options?: string[]; optionLabels?: Record<string, string> };
export type Product = { id: string; name: string; category: string };
export type PublicForm = { name: string; version: number; fields: FormField[]; trackUrlParams: boolean; productCatalog?: { categories: string[]; products: Product[] } };
export type BoundForm = PublicForm & { mapping: Record<ContactKey, FormField>; products: Product[] };
export type Submission = { requestId: string; version: number; values: Record<string, string | string[]>; tracking: Record<string, string>; website: string };
export type Receipt = { identity: string; payload: Submission };
export const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const controls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/;
const layoutTypes = new Set(["header", "heading", "paragraph", "divider"]);
const compatibleTypes: Record<ContactKey, string[]> = {
  firstName: ["single-line"], lastName: ["single-line"], companyName: ["single-line", "company-name"],
  phone: ["phone", "contact-phone"], email: ["email", "contact-email"], productInterest: ["dropdown"], address: ["single-line", "multi-line"],
};

export function emptyContactValues(): ContactValues {
  return { firstName: "", lastName: "", companyName: "", phone: "", email: "", productInterest: [], address: "" };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parsePublicForm(envelope: unknown): BoundForm {
  const unavailable = () => new Error("The contact form is currently unavailable. Please contact us by phone or email.");
  if (!isRecord(envelope) || envelope.success !== true || !isRecord(envelope.data)) throw unavailable();
  const data = envelope.data;
  if (typeof data.name !== "string" || !Number.isInteger(data.version) || (data.version as number) < 1 || typeof data.trackUrlParams !== "boolean" || !Array.isArray(data.fields) || data.fields.length > 100) throw unavailable();
  const ids = new Set<string>();
  const fields: FormField[] = data.fields.map((field: unknown) => {
    if (!isRecord(field) || typeof field.id !== "string" || !/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(field.id) || ["constructor", "prototype", "toString", "hasOwnProperty"].includes(field.id) || ids.has(field.id) || typeof field.type !== "string" || typeof field.label !== "string") throw unavailable();
    if (field.required !== undefined && typeof field.required !== "boolean") throw unavailable();
    if (field.mapToField !== undefined && typeof field.mapToField !== "string") throw unavailable();
    if (field.options !== undefined && (!Array.isArray(field.options) || !field.options.every(v => typeof v === "string"))) throw unavailable();
    if (field.optionLabels !== undefined && (!isRecord(field.optionLabels) || !Object.values(field.optionLabels).every(v => typeof v === "string"))) throw unavailable();
    ids.add(field.id);
    return field as FormField;
  });
  const mapping = {} as Record<ContactKey, FormField>;
  for (const key of contactKeys) {
    const matches = fields.filter(field => field.mapToField === key);
    if (matches.length !== 1 || !compatibleTypes[key].includes(matches[0].type)) throw unavailable();
    mapping[key] = matches[0];
  }
  if (fields.some(field => field.required && !layoutTypes.has(field.type) && !Object.values(mapping).some(mapped => mapped.id === field.id))) throw unavailable();
  let catalog: PublicForm["productCatalog"];
  if (data.productCatalog !== undefined) {
    const candidate = data.productCatalog;
    if (!isRecord(candidate) || !Array.isArray(candidate.categories) || !candidate.categories.every(c => typeof c === "string") || !Array.isArray(candidate.products) || !candidate.products.every(p => isRecord(p) && typeof p.id === "string" && typeof p.name === "string" && typeof p.category === "string")) throw unavailable();
    catalog = candidate as PublicForm["productCatalog"];
  }
  const products = (mapping.productInterest.options ?? []).map(id => {
    if (!uuidPattern.test(id)) throw unavailable();
    const product = catalog?.products.find(product => product.id === id);
    const name = product?.name || mapping.productInterest.optionLabels?.[id];
    if (!name) throw unavailable();
    return { id, name, category: product?.category ?? "" };
  });
  if (!products.length) throw unavailable();
  return { name: data.name, version: data.version as number, fields, trackUrlParams: data.trackUrlParams, productCatalog: catalog, mapping, products };
}

export function validateContactValues(form: BoundForm, input: ContactValues) {
  const errors: Record<string, string> = {};
  const values: Record<string, string | string[]> = {};
  for (const key of contactKeys) {
    const field = form.mapping[key];
    if (key === "productInterest") {
      const selected = [...new Set(input.productInterest)].sort();
      if ((field.required && !selected.length) || selected.some(id => !form.products.some(p => p.id === id))) errors[field.id] = "Select approved product interests.";
      values[field.id] = selected;
      continue;
    }
    const raw = input[key];
    let value = raw.trim();
    const max = key === "firstName" || key === "lastName" ? 100 : field.type === "multi-line" ? 4000 : 254;
    if (raw.length > max) errors[field.id] = `Use ${max} characters or fewer.`;
    else if (controls.test(raw)) errors[field.id] = "Control characters are not allowed.";
    else if (!value && field.required) errors[field.id] = `${field.label} is required.`;
    else if (value && (key === "firstName" || key === "lastName") && /[0-9]/.test(value)) errors[field.id] = "Names cannot contain numbers.";
    else if (value && key === "email") {
      value = value.toLowerCase();
      if (!/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i.test(value)) errors[field.id] = "Enter a valid email address.";
    } else if (value && key === "phone") {
      if (raw.length > 32 || /[\u0000-\u001f\u007f-\u009f]/.test(raw) || !/^(?:\+63)?9\d{9}$/.test(value)) errors[field.id] = "Enter 10 digits starting with 9.";
      else if (!value.startsWith("+63")) value = `+63${value}`;
    }
    values[field.id] = value;
  }
  return { values, errors };
}

export function captureTracking(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  return Object.fromEntries(trackingKeys.flatMap(key => {
    const value = params.get(key)?.trim();
    return value && value.length <= 200 && !controls.test(value) ? [[key, value]] : [];
  }));
}

export function submissionReceipt(previous: Receipt | undefined, data: Omit<Submission, "requestId">, randomUUID = () => crypto.randomUUID()): Receipt {
  const values = Object.fromEntries(Object.keys(data.values).sort().map(key => [key, Array.isArray(data.values[key]) ? [...data.values[key] as string[]].sort() : data.values[key]]));
  const tracking = Object.fromEntries(Object.keys(data.tracking).sort().map(key => [key, data.tracking[key]]));
  const identity = JSON.stringify({ ...data, values, tracking });
  return previous?.identity === identity ? previous : { identity, payload: { ...JSON.parse(identity), requestId: randomUUID() } as Submission };
}
