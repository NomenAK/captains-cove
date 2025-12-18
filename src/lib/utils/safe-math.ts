/**
 * Safe Math Utilities for Captain's Cove
 * Handles edge cases like empty arrays and division by zero
 */

/**
 * Safe Math.max that handles empty arrays
 * @param values - Array of numbers
 * @param defaultValue - Value to return if array is empty (default: 0)
 */
export function safeMax(values: number[], defaultValue: number = 0): number {
  if (values.length === 0) return defaultValue;
  return Math.max(...values);
}

/**
 * Safe Math.min that handles empty arrays
 * @param values - Array of numbers
 * @param defaultValue - Value to return if array is empty (default: 0)
 */
export function safeMin(values: number[], defaultValue: number = 0): number {
  if (values.length === 0) return defaultValue;
  return Math.min(...values);
}

/**
 * Safe division that returns defaultValue when divisor is 0 or invalid
 * @param numerator - The number to divide
 * @param denominator - The number to divide by
 * @param defaultValue - Value to return on invalid division (default: 0)
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  defaultValue: number = 0
): number {
  if (denominator === 0 || !Number.isFinite(denominator)) {
    return defaultValue;
  }
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : defaultValue;
}

/**
 * Calculate percentage safely
 * @param value - Current value
 * @param max - Maximum value
 * @param defaultValue - Value to return on invalid calculation
 */
export function safePercentage(
  value: number,
  max: number,
  defaultValue: number = 0
): number {
  return safeDivide(value, max, defaultValue) * 100;
}

/**
 * Get min and max bounds from array safely
 * @param values - Array of numbers
 * @param defaultMin - Default minimum if array is empty
 * @param defaultMax - Default maximum if array is empty
 */
export function safeBounds(
  values: number[],
  defaultMin: number = 0,
  defaultMax: number = 0
): { min: number; max: number } {
  if (values.length === 0) {
    return { min: defaultMin, max: defaultMax };
  }
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}
