/** Join conditional class names. Kept dependency-free (no clsx/tailwind-merge). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
