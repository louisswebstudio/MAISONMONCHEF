"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CollectionListing } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";
import { ButtonButton } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { collectionListingToCardData } from "@/lib/property-card-data";
import {
  LISTING_STATUSES,
  LISTING_CATEGORIES,
  LISTING_LOCATIONS,
  LISTING_PRICE_RANGES,
} from "@/lib/listings";

/**
 * Collection filter panel + card grid — cloned from Figma (file
 * r2XTjIJ5uaZ0VFCG2kfCdn, node 66:538 "listings"): a 300px filter card
 * (Status select, Category / Price Range / Location checkbox groups split by
 * hairline dividers) beside a 2-up grid of PROPERTY CARDs with a "Load More"
 * button. The sidebar stacks above the grid below lg (no mobile frame
 * supplied).
 *
 * Listings come from Sanity (fetched server-side in the page); filtering and
 * paging happen client-side — the whole catalogue is a few dozen documents at
 * most, so one fetch + local filtering beats a round-trip per checkbox.
 *
 * Figma's category labels ("Waterfront Residences", "Branded Residences", …)
 * are placeholder copy that doesn't match the locked schema taxonomy; the real
 * filter options come from lib/listings.ts so the UI can never drift from what
 * the CMS actually stores (same reasoning as the schema — see that file).
 * `#eaeaea` (borders/dividers), `#f3f2f0` (input fill) and `#5f5f5f` (option
 * text) are exact Figma values with no design token.
 */

const PAGE_SIZE = 8;

type Filters = {
  status: string; // "all" | ListingStatus
  categories: string[];
  priceRanges: string[];
  locations: string[];
};

export function CollectionExplorer({
  lang,
  dict,
  listings,
}: {
  lang: Locale;
  dict: Dictionary;
  listings: CollectionListing[];
}) {
  const t = dict.collection;
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    categories: [],
    priceRanges: [],
    locations: [],
  });
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filters.status !== "all" && l.status !== filters.status) return false;
      if (
        filters.categories.length > 0 &&
        (!l.category || !filters.categories.includes(l.category))
      )
        return false;
      if (
        filters.locations.length > 0 &&
        !filters.locations.includes(l.location)
      )
        return false;
      if (filters.priceRanges.length > 0) {
        const inRange = LISTING_PRICE_RANGES.some(
          (r) =>
            filters.priceRanges.includes(r.value) &&
            l.price >= r.min &&
            (r.max === null || l.price < r.max),
        );
        if (!inRange) return false;
      }
      return true;
    });
  }, [listings, filters]);

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE); // filter change resets paging
  };

  const toggle = (key: "categories" | "priceRanges" | "locations", value: string) =>
    update({
      [key]: filters[key].includes(value)
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value],
    });

  return (
    <div className="flex flex-col gap-[32px] lg:flex-row lg:items-start">
      {/* Filter panel */}
      <aside className="w-full shrink-0 rounded-hairline border border-[#eaeaea] bg-white px-[24px] pb-[24px] pt-[23px] lg:w-[300px]">
        <div className="flex flex-col gap-[23px]">
          {/* Status */}
          <div className="flex flex-col gap-[8px]">
            <FilterLabel>{t.filters.status}</FilterLabel>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => update({ status: e.target.value })}
                className="w-full appearance-none rounded-hairline border border-[#eaeaea] bg-[#f3f2f0] p-[12px] pe-[38px] text-[16px] leading-[20.8px] text-navy outline-none focus-visible:outline-2 focus-visible:outline-navy"
              >
                <option value="all">{t.filters.statusAll}</option>
                {LISTING_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t.statuses[s.value]}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Category */}
          <CheckboxGroup
            label={t.filters.category}
            options={LISTING_CATEGORIES.map((c) => ({
              value: c.value,
              label: t.categories[c.value],
            }))}
            selected={filters.categories}
            onToggle={(v) => toggle("categories", v)}
          />

          <Divider />

          {/* Price range */}
          <CheckboxGroup
            label={t.filters.priceRange}
            options={LISTING_PRICE_RANGES.map((r) => ({
              value: r.value,
              label: r.label,
            }))}
            selected={filters.priceRanges}
            onToggle={(v) => toggle("priceRanges", v)}
          />

          <Divider />

          {/* Location */}
          <CheckboxGroup
            label={t.filters.location}
            options={LISTING_LOCATIONS.map((l) => ({
              value: l.value,
              label: t.locations[l.value],
            }))}
            selected={filters.locations}
            onToggle={(v) => toggle("locations", v)}
          />
        </div>
      </aside>

      {/* Results */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-[48px]">
        {filtered.length === 0 ? (
          <p className="py-[64px] text-center text-[18px] font-medium leading-[28.8px] tracking-[-0.36px] text-[#5f5f5f]">
            {t.empty}
          </p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-[32px] md:grid-cols-2">
            {filtered.slice(0, visible).map((listing) => (
              <PropertyCard
                key={listing._id}
                data={collectionListingToCardData(listing, lang, dict)}
                labels={{
                  beds: dict.listings.beds,
                  baths: dict.listings.baths,
                  area: dict.listings.area,
                  forSale: dict.listings.forSale,
                  cta: dict.listings.cta,
                }}
              />
            ))}
          </div>
        )}

        {filtered.length > visible && (
          <ButtonButton
            variant="primary"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-[34px]"
          >
            {t.loadMore}
          </ButtonButton>
        )}
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[14px] font-normal leading-[18.2px] text-navy">
      {children}
    </span>
  );
}

function Divider() {
  return <div aria-hidden className="h-px w-full bg-[#eaeaea]" />;
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-[20px]">
      <legend className="mb-[20px] p-0">
        <FilterLabel>{label}</FilterLabel>
      </legend>
      <div className="-mt-[20px] flex flex-col gap-[8px]">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-[10px]"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex size-[20px] shrink-0 items-center justify-center rounded-hairline border border-[#eaeaea] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-navy",
                  checked ? "bg-navy" : "bg-[#f3f2f0]",
                )}
              >
                {checked && <CheckIcon />}
              </span>
              <span className="text-[16px] font-normal leading-[24px] tracking-[0.3px] text-[#5f5f5f]">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Select chevron (node 66:571) — grey affordance strip on the Status field. */
function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute end-[11px] top-1/2 -translate-y-1/2 text-[#5f5f5f]"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.5L4.75 8.75L9.5 3.5"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
