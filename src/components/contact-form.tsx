"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { captureTracking, contactInputMaxLength, contactKeys, emailAvailabilityMessages, emptyContactValues, isRecord, matchesProductSearch, parsePublicForm, phoneInput, submissionReceipt, validateContactValues, type BoundForm, type ContactKey, type ContactValues, type Receipt } from "@/lib/contact-contract";
import { useEmailAvailability } from "@/lib/use-email-availability";

const labels: Record<ContactKey, string> = { firstName: "First Name", lastName: "Last Name", companyName: "Company", phone: "Contact Number", email: "Email Address", productInterest: "Product Interest", address: "Full Address" };
const placeholders: Record<Exclude<ContactKey, "productInterest">, string> = { firstName: "Enter your first name", lastName: "Enter your last name", companyName: "Enter company name", phone: "9XXXXXXXXX", email: "Enter your email address", address: "Enter your complete address" };

export function ContactForm() {
  const [form, setForm] = useState<BoundForm>();
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [availability, setAvailability] = useState<"loading" | "ready" | "unavailable">("loading");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingFocus, setPendingFocus] = useState<ContactKey>();
  const [touched, setTouched] = useState<Partial<Record<ContactKey, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [website, setWebsite] = useState("");
  const receipt = useRef<Receipt>(undefined);
  const submitting = useRef(false);
  const tracking = useRef<Record<string, string>>({});
  const mounted = useRef(true);
  const formElement = useRef<HTMLFormElement>(null);
  const checked = form ? validateContactValues(form, values) : undefined;
  const emailCheck = useEmailAvailability(values.email, form?.version, Boolean(form && availability === "ready" && values.email.trim() && !checked?.errors[form.mapping.email.id]));

  useEffect(() => {
    if (!pendingFocus || busy || availability !== "ready") return;
    formElement.current?.querySelector<HTMLElement>(`#contact-${pendingFocus}`)?.focus();
    setPendingFocus(undefined);
  }, [pendingFocus, busy, availability]);

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
    setTouched(previous => ({ ...previous, [key]: true }));
    setMessage("");
    if (form) setErrors(previous => { const next = { ...previous }; delete next[form.mapping[key].id]; return next; });
  }

  function blur(key: ContactKey) {
    setTouched(previous => ({ ...previous, [key]: true }));
    if (key === "email") emailCheck.retry();
  }

  function focusFirstError(nextErrors: Record<string, string>) {
    const key = contactKeys.find(key => form && nextErrors[form.mapping[key].id]);
    if (key) setPendingFocus(key);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !checked || availability !== "ready" || submitting.current || accepted) return;
    setAttempted(true); setMessage("");
    if (Object.keys(checked.errors).length) { focusFirstError({ ...errors, ...checked.errors }); return; }
    if (values.email.trim() && !emailCheck.confirm(values.email)) {
      emailCheck.retry(); formElement.current?.querySelector<HTMLElement>("#contact-email")?.focus(); return;
    }
    submitting.current = true; setBusy(true);
    receipt.current = submissionReceipt(receipt.current, { version: form.version, values: checked.values, tracking: form.trackUrlParams ? tracking.current : {}, website });
    try {
      const response = await fetch("/api/contact-form/submissions/", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(receipt.current.payload), signal: AbortSignal.timeout(20_000),
      });
      const result: unknown = await response.json();
      if (!mounted.current) return;
      if (!response.ok || !isRecord(result) || result.success !== true || !isRecord(result.data) || result.data.accepted !== true) {
        if (isRecord(result) && isRecord(result.fieldErrors)) {
          const nextErrors = Object.fromEntries(Object.entries(result.fieldErrors).filter(([id, value]) => contactKeys.some(key => form.mapping[key].id === id) && typeof value === "string")) as Record<string, string>;
          setErrors(previous => ({ ...previous, ...nextErrors }));
          if (nextErrors[form.mapping.email.id] === emailAvailabilityMessages.STAFF_EMAIL_NOT_ALLOWED) emailCheck.reject("STAFF_EMAIL_NOT_ALLOWED");
          focusFirstError(nextErrors);
        }
        if (response.status === 409 && isRecord(result) && typeof result.error === "string" && /form has changed/i.test(result.error)) {
          receipt.current = undefined;
          const refreshed = await load();
          if (refreshed) {
            setSearch("");
            setMessage("This form has changed. Your answers are preserved. Please review your selections and submit again.");
          }
          return;
        }
        if ([404, 410].includes(response.status)) setAvailability("unavailable");
        throw new Error(isRecord(result) && typeof result.error === "string" ? result.error : "Your inquiry has not been confirmed. Please retry.");
      }
      setErrors({}); setAccepted(true); setMessage("Thank you! Your inquiry has been received. We will get back to you shortly.");
    } catch (error) {
      setMessage(error instanceof Error && !["TimeoutError", "AbortError", "SyntaxError", "TypeError"].includes(error.name) ? error.message : "We could not confirm your inquiry. Your answers are preserved. Please retry without changing them.");
    } finally { submitting.current = false; setBusy(false); }
  }

  const blocked = busy || accepted || availability !== "ready";
  const categories = [...new Set((form?.productCatalog?.categories ?? form?.products.map(p => p.category) ?? []).filter(value => value.trim()))].sort();
  const activeCategory = categories.includes(category) ? category : "";
  const products = form?.products.filter(product => !activeCategory || product.category === activeCategory) ?? [];
  for (const id of new Set(values.productInterest)) if (!products.some(product => product.id === id)) products.push(form?.products.find(product => product.id === id) ?? { id, name: "Unavailable product", category: "" });
  const visibleProducts = products.filter(product => matchesProductSearch(search, product.name));
  const required = (key: ContactKey) => form ? Boolean(form.mapping[key].required) : ["firstName", "lastName", "email", "productInterest"].includes(key);
  const error = (key: ContactKey) => form ? (key === "email" ? emailCheck.error : undefined) || ((touched[key] || attempted) ? checked?.errors[form.mapping[key].id] : undefined) || errors[form.mapping[key].id] : undefined;
  const describedBy = (key: ContactKey) => [error(key) ? `contact-${key}-error` : undefined, key === "email" && emailCheck.status === "checking" ? "contact-email-status" : undefined].filter(Boolean).join(" ") || undefined;

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
            <select id="product-category" value={activeCategory} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select>
            <details className="product-picker">
              <summary id="contact-productInterest" aria-labelledby="product-interest-label" aria-describedby={describedBy(key)} aria-invalid={Boolean(error(key))}>{values.productInterest.length ? `${values.productInterest.length} product${values.productInterest.length === 1 ? "" : "s"} selected` : "Select product interests..."}</summary>
              <input className="product-search" type="search" aria-label="Search product interest" placeholder="Search options…" value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === "Enter") event.preventDefault(); }} />
              <div className="product-options" role="group" aria-labelledby="product-interest-label">{visibleProducts.map(product => <label key={product.id}><input type="checkbox" checked={values.productInterest.includes(product.id)} onChange={event => change("productInterest", event.target.checked ? [...values.productInterest, product.id] : values.productInterest.filter(id => id !== product.id))} />{product.name}</label>)}{!visibleProducts.length && <p>{search.trim() ? "No products match your search." : "No products in this category."}</p>}</div>
            </details>
            {values.productInterest.length > 0 && <p className="selection-count">{products.filter(product => values.productInterest.includes(product.id)).map(product => product.name).join(", ")}</p>}
          </> : key === "address" ? <textarea id={`contact-${key}`} value={values[key]} placeholder={placeholders[key]} required={required(key)} maxLength={form ? contactInputMaxLength(form.mapping[key]) : 4000} autoComplete="street-address" aria-invalid={Boolean(error(key))} aria-describedby={describedBy(key)} onChange={event => change(key, event.target.value)} onBlur={() => blur(key)} /> : key === "phone" ? <div className="phone-input" data-invalid={Boolean(error(key))}><span className="phone-prefix" aria-hidden="true">PH (+63)</span><input id={`contact-${key}`} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} pattern="9[0-9]{9}" value={values[key]} placeholder={placeholders[key]} required={required(key)} aria-invalid={Boolean(error(key))} aria-describedby={describedBy(key)} onChange={event => change(key, phoneInput(event.target.value))} onBlur={() => blur(key)} onPaste={event => {
            event.preventDefault();
            const input = event.currentTarget;
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? start;
            change(key, phoneInput(input.value.slice(0, start) + event.clipboardData.getData("text") + input.value.slice(end)));
          }} /></div> : <input id={`contact-${key}`} type={key === "email" ? "email" : "text"} autoComplete={{ firstName: "given-name", lastName: "family-name", companyName: "organization", email: "email" }[key]} value={values[key]} placeholder={placeholders[key]} required={required(key)} maxLength={contactInputMaxLength(form?.mapping[key])} aria-invalid={Boolean(error(key))} aria-describedby={describedBy(key)} onChange={event => change(key, event.target.value)} onBlur={() => blur(key)} />}
          {error(key) && <p id={`contact-${key}-error`} className="field-error">{error(key)}</p>}
          {key === "email" && emailCheck.status === "checking" && <p id="contact-email-status" className="field-status" role="status">Checking email availability…</p>}
          {key === "email" && emailCheck.status === "failed" && <button className="retry-definition" type="button" onClick={emailCheck.retry}>Retry email verification</button>}
        </div>)}
      </div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave empty</label><input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
    </fieldset>
    {availability === "loading" && <p className="form-message" role="status">Loading form...</p>}
    {message && <p className={`form-message ${accepted ? "form-success" : "form-error"}`} role={accepted ? "status" : "alert"}>{message}</p>}
    {availability === "unavailable" && <button className="retry-definition" type="button" disabled={busy} onClick={() => { setMessage(""); void load(); }}>Try loading the form again</button>}
    <div><button className="form-submit" type="submit" disabled={blocked || emailCheck.blocked}>{busy ? "Submitting..." : accepted ? "Submitted" : "Submit"}</button></div>
  </form>;
}
