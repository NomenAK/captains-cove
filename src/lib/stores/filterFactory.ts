/**
 * Filter store factory for creating consistent filter patterns
 * Reduces boilerplate and ensures uniform behavior across filter stores
 */

import { writable, derived, type Readable, type Writable } from 'svelte/store';
import type { SortConfig } from '$lib/data/types';
import { createSortComparator } from '$lib/utils/sort';

/**
 * Configuration for creating a filter store
 */
export interface FilterStoreConfig<TItem, TFilters extends Record<string, unknown>> {
  /** Default filter values */
  defaultFilters: TFilters;

  /** Default sort configuration */
  defaultSort: SortConfig;

  /** Source data store */
  source: Readable<TItem[]>;

  /**
   * Filter function - receives item and filters, returns true if item passes
   * This should be a single-pass compound filter for performance
   */
  filterFn: (item: TItem, filters: TFilters) => boolean;

  /**
   * Optional: transform the sort field before sorting
   * Useful when the filter type key differs from the item key
   */
  sortFieldTransform?: (field: string) => keyof TItem;
}

/**
 * Result of creating a filter store
 */
export interface FilterStore<TItem, TFilters extends Record<string, unknown>> {
  /** Filter values writable store */
  filters: Writable<TFilters>;

  /** Sort configuration writable store */
  sort: Writable<SortConfig>;

  /** Filtered and sorted items derived store */
  filtered: Readable<TItem[]>;

  /** Reset filters to defaults */
  reset: () => void;

  /** Reset both filters and sort to defaults */
  resetAll: () => void;
}

/**
 * Creates a filter store with consistent patterns
 *
 * @example
 * ```ts
 * const shipFilterStore = createFilterStore({
 *   defaultFilters: { class: '', tier: '', search: '' },
 *   defaultSort: { field: 'tier', direction: 'asc' },
 *   source: derived(dataStore, $d => $d.ships),
 *   filterFn: (ship, filters) =>
 *     (!filters.class || ship.shipClass === filters.class) &&
 *     (!filters.tier || ship.tier === parseInt(filters.tier)) &&
 *     (!filters.search || ship.name.toLowerCase().includes(filters.search.toLowerCase()))
 * });
 *
 * // Use in components
 * const { filters, sort, filtered, reset } = shipFilterStore;
 * ```
 */
export function createFilterStore<TItem, TFilters extends Record<string, unknown>>(
  config: FilterStoreConfig<TItem, TFilters>
): FilterStore<TItem, TFilters> {
  const { defaultFilters, defaultSort, source, filterFn, sortFieldTransform } = config;

  // Create writable stores
  const filters = writable<TFilters>({ ...defaultFilters });
  const sort = writable<SortConfig>({ ...defaultSort });

  // Create derived filtered store
  const filtered = derived(
    [source, filters, sort],
    ([$source, $filters, $sort]) => {
      // Apply filters
      const filteredItems = $source.filter(item => filterFn(item, $filters));

      // Apply sorting
      const sortField = sortFieldTransform
        ? sortFieldTransform($sort.field)
        : ($sort.field as keyof TItem);

      return filteredItems.sort(createSortComparator(sortField, $sort.direction));
    }
  );

  return {
    filters,
    sort,
    filtered,
    reset: () => filters.set({ ...defaultFilters }),
    resetAll: () => {
      filters.set({ ...defaultFilters });
      sort.set({ ...defaultSort });
    }
  };
}

/**
 * Helper to create a search filter predicate
 * Searches multiple fields case-insensitively
 */
export function createSearchPredicate<T>(
  fields: (keyof T)[],
  searchTerm: string
): (item: T) => boolean {
  if (!searchTerm) return () => true;

  const searchLower = searchTerm.toLowerCase();

  return (item: T) =>
    fields.some(field => {
      const value = item[field];
      return typeof value === 'string' && value.toLowerCase().includes(searchLower);
    });
}

/**
 * Helper to create an exact match filter predicate
 */
export function createExactMatchPredicate<T, K extends keyof T>(
  field: K,
  value: T[K] | ''
): (item: T) => boolean {
  if (value === '' || value === null || value === undefined) return () => true;
  return (item: T) => item[field] === value;
}

/**
 * Helper to create a numeric filter predicate
 * Handles string-to-number conversion for tier/level filters
 */
export function createNumericMatchPredicate<T, K extends keyof T>(
  field: K,
  value: string | number | ''
): (item: T) => boolean {
  if (value === '' || value === null || value === undefined) return () => true;

  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(numValue)) return () => true;

  return (item: T) => item[field] === numValue;
}
