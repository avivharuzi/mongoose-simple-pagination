export interface PaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  page: number;
  perPage: number;
  previousPage: number | null;
  totalDocuments: number;
  totalPages: number;
}
