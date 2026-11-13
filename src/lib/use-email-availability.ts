"use client";

import { useEffect, useRef, useState } from "react";
import { emailAvailabilityMessages, parseEmailAvailability, type EmailAvailabilityReason } from "./contact-contract";

type Check = { key: string } & ({ status: "available" } | { status: "failed" } | { status: "rejected"; reason: EmailAvailabilityReason });

/** A result belongs only to the current draft and published version, including A → B → A edits. */
export function useEmailAvailability(email: string, version: number | undefined, enabled: boolean) {
  const normalized = email.trim().toLowerCase();
  const identity = JSON.stringify([email, version, enabled]);
  const draft = useRef({ identity, revision: 0 });
  if (draft.current.identity !== identity) draft.current = { identity, revision: draft.current.revision + 1 };
  const key = JSON.stringify([identity, draft.current.revision]);
  const currentKey = useRef(key); currentKey.current = key;
  const controller = useRef<AbortController | undefined>(undefined);
  const [check, setCheck] = useState<Check>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const abort = new AbortController(); controller.current = abort;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/contact-form/email-availability/?${new URLSearchParams({ email: normalized })}`, {
          cache: "no-store", signal: AbortSignal.any([abort.signal, AbortSignal.timeout(20_000)]),
        });
        if (!response.ok) throw new Error("Email verification failed");
        const result = parseEmailAvailability(await response.json());
        if (!abort.signal.aborted && currentKey.current === key) setCheck(result.available ? { key, status: "available" } : { key, status: "rejected", reason: result.reason });
      } catch {
        if (!abort.signal.aborted && currentKey.current === key) setCheck({ key, status: "failed" });
      }
    }, 600);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [key, normalized, enabled, attempt]);

  const current = enabled && check?.key === key ? check : undefined;
  const status = !enabled ? "idle" : current?.status ?? "checking";
  const error = current?.status === "failed" ? "Unable to verify this email. Please try again."
    : current?.status === "rejected" ? emailAvailabilityMessages[current.reason] : undefined;
  return {
    status, error, blocked: enabled && status !== "available",
    confirm: (value: string) => status === "available" && currentKey.current === key && value.trim().toLowerCase() === normalized,
    retry: () => { if (current?.status === "failed") { setCheck(undefined); setAttempt(value => value + 1); } },
    reject: (reason: EmailAvailabilityReason) => {
      if (currentKey.current === key) { controller.current?.abort(); setCheck({ key, status: "rejected", reason }); }
    },
  };
}
