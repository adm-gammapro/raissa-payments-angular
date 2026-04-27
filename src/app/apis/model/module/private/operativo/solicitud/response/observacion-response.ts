import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export interface ObservacionResponse {
  id: number;
  descripcion: string;
  tipoObservacion: string;
  eventoObservacion: string;
  usuarioObservacion: string;
  solicitudId: number;

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
