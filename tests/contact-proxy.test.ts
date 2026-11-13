import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { forwardContactEmailAvailabilityRequest, forwardContactRequest } from "../src/lib/leadcrm.server";
import { definition, formId } from "./fixtures";

const base = "http://localhost:3000/api/contact-form/";
const request = (body: unknown = { requestId: "20000000-0000-4000-8000-000000000001", version: 3, values: {}, tracking: {}, website: "" }) => new Request(base + "submissions/", { method: "POST", headers: { "Content-Type": "application/json", Cookie: "private=never-forward", Authorization: "never-forward", "X-Forwarded-For": "spoofed" }, body: JSON.stringify(body) });
const upstream = vi.fn<typeof fetch>();
beforeEach(() => { vi.stubEnv("LEADCRM_API_BASE_URL", "https://crm.example.com"); vi.stubEnv("LEADCRM_PUBLIC_FORM_ID", formId); vi.stubGlobal("fetch", upstream); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); upstream.mockReset(); });

describe("same-origin proxy", () => {
  it("fails closed for missing or invalid configuration without contacting any upstream", async () => {
    vi.stubEnv("LEADCRM_PUBLIC_FORM_ID", "");
    expect((await forwardContactRequest(new Request(base))).status).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
    vi.stubEnv("LEADCRM_PUBLIC_FORM_ID", formId);
    vi.stubEnv("LEADCRM_API_BASE_URL", "https://crm.example.com/api/v1");
    expect((await forwardContactRequest(new Request(base))).status).toBe(503);
  });
  it("retrieves the configured form without cache, credentials or redirects", async () => {
    upstream.mockResolvedValueOnce(Response.json(definition()));
    const result = await forwardContactRequest(new Request(base));
    expect(result.status).toBe(200);
    expect(upstream).toHaveBeenCalledWith(`https://crm.example.com/api/v1/public/forms/${formId}`, expect.objectContaining({ method: "GET", cache: "no-store", redirect: "error" }));
    expect(result.headers.get("cache-control")).toBe("no-store");
  });
  it("forwards only the normalized availability query and returns the public result without caching", async () => {
    upstream.mockResolvedValueOnce(Response.json({ success: true, data: { available: false, reason: "STAFF_EMAIL_NOT_ALLOWED", private: "omitted" } }));
    const result = await forwardContactEmailAvailabilityRequest(new Request(base + "email-availability/?email=ANA%2BTEST%40example.com&publicId=ignored", { headers: { Cookie: "private=never-forward", Authorization: "never-forward" } }));
    expect(upstream).toHaveBeenCalledWith(`https://crm.example.com/api/v1/public/forms/${formId}/email-availability?email=ana%2Btest%40example.com`, expect.objectContaining({ method: "GET", headers: { Accept: "application/json" }, cache: "no-store", redirect: "error" }));
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toEqual({ success: true, data: { available: false, reason: "STAFF_EMAIL_NOT_ALLOWED" } });
  });
  it("rejects malformed checks and results and preserves availability rate limits", async () => {
    const check = (query: string) => forwardContactEmailAvailabilityRequest(new Request(base + "email-availability/" + query));
    expect((await check("?email=a%40example.com&email=b%40example.com")).status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
    upstream.mockResolvedValueOnce(Response.json({ success: true, data: { available: false, reason: "unknown" } }));
    expect((await check("?email=a%40example.com")).status).toBe(502);
    upstream.mockResolvedValueOnce(new Response("Slow down", { status: 429, headers: { "Retry-After": "120" } }));
    const limited = await check("?email=a%40example.com");
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("120");
  });
  it("forwards submissions without cookies, authorization or spoofed identity", async () => {
    upstream.mockResolvedValueOnce(Response.json({ success: true, data: { accepted: true, leadId: "private" } }, { status: 201 }));
    const result = await forwardContactRequest(request(), true);
    expect(result.status).toBe(201);
    expect(await result.json()).toEqual({ success: true, data: { accepted: true } });
    expect(upstream.mock.calls[0][1]?.headers).toEqual({ Accept: "application/json", "Content-Type": "application/json" });
  });
  it("preserves validation errors and upstream rate limits", async () => {
    upstream.mockResolvedValueOnce(Response.json({ success: false, error: "Check answers", fieldErrors: { mail: "Email unavailable" } }, { status: 400 }));
    expect(await (await forwardContactRequest(request(), true)).json()).toMatchObject({ fieldErrors: { mail: "Email unavailable" } });
    upstream.mockResolvedValueOnce(Response.json({ success: false, error: "Too many submissions" }, { status: 429, headers: { "Retry-After": "120", "RateLimit-Remaining": "0" } }));
    const result = await forwardContactRequest(request(), true);
    expect(result.status).toBe(429); expect(result.headers.get("retry-after")).toBe("120");
    expect(result.headers.get("ratelimit-remaining")).toBe("0");
  });
  it("rejects oversized bodies, including streams with no Content-Length", async () => {
    const oversized = request({ text: "x".repeat(65_536) });
    expect((await forwardContactRequest(oversized, true)).status).toBe(413);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("rejects cross-origin requests and malformed JSON", async () => {
    const otherOrigin = new Request(base, { method: "POST", headers: { Origin: "https://other.example", "Content-Type": "application/json" }, body: "{}" });
    expect((await forwardContactRequest(otherOrigin, true)).status).toBe(403);
    const malformed = new Request(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    expect((await forwardContactRequest(malformed, true)).status).toBe(400);
  });
  it("accepts the browser host when Next uses an internal request hostname", async () => {
    upstream.mockResolvedValueOnce(Response.json({ success: true, data: { accepted: true } }, { status: 201 }));
    const proxied = new Request("http://localhost:3000/api/contact-form/submissions/", { method: "POST", headers: { Host: "127.0.0.1:3000", Origin: "http://127.0.0.1:3000", "Content-Type": "application/json" }, body: "{}" });
    expect((await forwardContactRequest(proxied, true)).status).toBe(201);
  });
  it("never treats malformed or unconfirmed successful responses as acceptance", async () => {
    upstream.mockResolvedValueOnce(new Response("not JSON"));
    expect((await forwardContactRequest(request(), true)).status).toBe(502);
    upstream.mockResolvedValueOnce(Response.json({ success: true, data: {} }));
    expect((await forwardContactRequest(request(), true)).status).toBe(502);
  });
  it("handles transport failures, timeouts and unavailable forms", async () => {
    upstream.mockRejectedValueOnce(new TypeError("unreachable"));
    expect((await forwardContactRequest(request(), true)).status).toBe(502);
    upstream.mockRejectedValueOnce(new DOMException("Timed out", "TimeoutError"));
    expect((await forwardContactRequest(request(), true)).status).toBe(504);
    upstream.mockResolvedValueOnce(Response.json({ success: false, error: "Form not found" }, { status: 404 }));
    expect((await forwardContactRequest(new Request(base))).status).toBe(404);
  });
});
