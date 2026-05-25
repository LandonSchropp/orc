/** The fixed width of a single session card, in terminal columns. */
export const COLUMN_WIDTH = 28;

/** The fixed width of the gutter between two adjacent columns, in terminal columns. */
export const GUTTER = 2;

/** The minimum width of each outer margin, in terminal columns. */
export const MIN_MARGIN = 2;

/** The height of a project header block, in terminal rows: its top margin plus the title line. */
export const PROJECT_HEADER_HEIGHT = 2;

/**
 * The height of a session card row, in terminal rows: the top accent, name, status, and bottom
 * accent.
 */
export const SESSION_ROW_HEIGHT = 4;

/** The height of the header bar that frames the top of the project list, in terminal rows. */
export const HEADER_HEIGHT = 1;

/** The height of the footer bar that frames the bottom of the project list, in terminal rows. */
export const FOOTER_HEIGHT = 1;

/** The interval between polls for updated data, in milliseconds. */
export const POLL_INTERVAL = 1000;

/**
 * The look-ahead band kept visible beyond the selected row when scrolling, in terminal rows. The
 * viewport starts following the selection once it comes within this many rows of the top or bottom
 * edge. Roughly one card row of context.
 */
export const SCROLL_MARGIN = 4;
