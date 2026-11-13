// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactForm } from "../src/components/contact-form";
import { definition, secondProductId } from "./fixtures";
import type { Submission } from "../src/lib/contact-contract";

const network = vi.fn<typeof fetch>();
beforeEach(() => { vi.stubGlobal("fetch", network); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); network.mockReset(); });

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
    expect(screen.getByText("Select approved product interests.")).toBeInTheDocument();
    expect(network).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/First Name/)).toHaveFocus();
  });
  it("filters products without dropping selections from another category", async () => {
    network.mockResolvedValueOnce(Response.json(definition()));
    await ready(); fillValid();
    fireEvent.change(screen.getByLabelText("Product category"), { target: { value: "Telecom" } });
    expect(screen.queryByLabelText("CCTV")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Internet")).toBeInTheDocument();
    expect(screen.getByText("CCTV")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Internet"));
    expect(screen.getByText("2 products selected")).toBeInTheDocument();
  });
  it("disables submission while processing and requires explicit API acceptance", async () => {
    let resolve: (response: Response) => void = () => {};
    network.mockResolvedValueOnce(Response.json(definition())).mockImplementationOnce(() => new Promise<Response>(done => { resolve = done; }));
    await ready(); fillValid(); fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByRole("button", { name: "Submitting..." })).toBeDisabled();
    resolve(Response.json({ success: true, data: {} }));
    await screen.findByRole("alert");
    expect(screen.queryByText(/Thank you!/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/)).toHaveValue("Alice");
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });
  it("retries a lost acceptance response with the same UUID and records one inquiry", async () => {
    const recorded = new Set<string>(); const requests: Submission[] = []; let first = true;
    network.mockResolvedValueOnce(Response.json(definition())).mockImplementation(async (_url, options) => {
      const input = JSON.parse(options?.body as string) as Submission;
      requests.push(input); recorded.add(input.requestId);
      if (first) { first = false; throw new TypeError("Response lost after acceptance"); }
      return Response.json({ success: true, data: { accepted: true } }, { status: 201 });
    });
    await ready(); fillValid(); fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByRole("alert");
    expect(screen.getByLabelText(/Email Address/)).toHaveValue("alice@example.com");
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText(/Thank you!/);
    expect(requests).toHaveLength(2); expect(requests[1]).toEqual(requests[0]); expect(recorded.size).toBe(1);
    expect(screen.getByRole("button", { name: "Submitted" })).toBeDisabled();
  });
  it("uses a new UUID after editing failed answers and maps server field errors", async () => {
    const requests: Submission[] = [];
    network.mockResolvedValueOnce(Response.json(definition())).mockImplementation(async (_url, options) => {
      requests.push(JSON.parse(options?.body as string));
      return Response.json({ success: false, error: "Check your answers", fieldErrors: { mail: "This email is unavailable." } }, { status: 400 });
    });
    await ready(); fillValid(); fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText("This email is unavailable.");
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: "other@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText("This email is unavailable.");
    expect(requests[1].requestId).not.toBe(requests[0].requestId);
    expect(requests[1].values.mail).toBe("other@example.com");
  });
  it("refreshes a changed definition and requires review before resubmitting", async () => {
    const changed = definition(); changed.data.version = 4;
    changed.data.fields.find(field => field.mapToField === "productInterest")!.options = [secondProductId];
    network.mockResolvedValueOnce(Response.json(definition()))
      .mockResolvedValueOnce(Response.json({ success: false, error: "This form has changed. Reload it before submitting." }, { status: 409 }))
      .mockResolvedValueOnce(Response.json(changed));
    await ready(); fillValid(); fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText(/This form has changed. Your answers are preserved/);
    expect(screen.getByLabelText(/First Name/)).toHaveValue("Alice");
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText("Select approved product interests.")).toBeInTheDocument();
    expect(network).toHaveBeenCalledTimes(3);
  });
});
