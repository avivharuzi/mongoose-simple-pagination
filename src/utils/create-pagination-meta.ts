import { Options, PaginationMeta } from '../types';

export const createPaginationMeta = (
  totalDocuments: number,
  options: Options
): PaginationMeta => {
  const { perPage, page } = options;
  const totalPages = Math.ceil(totalDocuments / perPage) || 1;
  let previousPage = null;
  let hasPreviousPage = false;
  if (page > 1 && page <= totalPages) {
    hasPreviousPage = true;
    previousPage = page - 1;
  }
  let nextPage = null;
  let hasNextPage = false;
  if (page < totalPages) {
    hasNextPage = true;
    nextPage = page + 1;
  }
  return {
    hasNextPage,
    hasPreviousPage,
    nextPage,
    page,
    perPage,
    previousPage,
    totalDocuments,
    totalPages,
  };
};
