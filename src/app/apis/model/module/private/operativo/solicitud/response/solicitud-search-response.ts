import {SearchResponse} from '../../../../../commons/search-response';
import {SolicitudResponse} from './solicitud-response';

export interface SolicitudSearchResponse extends SearchResponse {
  list: SolicitudResponse[];
}
