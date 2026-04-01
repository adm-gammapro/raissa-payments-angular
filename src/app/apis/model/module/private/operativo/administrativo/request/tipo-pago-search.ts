import {SearchRequest} from '../../../../../commons/search-request';

export interface TipoPagoSearch extends SearchRequest {
  descripcion: string;
  estadoRegistro?: string;
  codigoCliente: number;
}
