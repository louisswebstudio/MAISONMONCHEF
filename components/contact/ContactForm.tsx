"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";
import { ChevronDownIcon } from "@/components/ui/icons";

/**
 * Contact form — cloned from Figma (node 57:334 "Contact & Form"). Full Name,
 * Phone, Inquiry Type (select, default "Buying Property"), optional Message,
 * Submit, and a required Privacy consent checkbox.
 *
 * No form backend exists in this project, so submission composes a mailto: to
 * the single public address (bonjour@ — lib/site.ts) rather than faking a
 * success state. The email is the honest destination for a "Property
 * Enquiries" form; WhatsApp remains the site-wide primary channel (see the
 * design note raised with the client — the page leads with a form, not the
 * WhatsApp CTA used elsewhere).
 *
 * Design-system notes carried through deliberately:
 *  - Fields/select/textarea use the 2px hairline radius (rounded-hairline) —
 *    the ONE exception to the brand's 0px sharp corners (DESIGN.md).
 *  - Submit is Navy (#121c2d / bg-navy), never Charcoal — a recurring bug.
 */
export function ContactForm({ t }: { t: Dictionary["contact"] }) {
  const f = t.form;
  const baseId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiry, setInquiry] = useState(f.inquiryOptions.buying);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return setError(f.errorName);
    if (!phone.trim()) return setError(f.errorPhone);
    if (!consent) return setError(f.errorConsent);
    setError(null);

    const subject = f.emailSubject.replace("{name}", name.trim());
    const body = [
      `${f.name}: ${name.trim()}`,
      `${f.phone}: ${phone.trim()}`,
      `${f.inquiry}: ${inquiry}`,
      "",
      message.trim() || "—",
    ].join("\n");

    window.location.href = `${site.emailHref}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  const fieldClass =
    "h-[46px] w-full rounded-hairline bg-[#f0efeb] px-[15px] text-[14px] " +
    "font-medium tracking-[-0.42px] text-charcoal placeholder:text-[#5f5f5f] " +
    "outline-none transition-shadow duration-150 focus-visible:ring-2 " +
    "focus-visible:ring-navy focus-visible:ring-offset-0";

  return (
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

      {/* Submit — Navy fill (NOT charcoal). */}
      <button
        type="submit"
        className="mt-px h-[46px] w-full rounded-hairline bg-navy text-[15px] font-medium tracking-[-0.45px] text-[#f0efeb] transition-colors duration-150 hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {f.submit}
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
