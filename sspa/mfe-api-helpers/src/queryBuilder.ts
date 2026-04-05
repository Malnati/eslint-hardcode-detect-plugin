// sspa/mfe-api-helpers/src/queryBuilder.ts

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export const buildQueryParams = (params: QueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};
