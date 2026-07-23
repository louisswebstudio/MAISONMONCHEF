import { defineType, defineField } from "sanity";

/**
 * Durable record of every Contact page submission, written server-side by
 * app/api/contact/route.ts BEFORE the notification email is attempted — so a
 * Resend outage or misconfiguration never loses an enquiry. `emailStatus`
 * tracks whether the notification actually went out; `emailError` holds the
 * failure detail for support triage. Nothing here is authored in Studio, so
 * all fields are readOnly — Studio is a read/audit surface, not an editor.
 */
export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "inquiry",
      title: "Inquiry Type",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "emailStatus",
      title: "Notification Email Status",
      type: "string",
      options: { list: ["sent", "failed"] },
      readOnly: true,
    }),
    defineField({
      name: "emailError",
      title: "Notification Email Error",
      type: "string",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Submitted, newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "phone" },
  },
});
