import { Pagination } from './pagination';

export class PaginatedResult<T> {
  records: T;
  pagination: Pagination;
}
