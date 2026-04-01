import {TipoPagoResponse} from './tipo-pago-response';

export interface TipoPagoConnectResponse {
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  rowPages: number;
  list: TipoPagoResponse[];
}
