import {CategoriaResponse} from './categoria-response';

export interface CategoriaConnectResponse {
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  rowPages: number;
  list: CategoriaResponse[];
}
