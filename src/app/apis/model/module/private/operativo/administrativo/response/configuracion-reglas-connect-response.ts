import {ConfiguracionReglasResponse} from './configuracion-reglas-response';

export interface ConfiguracionReglasConnectResponse {
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  rowPages: number;
  list: ConfiguracionReglasResponse[];
}
