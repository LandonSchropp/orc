/**
 * Computes the scroll offset that keeps the selected row visible, scrolling only when the row
 * reaches the margin band near the top or bottom edge of the viewport. When the row sits
 * comfortably within the viewport the current offset is returned unchanged, so the viewport stays
 * put while the selection moves around the middle and only follows once it nears an edge.
 *
 * @param currentOffset The viewport's current scroll offset, in rows from the top of the content.
 * @param top The selected row's top position, in rows from the top of the content.
 * @param height The selected row's height, in rows.
 * @param viewportHeight The visible viewport height, in rows.
 * @param margin The look-ahead band kept visible beyond the selection, in rows.
 * @returns The offset to scroll to, clamped so it never goes above the top of the content.
 */
export function computeScrollOffset(
  currentOffset: number,
  top: number,
  height: number,
  viewportHeight: number,
  margin: number,
): number {
  if (top - margin < currentOffset) {
    return Math.max(0, top - margin);
  }

  if (top + height + margin > currentOffset + viewportHeight) {
    return top + height + margin - viewportHeight;
  }

  return currentOffset;
}
