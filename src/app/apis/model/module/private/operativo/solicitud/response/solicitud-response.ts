import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';
import {CargoSolicitudResponse} from './cargo-solicitud-response';

export interface SolicitudResponse {
  id: number;
  fechaCarga: string;
  usuarioCarga: string;
  nombreUsuarioCarga: string;
  cantidadOrdenes: number;
  estadoSolicitud: string;
  nombresUsuariosAutorizacion: string;
  cargos: CargoSolicitudResponse[];

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
