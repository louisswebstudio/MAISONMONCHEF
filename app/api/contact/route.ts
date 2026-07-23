import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { serverClient } from "@/sanity/lib/serverClient";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { site } from "@/lib/site";
import { locales, type Locale } from "@/lib/i18n/config";

export const runtime = "nodejs";

const MAX_NAME = 200;
const MAX_PHONE = 40;
const MAX_INQUIRY = 200;
const MAX_MESSAGE = 4000;

interface ContactPayload {
  name?: unknown;
  phone?: unknown;
  inquiry?: unknown;
  message?: unknown;
  consent?: unknown;
  locale?: unknown;
  turnstileToken?: unknown;
}

type FieldError = "name" | "phone" | "consent" | "turnstileToken";

/**
 * Real, non-bypassable validation — the client-side checks in ContactForm are
 * for UX only. Anyone can POST here directly with devtools/curl, so every
 * constraint that matters (required fields, lengths, consent) is re-checked.
 */
function validate(body: ContactPayload):
  | { ok: true; name: string; phone: string; inquiry: string; message: string; locale: Locale }
  | { ok: false; field: FieldError } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > MAX_NAME) return { ok: false, field: "name" };

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!phone || phone.length > MAX_PHONE) return { ok: false, field: "phone" };

  if (body.consent !== true) return { ok: false, field: "consent" };

  if (typeof body.turnstileToken !== "string" || !body.turnstileToken) {
    return { ok: false, field: "turnstileToken" };
  }

  const inquiryRaw = typeof body.inquiry === "string" ? body.inquiry.trim() : "";
  const inquiry = inquiryRaw.slice(0, MAX_INQUIRY);

  const messageRaw = typeof body.message === "string" ? body.message.trim() : "";
  const message = messageRaw.slice(0, MAX_MESSAGE);

  const localeCandidate = typeof body.locale === "string" ? body.locale : "";
  const locale = (locales as readonly string[]).includes(localeCandidate)
    ? (localeCandidate as Locale)
    : "en";

  return { ok: true, name, phone, inquiry, message, locale };
}

export async function POST(request: NextRequest) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const validated = validate(body);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: "validation", field: validated.field },
      { status: 400 },
    );
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  let turnstileOk: boolean;
  try {
    turnstileOk = await verifyTurnstileToken(body.turnstileToken as string, remoteIp);
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
  if (!turnstileOk) {
    return NextResponse.json({ ok: false, error: "verification" }, { status: 400 });
  }

  const { name, phone, inquiry, message, locale } = validated;
  const submittedAt = new Date().toISOString();

  // Send the notification first so we can persist the outcome in the same
  // Sanity write — the document (durable record) is created either way, even
  // if Resend is down or misconfigured.
  let emailStatus: "sent" | "failed" = "sent";
  let emailError: string | undefined;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Maison Monchef <onboarding@resend.dev>",
      to: site.email,
      subject: `Property enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Inquiry: ${inquiry || "—"}`,
        `Locale: ${locale}`,
        "",
        message || "—",
      ].join("\n"),
    });
    if (error) {
      emailStatus = "failed";
      emailError = error.message;
    }
  } catch (err) {
    emailStatus = "failed";
    emailError = err instanceof Error ? err.message : "Unknown error sending email";
  }

  try {
    await serverClient.create({
      _type: "contactSubmission",
      name,
      phone,
      inquiry,
      message,
      locale,
      submittedAt,
      emailStatus,
      emailError,
    });
  } catch {
    // The record could not be persisted at all — this is the one case that's
    // a genuine failure for the visitor, since nothing was captured.
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
