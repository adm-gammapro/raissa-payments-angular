import {SearchRequest} from '../../../../../commons/search-request';

export interface ReglaSearch extends SearchRequest {
  descripcion: string;
  moneda: string;
  estadoRegistro?: string;
  codigoCliente: number;
}
