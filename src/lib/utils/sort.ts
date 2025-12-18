/**
 * Sort utilities for consistent sorting across components
 * Eliminates duplicate getSortIndicator and sorting logic
 */

export type SortDirection = 'asc' | 'desc';

/**
 * Returns a sort indicator character based on current sort state
 * @param field - The field to check
 * @param currentField - The currently sorted field
 * @param direction - Current sort direction
 * @returns Sort indicator string (▲, ▼, or empty)
 */
export function getSortIndicator(
  field: string,
  currentField: string,
  direction: SortDirection
): string {
  if (field !== currentField) return '';
  return direction === 'asc' ? ' ▲' : ' ▼';
}

/**
 * Creates a comparator function for sorting
 * @param field - Field to sort by
 * @param direction - Sort direction
 * @returns Comparator function
 */
export function createSortComparator<T>(
  field: keyof T,
  direction: SortDirection
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const aVal = a[field];
    const bVal = b[field];

    let comparison = 0;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      // Fallback to string comparison
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return direction === 'asc' ? comparison : -comparison;
  };
}

/**
 * Sorts an array by a field
 * @param items - Array to sort
 * @param field - Field to sort by
 * @param direction - Sort direction
 * @returns New sorted array
 */
export function sortByField<T>(
  items: T[],
  field: keyof T,
  direction: SortDirection
): T[] {
  return [...items].sort(createSortComparator(field, direction));
}

/**
 * Creates a sort handler that toggles direction
 * @param currentField - Current sort field
 * @param currentDirection - Current sort direction
 * @param newField - Field being clicked
 * @returns New sort state
 */
export function toggleSort(
  currentField: string,
  currentDirection: SortDirection,
  newField: string
): { field: string; direction: SortDirection } {
  if (currentField === newField) {
    return {
      field: newField,
      direction: currentDirection === 'asc' ? 'desc' : 'asc'
    };
  }
  return { field: newField, direction: 'asc' };
}

/**
 * Multi-field sort comparator
 * Sorts by multiple fields in order of priority
 */
export function createMultiSortComparator<T>(
  fields: Array<{ field: keyof T; direction: SortDirection }>
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    for (const { field, direction } of fields) {
      const comparator = createSortComparator<T>(field, direction);
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}
