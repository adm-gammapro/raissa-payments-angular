import {SearchRequest} from '../../../../../commons/search-request';

export interface ConfiguracionReglasSearch extends SearchRequest {
  codigoRegla?: number;
  codigoCategoria?: number;
  codigoModo?: number;
  estadoRegistro?: string;
  codigoCliente: number;
}
