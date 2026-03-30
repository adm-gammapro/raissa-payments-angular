import {SortOrderEnum} from '../emuns/sort-order.enum';

export interface SearchRequest {
  page: number;
  size: number;
  sortField?: string;
  sortOrder?: SortOrderEnum;
}
