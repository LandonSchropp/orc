/**
 * Splits an array into consecutive chunks of at most `size` elements. The final chunk holds the
 * remainder when the length is not an even multiple of `size`.
 *
 * @param array The array to split.
 * @param size The maximum number of elements per chunk. Must be at least 1.
 * @returns An array of chunks, in order.
 */
export function chunk<Type>(array: Type[], size: number): Type[][] {
  const chunks: Type[][] = [];

  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size));
  }

  return chunks;
}
