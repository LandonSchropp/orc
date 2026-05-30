import { COLUMN_WIDTH, GUTTER, MIN_MARGIN } from "./constants.ts";
import { contentWidth } from "./content-width.ts";

/** The shape of the viewport layout derived from the window width. */
export type Layout = {
  /** The number of session cards that fit across the viewport in a single row. */
  numberOfColumns: number;
  /** The width of the left margin outside the leftmost column. */
  leftMargin: number;
  /** The width of the right margin outside the rightmost column. */
  rightMargin: number;
};

/**
 * Returns the viewport layout — the number of session cards per row, and the left and right margins
 * outside the columns. Leftover space that does not divide evenly between the two margins is given
 * to the left margin.
 *
 * @param windowWidth The current width of the terminal window.
 * @returns The computed layout.
 */
export function computeLayout(windowWidth: number): Layout {
  const numberOfColumns = Math.max(
    1,
    Math.floor((windowWidth + GUTTER - 2 * MIN_MARGIN) / (COLUMN_WIDTH + GUTTER)),
  );

  const leftoverSpace = Math.max(0, windowWidth - contentWidth(numberOfColumns));

  const rightMargin = Math.floor(leftoverSpace / 2);
  const leftMargin = leftoverSpace - rightMargin;

  return { numberOfColumns, leftMargin, rightMargin };
}
