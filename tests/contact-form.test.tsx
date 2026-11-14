// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "../src/components/contact-form";
import { definition, secondProductId } from "./fixtures";
import { emailAvailabilityMessages, type Submission } from "../src/lib/contact-contract";

const network = vi.fn<typeof fetch>();
beforeEach(() => { vi.stubGlobal("fetch", network); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); network.mockReset(); });

const available = () => Response.json({ success: true, data: { available: true } });
function routes(post: () => Response | Promise<Response>, get = () => Response.json(definition())) {
  network.mockImplementation(async (url) => {
    if (String(url).includes("/email-availability/")) return available();
    return String(url).endsWith("/submissions/") ? post() : get();
  });
}
const submissions = () => network.mock.calls.filter(([url]) => String(url).endsWith("/submissions/"));
const requests = () => submissions().map(([, options]) => JSON.parse(options?.body as string) as Submission);
const submitButton = () => screen.getByRole("button", { name: "Submit" });
const email = () => screen.getByLabelText(/Email Address/);
const verified = () => waitFor(() => expect(submitButton()).toBeEnabled());
const invalidName = "must not contain numbers or special characters such as @, #, $, %, &, *, !, _, +, =, /, ?, ., or ().";

async function ready() {
  render(<ContactForm />);
  await waitFor(() => expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled());
}
function fillValid() {
  fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: "Alice" } });
  fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: "Example" } });
  fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: "alice@example.com" } });
  fireEvent.click(screen.getByLabelText("CCTV"));
}

describe("Contact form", () => {
  it("shows loading and fails closed when the definition is unavailable", async () => {
    network.mockResolvedValueOnce(Response.json({ success: false, error: "Form unavailable" }, { status: 503 }));
    render(<ContactForm />);
    expect(screen.getByText("Loading form...")).toBeInTheDocument();
    await screen.findByRole("alert");
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Try loading the form again" })).toBeEnabled();
  });
  it("displays required validation beside the fields without sending an inquiry", async () => {
    network.mockResolvedValueOnce(Response.json(definition()));
    await ready(); fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText("First Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Product Interest is required.")).toBeInTheDocument();
    expect(network).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/First Name/)).toHaveFocus();
  });
  it("validates on blur and change, and clears only the corrected error", async () => {
    network.mockResolvedValueOnce(Response.json(definition()));
    await ready();
    const first = screen.getByLabelText(/First Name/), last = screen.getByLabelText(/Last Name/);
    fireEvent.blur(first);
    expect(first).toHaveAccessibleDescription("First Name is required.");
    fireEvent.change(first, { target: { value: "Ana2!" } });
    fireEvent.change(last, { target: { value: "O/Brien" } });
    expect(first).toHaveAccessibleDescription(`First name ${invalidName}`);
    expect(last).toHaveAccessibleDescription(`Last name ${invalidName}`);
    fireEvent.change(first, { target: { value: "Ana-María" } });
    expect(first).toHaveAttribute("aria-invalid", "false");
    expect(last).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(email(), { target: { value: "alice@@example.com" } });
    expect(email()).toHaveAccessibleDescription("Enter a valid email address.");
    expect(network).toHaveBeenCalledTimes(1);
  });
  it.each([
    ["First Name", "First name", "given", "A".repeat(100)],
    ["Last Name", "Last name", "family", "A".repeat(100)],
    ["Company", "Company name", "organization", "A".repeat(255)],
    ["Full Address", "Full address", "location", "A".repeat(500)],
    ["Email Address", "Email address", "mail", `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`],
  ])("keeps overlong %s text, shows its inline error immediately, and submits only after correction", async (label, errorLabel, id, valid) => {
    routes(() => Response.json({ success: true, data: { accepted: true } }, { status: 201 }));
    await ready(); fillValid(); await verified();
    const input = screen.getByLabelText(new RegExp(label));
    expect(input).not.toHaveAttribute("maxlength");
    fireEvent.change(input, { target: { value: valid } });
    expect(input).toHaveAttribute("aria-invalid", "false");
    fireEvent.change(input, { target: { value: valid + "A" } });
    expect(input).toHaveValue(valid + "A");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(`${errorLabel} must not exceed ${valid.length} characters.`);
    expect(document.getElementById(input.getAttribute("aria-describedby")!)).toHaveClass("field-error");
    fireEvent.submit(submitButton().closest("form")!);
    expect(submissions()).toHaveLength(0);
    fireEvent.change(input, { target: { value: valid } });
    expect(input).toHaveValue(valid);
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByText(`${errorLabel} must not exceed ${valid.length} characters.`)).not.toBeInTheDocument();
    await verified(); fireEvent.click(submitButton());
    await screen.findByText("Thank you! Your inquiry has been received. We will get back to you shortly.");
    expect(requests()).toHaveLength(1);
    expect(requests()[0].values[id]).toBe(valid);
  });
  it("preserves outer spaces in drafts while validating trimmed mapped text", async () => {
    network.mockResolvedValueOnce(Response.json(definition()));
    await ready();
    for (const [label, max] of [["First Name", 100], ["Last Name", 100], ["Company", 255], ["Full Address", 500]] as const) {
      const input = screen.getByLabelText(new RegExp(label));
      const value = `  ${"A".repeat(max)}  `;
      fireEvent.change(input, { target: { value } });
      expect(input).toHaveValue(value);
      expect(input).toHaveAttribute("aria-invalid", "false");
    }
    expect(network).toHaveBeenCalledTimes(1);
  });
  it.each(["gmail.com", "yahoo.com", "outlook.com", "company.com"])("verifies and submits a public %s email with tracking and published field IDs", async domain => {
    window.history.replaceState({}, "", "/?utm_source=company_website&utm_medium=website&secret=ignored");
    try {
      const published = definition();
      published.data.fields.forEach((field, i) => { field.id = `published_${i}`; });
      routes(() => Response.json({ success: true, data: { accepted: true } }), () => Response.json(published));
      await ready(); fillValid();
      fireEvent.change(email(), { target: { value: ` CUSTOMER@${domain.toUpperCase()} ` } });
      await verified();
      expect(network.mock.calls.some(([url]) => String(url).includes(`?email=customer%40${domain}`))).toBe(true);
      fireEvent.click(submitButton());
      await screen.findByText(/Thank you!/);
      expect(requests()[0]).toMatchObject({ version: 3, tracking: { utm_source: "company_website", utm_medium: "website" }, values: { published_0: "Alice", published_1: "Example", published_4: `customer@${domain}` } });
      expect(Object.keys(requests()[0].values).sort()).toEqual(published.data.fields.map(field => field.id).sort());
    } finally { window.history.replaceState({}, "", "/"); }
  });
  it("skips availability checks for malformed or overlong emails and verifies corrected input", async () => {
    routes(() => Response.json({ success: true, data: { accepted: true } }));
    await ready(); vi.useFakeTimers();
    for (const value of ["alice@@example.com", "x".repeat(255)]) {
      fireEvent.change(email(), { target: { value } });
      expect(email()).toHaveAttribute("aria-invalid", "true");
      await act(async () => { await vi.advanceTimersByTimeAsync(700); });
      fireEvent.submit(submitButton().closest("form")!);
      expect(network).toHaveBeenCalledTimes(1);
    }
    fireEvent.change(email(), { target: { value: "customer@company.com" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(email()).toHaveAttribute("aria-invalid", "false");
    expect(network).toHaveBeenCalledTimes(2);
    expect(submitButton()).toBeEnabled();
  });
  it.each(Object.entries(emailAvailabilityMessages))("keeps the public %s availability rejection visible and blocks submission", async (reason, message) => {
    network.mockResolvedValueOnce(Response.json(definition()))
      .mockResolvedValueOnce(Response.json({ success: true, data: { available: false, reason } }));
    await ready(); vi.useFakeTimers(); fillValid();
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(email()).toHaveAccessibleDescription(message);
    expect(email()).toHaveAttribute("aria-invalid", "true");
    expect(submitButton()).toBeDisabled();
    fireEvent.submit(submitButton().closest("form")!);
    expect(submissions()).toHaveLength(0);
  });
  it("filters and searches products while keeping selections removable across categories", async () => {
    network.mockResolvedValueOnce(Response.json(definition()));
    await ready(); fillValid();
    fireEvent.change(screen.getByLabelText("Product category"), { target: { value: "Telecom" } });
    expect(screen.getByLabelText("CCTV")).toBeChecked();
    expect(screen.getByLabelText("Internet")).toBeInTheDocument();
    expect(screen.getByText("CCTV", { selector: ".selection-count" })).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Internet"));
    expect(screen.getByText("2 products selected")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search product interest"), { target: { value: "NET int" } });
    expect(screen.queryByLabelText("CCTV")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Internet")).toBeChecked();
    fireEvent.change(screen.getByLabelText("Search product interest"), { target: { value: "" } });
    fireEvent.click(screen.getByLabelText("CCTV"));
    expect(screen.getByText("1 product selected")).toBeInTheDocument();
  });
  it("cleans typed and pasted phone input and posts a normalized Philippine number", async () => {
    routes(() => Response.json({ success: true, data: { accepted: true } }, { status: 201 }));
    await ready(); fillValid();
    const phone = screen.getByLabelText(/Contact Number/) as HTMLInputElement;
    fireEvent.change(phone, { target: { value: "abc! 8123" } });
    expect(phone).toHaveValue("8123");
    expect(phone).toHaveAccessibleDescription("Enter 10 digits starting with 9.");
    phone.setSelectionRange(0, phone.value.length);
    fireEvent.paste(phone, { clipboardData: { getData: () => "912-345 6789xyz0" } });
    expect(phone).toHaveValue("9123456789");
    expect(phone).toHaveAttribute("aria-invalid", "false");
    await verified(); fireEvent.click(submitButton());
    await screen.findByText(/Thank you!/);
    expect(requests()[0].values.mobile).toBe("+639123456789");
  });
  it("disables submission while processing and requires explicit API acceptance", async () => {
    let resolve: (response: Response) => void = () => {};
    routes(() => new Promise<Response>(done => { resolve = done; }));
    await ready(); fillValid(); await verified(); fireEvent.click(submitButton());
    expect(screen.getByRole("button", { name: "Submitting..." })).toBeDisabled();
    fireEvent.submit(screen.getByRole("button", { name: "Submitting..." }).closest("form")!);
    expect(submissions()).toHaveLength(1);
    resolve(Response.json({ success: true, data: {} }));
    await screen.findByRole("alert");
    expect(screen.queryByText(/Thank you!/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/)).toHaveValue("Alice");
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });
  it("retries a lost acceptance response with the same UUID and records one inquiry", async () => {
    routes(() => {
      if (submissions().length === 1) throw new TypeError("Response lost after acceptance");
      return Response.json({ success: true, data: { accepted: true } }, { status: 201 });
    });
    await ready(); fillValid(); await verified(); fireEvent.click(submitButton());
    await screen.findByRole("alert");
    expect(screen.getByLabelText(/Email Address/)).toHaveValue("alice@example.com");
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: " Alice " } });
    fireEvent.click(submitButton());
    await screen.findByText(/Thank you!/);
    expect(requests()).toHaveLength(2); expect(requests()[1]).toEqual(requests()[0]);
    expect(screen.getByRole("button", { name: "Submitted" })).toBeDisabled();
  });
  it("uses a new UUID after editing failed answers and maps server field errors", async () => {
    routes(() => {
      return Response.json({ success: false, error: "Check your answers", fieldErrors: { mail: "This email is unavailable.", organization: "Please review the company." } }, { status: 400 });
    });
    await ready(); fillValid(); await verified(); fireEvent.click(submitButton());
    await screen.findByText("This email is unavailable.");
    await waitFor(() => expect(screen.getByLabelText(/Company/)).toHaveFocus());
    fireEvent.change(email(), { target: { value: "other@example.com" } });
    expect(screen.getByLabelText(/Company/)).toHaveAccessibleDescription("Please review the company.");
    expect(screen.queryByText("This email is unavailable.")).not.toBeInTheDocument();
    await verified(); fireEvent.click(submitButton());
    await screen.findByText("This email is unavailable.");
    expect(requests()[1].requestId).not.toBe(requests()[0].requestId);
    expect(requests()[1].values.mail).toBe("other@example.com");
  });
  it("refreshes a changed definition and requires review before resubmitting", async () => {
    const changed = definition(); changed.data.version = 4;
    changed.data.fields.find(field => field.mapToField === "productInterest")!.options = [secondProductId];
    routes(() => submissions().length === 1 ? Response.json({ success: false, error: "This form has changed. Reload it before submitting." }, { status: 409 }) : Response.json({ success: true, data: { accepted: true } }), () => Response.json(submissions().length ? changed : definition()));
    await ready(); fillValid(); await verified(); fireEvent.click(submitButton());
    await screen.findByText(/This form has changed. Your answers are preserved/);
    expect(screen.getByLabelText(/First Name/)).toHaveValue("Alice");
    expect(submitButton()).toBeDisabled();
    await verified(); fireEvent.click(submitButton());
    expect(screen.getByText("Select approved product interests.")).toBeInTheDocument();
    expect(submissions()).toHaveLength(1);
    fireEvent.click(screen.getByLabelText("Unavailable product"));
    fireEvent.click(screen.getByLabelText("Internet"));
    fireEvent.click(submitButton());
    await screen.findByText(/Thank you!/);
    expect(requests()[1]).toMatchObject({ version: 4, values: { products: [secondProductId] } });
    expect(requests()[1].requestId).not.toBe(requests()[0].requestId);
  });

  it("debounces checks and ignores stale responses, including a return to the same email", async () => {
    const checks: { signal?: AbortSignal | null; resolve: (response: Response) => void }[] = [];
    network.mockImplementation((url, init) => String(url).includes("email-availability")
      ? new Promise<Response>(resolve => checks.push({ signal: init?.signal, resolve })) : Promise.resolve(Response.json(definition())));
    await ready(); vi.useFakeTimers(); fillValid();
    expect(screen.getByRole("status")).toHaveTextContent("Checking email availability");
    expect(submitButton()).toBeDisabled();
    await act(async () => { await vi.advanceTimersByTimeAsync(599); });
    expect(checks).toHaveLength(0);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(checks).toHaveLength(1);
    fireEvent.change(email(), { target: { value: "other@example.com" } });
    expect(checks[0].signal?.aborted).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    fireEvent.change(email(), { target: { value: "alice@example.com" } });
    await act(async () => { checks[0].resolve(available()); checks[1].resolve(available()); });
    fireEvent.submit(submitButton().closest("form")!);
    expect(submissions()).toHaveLength(0);
    expect(submitButton()).toBeDisabled();
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(checks).toHaveLength(3);
    await act(async () => { checks[2].resolve(available()); });
    expect(submitButton()).toBeEnabled();
  });

  it("keeps rejected or failed emails blocked and allows a failed check to be retried", async () => {
    network.mockResolvedValueOnce(Response.json(definition()))
      .mockResolvedValueOnce(Response.json({ success: true, data: { available: false, reason: "STAFF_EMAIL_NOT_ALLOWED" } }))
      .mockRejectedValueOnce(new TypeError("network failure"))
      .mockResolvedValueOnce(available());
    await ready(); vi.useFakeTimers();
    fireEvent.change(email(), { target: { value: "STAFF@EXAMPLE.COM" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(email()).toHaveAccessibleDescription(emailAvailabilityMessages.STAFF_EMAIL_NOT_ALLOWED);
    expect(submitButton()).toBeDisabled();
    expect(String(network.mock.calls[1][0])).toContain("?email=staff%40example.com");
    fireEvent.change(email(), { target: { value: "guest@example.com" } });
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(email()).toHaveAccessibleDescription("Unable to verify this email. Please try again.");
    expect(submitButton()).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Retry email verification" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(submitButton()).toBeEnabled();
    expect(email()).toHaveAttribute("aria-invalid", "false");
    expect(submissions()).toHaveLength(0);
  });

  it("invalidates a previously available email when LeadCRM rejects it on submit", async () => {
    routes(() => Response.json({ success: false, error: "Please check the highlighted fields.", fieldErrors: { mail: emailAvailabilityMessages.STAFF_EMAIL_NOT_ALLOWED } }, { status: 400 }));
    await ready(); fillValid(); await verified(); fireEvent.click(submitButton());
    await screen.findByText(emailAvailabilityMessages.STAFF_EMAIL_NOT_ALLOWED);
    await waitFor(() => expect(email()).toHaveFocus());
    expect(submitButton()).toBeDisabled();
    fireEvent.submit(submitButton().closest("form")!);
    expect(submissions()).toHaveLength(1);
  });

  it("skips verification when an optional email is blank", async () => {
    const optional = definition(); optional.data.fields[4].required = false;
    routes(() => Response.json({ success: true, data: { accepted: true } }), () => Response.json(optional));
    await ready(); fillValid(); fireEvent.change(email(), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Contact Number/), { target: { value: "9123456789" } });
    fireEvent.click(submitButton());
    await screen.findByText(/Thank you!/);
    expect(network).toHaveBeenCalledTimes(2);
    expect(requests()[0].values.mail).toBe("");
  });

  it.each([[409, "We could not safely match this inquiry."], [429, "Too many submissions. Please try again later."]])("preserves answers and the retry ID on HTTP %i", async (status, error) => {
    routes(() => submissions().length === 1 ? Response.json({ success: false, error }, { status }) : Response.json({ success: true, data: { accepted: true } }));
    await ready(); fillValid(); await verified(); fireEvent.click(submitButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(error);
    expect(screen.getByLabelText(/First Name/)).toHaveValue("Alice");
    expect(submissions()).toHaveLength(1);
    fireEvent.click(submitButton());
    await screen.findByText(/Thank you!/);
    expect(requests()[0]).toEqual(requests()[1]);
  });
});
