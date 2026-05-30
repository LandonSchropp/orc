import fuzzysort from "fuzzysort";

/**
 * Filters `options` to those that fuzzy-match `query`, ordered by score (best first). An empty
 * query returns every option in its original order.
 *
 * @param options The full list of options.
 * @param query The search query.
 * @returns The matching options, in score order.
 */
export function filterOptions(options: string[], query: string): string[] {
  if (query === "") return options;
  return fuzzysort.go(query, options).map((result) => result.target);
}
