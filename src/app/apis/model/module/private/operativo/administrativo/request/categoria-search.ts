import {SearchRequest} from '../../../../../commons/search-request';

export interface CategoriaSearch extends SearchRequest {
  descripcion: string;
  estadoRegistro?: string;
  codigoCliente: number;
}
