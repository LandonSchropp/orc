import { COLUMN_WIDTH, GUTTER } from "./constants.ts";

/**
 * Returns the total width spanned by the given number of columns, including the gutters between
 * them, in terminal columns.
 *
 * @param numberOfColumns The number of session cards in a row.
 * @returns The combined width of the columns and their gutters.
 */
export function contentWidth(numberOfColumns: number): number {
  return numberOfColumns * COLUMN_WIDTH + (numberOfColumns - 1) * GUTTER;
}
