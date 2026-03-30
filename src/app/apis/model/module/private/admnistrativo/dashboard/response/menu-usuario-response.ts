import {ModuloResponse} from './modulo-response';
import {MenuResponse} from './menu-response';

export class MenuUsuarioResponse {
  listModulo: ModuloResponse[] = [];
  listOpcionPadres: MenuResponse[] = [];
  listOpcionBase: MenuResponse[] = [];
}
