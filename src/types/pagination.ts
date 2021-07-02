import { PaginationMeta } from './pagination-meta';

export interface Pagination<T> extends PaginationMeta {
  documents: T[];
}
