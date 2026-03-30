import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export interface TrackingResponse {
  fecha: string;
  usuario: string;
  evento: string;

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
