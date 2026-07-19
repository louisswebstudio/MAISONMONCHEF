import { defineType, defineField } from "sanity";
import { locales, defaultLocale, localeNames } from "../../../lib/i18n/config";

/**
 * Field-level internationalization objects. Each localized value is a single
 * object holding one field per supported locale (en/ar/fr). This is the
 * "cleaner per-language document structure" Sanity was chosen for over WPML
 * (CLAUDE.md §0). The default locale (English — the final brand voice) is
 * required; AR/FR are optional until translation ownership is confirmed (§7.6).
 *
 * Fields are generated from lib/i18n/config so adding a locale is a one-liner.
 */

const localeFieldDefs = (kind: "string" | "text") =>
  locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: kind,
      validation: (rule) =>
        locale === defaultLocale ? rule.required() : rule,
    }),
  );

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  // Collapse AR/FR under the English field to keep the editor tidy.
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true, collapsed: true } }],
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: "string",
      fieldset: locale === defaultLocale ? undefined : "translations",
      validation: (rule) => (locale === defaultLocale ? rule.required() : rule),
    }),
  ),
});

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true, collapsed: true } }],
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: "text",
      rows: 3,
      fieldset: locale === defaultLocale ? undefined : "translations",
      validation: (rule) => (locale === defaultLocale ? rule.required() : rule),
    }),
  ),
});

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Localized rich text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true, collapsed: true } }],
  fields: locales.map((locale) =>
    defineField({
      name: locale,
      title: localeNames[locale],
      type: "array",
      of: [{ type: "block" }],
      fieldset: locale === defaultLocale ? undefined : "translations",
    }),
  ),
});

// Kept exported in case a plain generated variant is wanted elsewhere.
export { localeFieldDefs };
