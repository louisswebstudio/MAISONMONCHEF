"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { AreaRegionGroup, CollectionListing } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";
import { ButtonButton } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { collectionListingToCardData } from "@/lib/property-card-data";
import {
  LISTING_STATUSES,
  LISTING_CATEGORIES,
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
 *
 * LOCATION is the exception: 45 areas is far too many to sit flat in a 300px
 * sidebar, so they are grouped into the 3 regions of the `area` taxonomy and
 * each region is a collapsible section, ALL COLLAPSED on first paint. The panel
 * therefore still reads as four short filters at a glance, and a visitor who
 * wants a specific area opens one region rather than scrolling past 45
 * checkboxes. Selection is per-AREA (never a whole region) — a region header is
 * a disclosure, not a filter value — and a collapsed region shows a count badge
 * so an active selection is never hidden by the collapse.
 *
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
  areaRegions,
}: {
  lang: Locale;
  dict: Dictionary;
  listings: CollectionListing[];
  /** The location taxonomy, region-grouped and pre-ordered by the CMS. */
  areaRegions: AreaRegionGroup[];
}) {
  const t = dict.collection;
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    categories: [],
    priceRanges: [],
    locations: [],
  });
  const [visible, setVisible] = useState(PAGE_SIZE);
  /** Slugs of the expanded regions — empty, i.e. all collapsed, on first paint. */
  const [openRegions, setOpenRegions] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filters.status !== "all" && l.status !== filters.status) return false;
      if (
        filters.categories.length > 0 &&
        (!l.category || !filters.categories.includes(l.category))
      )
        return false;
      // Matched on the AREA SLUG, not the display name — the slug is the stable
      // machine value, so renaming an area in the Studio can't break a filter.
      if (
        filters.locations.length > 0 &&
        !filters.locations.includes(l.locationSlug)
      )
        return false;
      if (filters.priceRanges.length > 0) {
        // Match by the project's starting (lowest) price — mirrors the "From
        // AED X" shown on the card.
        const inRange = LISTING_PRICE_RANGES.some(
          (r) =>
            filters.priceRanges.includes(r.value) &&
            l.startingPrice >= r.min &&
            (r.max === null || l.startingPrice < r.max),
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

          {/* Location — 3 collapsible region sections (all collapsed initially) */}
          <fieldset className="flex flex-col gap-[12px]">
            <legend className="p-0">
              <FilterLabel>{t.filters.location}</FilterLabel>
            </legend>
            <div className="flex flex-col">
              {areaRegions.map((region) => (
                <RegionSection
                  key={region._id}
                  region={region}
                  open={openRegions.includes(region.slug)}
                  onToggleOpen={() =>
                    setOpenRegions((open) =>
                      open.includes(region.slug)
                        ? open.filter((s) => s !== region.slug)
                        : [...open, region.slug],
                    )
                  }
                  selected={filters.locations}
                  onToggleArea={(v) => toggle("locations", v)}
                />
              ))}
            </div>
          </fieldset>
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
        {options.map((opt) => (
          <CheckboxRow
            key={opt.value}
            label={opt.label}
            checked={selected.includes(opt.value)}
            onToggle={() => onToggle(opt.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

/** One checkbox + label. Shared by the flat filter groups and the area lists. */
function CheckboxRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-[10px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
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
        {label}
      </span>
    </label>
  );
}

/**
 * One collapsible region within the Location filter. The header is a plain
 * disclosure button — clicking it never selects anything, so "Dubai" can't be
 * mistaken for a filter value; only the areas inside are selectable.
 *
 * The area list is unmounted while collapsed rather than hidden with CSS, so 45
 * off-screen checkboxes stay out of the tab order and the accessibility tree.
 * The count badge keeps a selection visible after the region is collapsed
 * again — otherwise the grid would look filtered for no visible reason.
 */
function RegionSection({
  region,
  open,
  onToggleOpen,
  selected,
  onToggleArea,
}: {
  region: AreaRegionGroup;
  open: boolean;
  onToggleOpen: () => void;
  selected: string[];
  onToggleArea: (slug: string) => void;
}) {
  const panelId = `region-panel-${region.slug}`;
  const selectedCount = region.areas.filter((a) =>
    selected.includes(a.slug),
  ).length;
  const isEmpty = region.areas.length === 0;

  return (
    <div className="border-b border-[#eaeaea] last:border-b-0">
      <button
        type="button"
        onClick={onToggleOpen}
        disabled={isEmpty}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-[8px] py-[12px] text-start outline-none focus-visible:outline-2 focus-visible:outline-navy disabled:cursor-default disabled:opacity-50"
      >
        <span className="flex-1 text-[16px] font-normal leading-[24px] tracking-[0.3px] text-navy">
          {region.name}
        </span>
        {selectedCount > 0 && (
          <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-medium leading-none text-white">
            {selectedCount}
          </span>
        )}
        <DisclosureChevron open={open} />
      </button>

      {open && !isEmpty && (
        <div
          id={panelId}
          className="flex flex-col gap-[8px] pb-[16px] ps-[4px] pt-[2px]"
        >
          {region.areas.map((area) => (
            <CheckboxRow
              key={area._id}
              label={area.name}
              checked={selected.includes(area.slug)}
              onToggle={() => onToggleArea(area.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Region disclosure caret — same glyph as the Status select, rotated when open. */
function DisclosureChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "shrink-0 text-[#5f5f5f] transition-transform duration-150",
        open && "rotate-180",
      )}
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
