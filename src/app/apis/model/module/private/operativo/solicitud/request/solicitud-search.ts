import {SearchRequest} from '../../../../../commons/search-request';

export interface SolicitudSearch extends SearchRequest {
  usuario?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  codigo?: string;
  estadoSolicitud?: string[];
  codigoCliente?: string;
}
