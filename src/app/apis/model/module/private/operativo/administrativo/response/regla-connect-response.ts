import {ReglaResponse} from './regla-response';

export interface ReglaConnectResponse {
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  rowPages: number;
  list: ReglaResponse[];
}
