import { isRecord, parsePublicForm, uuidPattern } from "./contact-contract";

const maxBodyBytes = 64 * 1024;
const timeoutMs = 15_000;
const safeHeaders = ["retry-after", "ratelimit", "ratelimit-policy", "ratelimit-limit", "ratelimit-remaining", "ratelimit-reset", "x-ratelimit-limit", "x-ratelimit-remaining", "x-ratelimit-reset"];
const unavailable = "The contact form is currently unavailable. Please contact us by phone or email.";

function reply(data: unknown, status = 200, upstream?: Response) {
  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store" });
  if (upstream) for (const name of safeHeaders) { const value = upstream.headers.get(name); if (value) headers.set(name, value); }
  return new Response(JSON.stringify(data), { status, headers });
}

function configuration(): { origin: string; publicId: string } | undefined {
  try {
    const publicId = process.env.LEADCRM_PUBLIC_FORM_ID?.trim();
    const url = new URL(process.env.LEADCRM_API_BASE_URL?.trim() ?? "");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (!publicId || !uuidPattern.test(publicId) || (url.protocol !== "https:" && !(url.protocol === "http:" && local)) || url.pathname !== "/" || url.search || url.hash || url.username || url.password) return;
    return { origin: url.origin, publicId };
  } catch { return; }
}

async function boundedBody(request: Request): Promise<string | Response> {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) return reply({ success: false, error: "The submission is too large." }, 413);
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) { await reader.cancel(); return reply({ success: false, error: "The submission is too large." }, 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}

export async function forwardContactRequest(request: Request, submission = false): Promise<Response> {
  const config = configuration();
  if (!config) return reply({ success: false, error: unavailable }, 503);
  let body: string | undefined;
  if (submission) {
    const origin = request.headers.get("origin");
    if (origin) {
      // Next.js may use an internal hostname/protocol in request.url behind a
      // reverse proxy. Host identifies the website the browser actually opened.
      try {
        if (new URL(origin).host !== (request.headers.get("host") ?? new URL(request.url).host)) return reply({ success: false, error: "Please submit this form from the website." }, 403);
      } catch { return reply({ success: false, error: "Please submit this form from the website." }, 403); }
    }
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") ?? "")) return reply({ success: false, error: "Use a JSON submission." }, 415);
    try {
      const result = await boundedBody(request);
      if (result instanceof Response) return result;
      const parsed: unknown = JSON.parse(result);
      if (!isRecord(parsed)) throw new Error("Invalid submission");
      body = JSON.stringify(parsed);
    } catch { return reply({ success: false, error: "The submission could not be read." }, 400); }
  }
  try {
    const upstream = await fetch(`${config.origin}/api/v1/public/forms/${encodeURIComponent(config.publicId)}${submission ? "/submissions" : ""}`, {
      method: submission ? "POST" : "GET", headers: { Accept: "application/json", ...(submission ? { "Content-Type": "application/json" } : {}) },
      body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(timeoutMs),
    });
    let data: unknown;
    try { data = await upstream.json(); } catch { return reply({ success: false, error: "The contact service returned an invalid response. Please retry." }, 502); }
    if (!upstream.ok) {
      const error = isRecord(data) && typeof data.error === "string" ? data.error : upstream.status === 429 ? "Too many submissions. Please try again later." : "Unable to submit your inquiry. Please retry.";
      const fieldErrors = isRecord(data) && isRecord(data.fieldErrors) ? Object.fromEntries(Object.entries(data.fieldErrors).filter(([, value]) => typeof value === "string")) : undefined;
      return reply({ success: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, upstream.status, upstream);
    }
    if (!isRecord(data) || data.success !== true || !isRecord(data.data)) return reply({ success: false, error: "The contact service returned an invalid response. Please retry." }, 502);
    if (submission) {
      if (data.data.accepted !== true) return reply({ success: false, error: "Your inquiry has not been confirmed. Please retry." }, 502);
      return reply({ success: true, data: { accepted: true } }, upstream.status, upstream);
    }
    try { parsePublicForm(data); } catch { return reply({ success: false, error: unavailable }, 503); }
    return reply(data, upstream.status, upstream);
  } catch (error) {
    const timeout = error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name);
    return reply({ success: false, error: timeout ? "The contact service took too long to respond. Please retry your unchanged inquiry." : "Unable to reach the contact service. Please retry your unchanged inquiry." }, timeout ? 504 : 502);
  }
}
