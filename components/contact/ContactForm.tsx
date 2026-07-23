"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { ChevronDownIcon } from "@/components/ui/icons";

/**
 * Contact form — cloned from Figma (node 57:334 "Contact & Form"). Full Name,
 * Phone, Inquiry Type (select, default "Buying Property"), optional Message,
 * Submit, and a required Privacy consent checkbox.
 *
 * Submits server-side to POST /api/contact (see that route for validation,
 * Turnstile verification, the Sanity durable record, and the Resend
 * notification email) — no client-only mailto: fallback. Client-side checks
 * below are UX-only; the route re-validates everything since this endpoint
 * can be hit directly.
 *
 * Design-system notes carried through deliberately:
 *  - Fields/select/textarea use the 2px hairline radius (rounded-hairline) —
 *    the ONE exception to the brand's 0px sharp corners (DESIGN.md).
 *  - Submit is Navy (#121c2d / bg-navy), never Charcoal — a recurring bug.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ t, lang }: { t: Dictionary["contact"]; lang: Locale }) {
  const f = t.form;
  const baseId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiry, setInquiry] = useState(f.inquiryOptions.buying);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | undefined>(undefined);
  const turnstileTokenRef = useRef<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!turnstileReady || !siteKey || !turnstileContainerRef.current) return;
    if (turnstileWidgetIdRef.current) return;
    turnstileWidgetIdRef.current = window.turnstile?.render(turnstileContainerRef.current, {
      sitekey: siteKey,
      callback: (token) => {
        turnstileTokenRef.current = token;
      },
      "expired-callback": () => {
        turnstileTokenRef.current = null;
      },
      "error-callback": () => {
        turnstileTokenRef.current = null;
      },
    });
  }, [turnstileReady, siteKey]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return setError(f.errorName);
    if (!phone.trim()) return setError(f.errorPhone);
    if (!consent) return setError(f.errorConsent);
    if (!turnstileTokenRef.current) return setError(f.errorVerification);
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          inquiry,
          message: message.trim(),
          consent,
          locale: lang,
          turnstileToken: turnstileTokenRef.current,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        turnstileTokenRef.current = null;
        if (turnstileWidgetIdRef.current) window.turnstile?.reset(turnstileWidgetIdRef.current);
        setError(data?.error === "verification" ? f.errorVerification : f.errorServer);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      turnstileTokenRef.current = null;
      if (turnstileWidgetIdRef.current) window.turnstile?.reset(turnstileWidgetIdRef.current);
      setError(f.errorServer);
      setStatus("error");
    }
  }

  const fieldClass =
    "h-[46px] w-full rounded-hairline bg-[#f0efeb] px-[15px] text-[14px] " +
    "font-medium tracking-[-0.42px] text-charcoal placeholder:text-[#5f5f5f] " +
    "outline-none transition-shadow duration-150 focus-visible:ring-2 " +
    "focus-visible:ring-navy focus-visible:ring-offset-0";

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex w-full flex-col gap-[10px] bg-[#fcfcfc] px-[20px] pb-[20px] pt-[19px]"
      >
        <p className="text-[16px] font-semibold leading-[25.6px] tracking-[-0.48px] text-navy">
          {f.successMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setTurnstileReady(true)}
      />
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-[14px] bg-[#fcfcfc] px-[20px] pb-[20px] pt-[19px]"
      >
        {/* Full Name */}
        <Field id={`${baseId}-name`} label={f.name}>
          <input
            id={`${baseId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={f.namePlaceholder}
            className={fieldClass}
          />
        </Field>

        {/* Phone Number */}
        <Field id={`${baseId}-phone`} label={f.phone}>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={f.phonePlaceholder}
            className={fieldClass}
          />
        </Field>

        {/* Inquiry Type */}
        <Field id={`${baseId}-inquiry`} label={f.inquiry}>
          <div className="relative">
            <select
              id={`${baseId}-inquiry`}
              name="inquiry"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className={`${fieldClass} cursor-pointer appearance-none pe-[42px]`}
            >
              {Object.values(f.inquiryOptions).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden
              className="pointer-events-none absolute end-[12px] top-1/2 -translate-y-1/2 text-[#5f5f5f]"
            />
          </div>
        </Field>

        {/* Message (Optional) */}
        <Field id={`${baseId}-message`} label={f.message}>
          <textarea
            id={`${baseId}-message`}
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={f.messagePlaceholder}
            className="min-h-[140px] w-full resize-y rounded-hairline bg-[#f0efeb] p-[15px] text-[14px] font-medium tracking-[-0.42px] text-charcoal placeholder:text-[#5f5f5f] outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-navy"
          />
        </Field>

        {/* Spam protection widget — rendered explicitly once api.js loads. */}
        <div ref={turnstileContainerRef} />

        {/* Submit — Navy fill (NOT charcoal). */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-px h-[46px] w-full rounded-hairline bg-navy text-[15px] font-medium tracking-[-0.45px] text-[#f0efeb] transition-colors duration-150 hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? f.submitting : f.submit}
        </button>

        {/* Consent */}
        <label className="flex items-start gap-[10px] pt-px">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-[2px] size-[18px] shrink-0 cursor-pointer appearance-none rounded-hairline bg-[#f0efeb] transition-colors duration-150 checked:bg-navy checked:bg-[length:12px] checked:bg-center checked:bg-no-repeat focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundImage: consent
                ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23f0efeb' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 8 3.5 3.5L13 5'/%3E%3C/svg%3E\")"
                : undefined,
            }}
          />
          <span className="text-[14px] font-medium leading-[22.4px] tracking-[-0.42px] text-[#5f5f5f]">
            {f.consent}
          </span>
        </label>

        {error ? (
          <p role="alert" className="text-[14px] font-medium tracking-[-0.42px] text-[#b23b3b]">
            {error}
          </p>
        ) : null}
      </form>
    </>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <label
        htmlFor={id}
        className="text-[14px] font-semibold leading-[22.4px] tracking-[-0.42px] text-[#5f5f5f]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
