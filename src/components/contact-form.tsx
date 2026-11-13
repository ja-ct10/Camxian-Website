"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { captureTracking, contactKeys, emptyContactValues, isRecord, parsePublicForm, submissionReceipt, validateContactValues, type BoundForm, type ContactKey, type ContactValues, type Receipt } from "@/lib/contact-contract";

const labels: Record<ContactKey, string> = { firstName: "First Name", lastName: "Last Name", companyName: "Company", phone: "Contact Number", email: "Email Address", productInterest: "Product Interest", address: "Full Address" };
const placeholders: Record<Exclude<ContactKey, "productInterest">, string> = { firstName: "Enter your first name", lastName: "Enter your last name", companyName: "Enter company name", phone: "9XXXXXXXXX", email: "Enter your email address", address: "Enter your complete address" };

export function ContactForm() {
  const [form, setForm] = useState<BoundForm>();
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [availability, setAvailability] = useState<"loading" | "ready" | "unavailable">("loading");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const receipt = useRef<Receipt>(undefined);
  const submitting = useRef(false);
  const tracking = useRef<Record<string, string>>({});
  const mounted = useRef(true);
  const formElement = useRef<HTMLFormElement>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setAvailability("loading");
    try {
      const response = await fetch("/api/contact-form/", { cache: "no-store", signal: signal ?? AbortSignal.timeout(20_000) });
      const result: unknown = await response.json();
      if (!response.ok) throw new Error(isRecord(result) && typeof result.error === "string" ? result.error : "The contact form is currently unavailable. Please contact us by phone or email.");
      const definition = parsePublicForm(result);
      if (!mounted.current || (signal?.aborted && signal.reason?.name !== "TimeoutError")) return;
      setForm(definition); setAvailability("ready");
      return definition;
    } catch (error) {
      if (!mounted.current || (signal?.aborted && signal.reason?.name !== "TimeoutError")) return;
      setAvailability("unavailable");
      setMessage(error instanceof Error && error.name !== "TimeoutError" ? error.message : "The contact form could not be loaded. Please try again.");
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    tracking.current = captureTracking(window.location.search);
    const controller = new AbortController();
    void load(AbortSignal.any([controller.signal, AbortSignal.timeout(20_000)]));
    return () => { mounted.current = false; controller.abort(); };
  }, [load]);

  function change<K extends ContactKey>(key: K, value: ContactValues[K]) {
    setValues(previous => ({ ...previous, [key]: value }));
    receipt.current = undefined;
    setMessage("");
    if (form) setErrors(previous => { const next = { ...previous }; delete next[form.mapping[key].id]; return next; });
  }

  function focusFirstError(nextErrors: Record<string, string>) {
    const key = contactKeys.find(key => form && nextErrors[form.mapping[key].id]);
    if (key) formElement.current?.querySelector<HTMLElement>(`#contact-${key}`)?.focus();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || availability !== "ready" || submitting.current || accepted) return;
    const checked = validateContactValues(form, values);
    setErrors(checked.errors); setMessage("");
    if (Object.keys(checked.errors).length) { focusFirstError(checked.errors); return; }
    submitting.current = true; setBusy(true);
    receipt.current = submissionReceipt(receipt.current, { version: form.version, values: checked.values, tracking: form.trackUrlParams ? tracking.current : {}, website });
    try {
      const response = await fetch("/api/contact-form/submissions/", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(receipt.current.payload), signal: AbortSignal.timeout(20_000),
      });
      const result: unknown = await response.json();
      if (!response.ok || !isRecord(result) || result.success !== true || !isRecord(result.data) || result.data.accepted !== true) {
        if (isRecord(result) && isRecord(result.fieldErrors)) {
          const nextErrors = Object.fromEntries(Object.entries(result.fieldErrors).filter(([, value]) => typeof value === "string")) as Record<string, string>;
          setErrors(nextErrors); focusFirstError(nextErrors);
        }
        if (response.status === 409 && isRecord(result) && typeof result.error === "string" && /form has changed/i.test(result.error)) {
          receipt.current = undefined;
          const refreshed = await load();
          if (refreshed) setMessage("This form has changed. Your answers are preserved. Please review your selections and submit again.");
          return;
        }
        if ([404, 410, 503].includes(response.status)) setAvailability("unavailable");
        throw new Error(isRecord(result) && typeof result.error === "string" ? result.error : "Your inquiry has not been confirmed. Please retry.");
      }
      setAccepted(true); setMessage("Thank you! Your inquiry has been received. We will get back to you shortly.");
    } catch (error) {
      setMessage(error instanceof Error && !["TimeoutError", "AbortError", "SyntaxError", "TypeError"].includes(error.name) ? error.message : "We could not confirm your inquiry. Your answers are preserved. Please retry without changing them.");
    } finally { submitting.current = false; setBusy(false); }
  }

  const blocked = busy || accepted || availability !== "ready";
  const products = form?.products.filter(product => !category || product.category === category) ?? [];
  const categories = [...new Set([...(form?.productCatalog?.categories ?? []), ...(form?.products.map(p => p.category).filter(Boolean) ?? [])])];
  const required = (key: ContactKey) => form ? Boolean(form.mapping[key].required) : ["firstName", "lastName", "email", "productInterest"].includes(key);
  const error = (key: ContactKey) => form ? errors[form.mapping[key].id] : undefined;
  const describedBy = (key: ContactKey) => error(key) ? `contact-${key}-error` : undefined;

  return <form ref={formElement} className="contact-form" onSubmit={submit} noValidate aria-busy={busy || availability === "loading"}>
    <input type="hidden" name="requestId" value={receipt.current?.payload.requestId ?? ""} />
    <input type="hidden" name="version" value={form?.version ?? ""} />
    <h2>Contact Us</h2>
    <fieldset disabled={blocked}>
      <div className="contact-form-grid">
        {contactKeys.map(key => <div key={key} className={`form-field ${["email", "productInterest", "address"].includes(key) ? "full" : ""}`}>
          {key === "productInterest" ? <div className="field-label" id="product-interest-label">{labels[key]}{required(key) && <span className="required" aria-hidden="true">*</span>}</div> : <label htmlFor={`contact-${key}`}>{labels[key]}{required(key) && <span className="required" aria-hidden="true">*</span>}</label>}
          {key === "productInterest" ? <>
            <label className="product-category-label" htmlFor="product-category">Product category</label>
            <select id="product-category" value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select>
            <details className="product-picker">
              <summary id="contact-productInterest" aria-labelledby="product-interest-label" aria-describedby={describedBy(key)} aria-invalid={Boolean(error(key))}>{values.productInterest.length ? `${values.productInterest.length} product${values.productInterest.length === 1 ? "" : "s"} selected` : "Select product interests..."}</summary>
              <div className="product-options" role="group" aria-labelledby="product-interest-label">{products.map(product => <label key={product.id}><input type="checkbox" checked={values.productInterest.includes(product.id)} onChange={event => change("productInterest", event.target.checked ? [...values.productInterest, product.id] : values.productInterest.filter(id => id !== product.id))} />{product.name}</label>)}{!products.length && <p>No products in this category.</p>}</div>
            </details>
            {values.productInterest.length > 0 && <p className="selection-count">{form?.products.filter(product => values.productInterest.includes(product.id)).map(product => product.name).join(", ")}</p>}
          </> : key === "address" ? <textarea id={`contact-${key}`} value={values[key]} placeholder={placeholders[key]} required={required(key)} autoComplete="street-address" aria-invalid={Boolean(error(key))} aria-describedby={describedBy(key)} onChange={event => change(key, event.target.value)} /> : key === "phone" ? <div className="phone-input"><span className="phone-prefix" aria-hidden="true">PH (+63)</span><input id={`contact-${key}`} type="tel" inputMode="tel" autoComplete="tel-national" value={values[key]} placeholder={placeholders[key]} required={required(key)} aria-invalid={Boolean(error(key))} aria-describedby={describedBy(key)} onChange={event => change(key, event.target.value)} /></div> : <input id={`contact-${key}`} type={key === "email" ? "email" : "text"} autoComplete={{ firstName: "given-name", lastName: "family-name", companyName: "organization", email: "email" }[key]} value={values[key]} placeholder={placeholders[key]} required={required(key)} aria-invalid={Boolean(error(key))} aria-describedby={describedBy(key)} onChange={event => change(key, event.target.value)} />}
          {error(key) && <p id={`contact-${key}-error`} className="field-error">{error(key)}</p>}
        </div>)}
      </div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave empty</label><input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => { setWebsite(event.target.value); receipt.current = undefined; }} /></div>
    </fieldset>
    {availability === "loading" && <p className="form-message" role="status">Loading form...</p>}
    {message && <p className={`form-message ${accepted ? "form-success" : "form-error"}`} role={accepted ? "status" : "alert"}>{message}</p>}
    {availability === "unavailable" && <button className="retry-definition" type="button" disabled={busy} onClick={() => { setMessage(""); void load(); }}>Try loading the form again</button>}
    <div><button className="form-submit" type="submit" disabled={blocked}>{busy ? "Submitting..." : accepted ? "Submitted" : "Submit"}</button></div>
  </form>;
}
