import {SearchResponse} from '../../../../../commons/search-response';
import {UsuarioResponse} from './usuario-response';

export interface UsuarioSearchResponse extends SearchResponse {
  list: UsuarioResponse[];
}
