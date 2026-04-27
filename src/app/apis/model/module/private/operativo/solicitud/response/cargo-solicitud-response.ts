import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';
import {AbonoSolicitudResponse} from './abono-solicitud-response';

export interface CargoSolicitudResponse {
  id: number;
  solicitudId: number;
  cuentaOrigen: string;
  codigoEntidadFinanciera: string;
  nombreEntidadFinanciera: string;
  moneda: string;
  montoCargo: number;
  montoTotalAbonos: number;
  estadoValidacion: string;
  estadoEjecucion: string;
  abonos: AbonoSolicitudResponse[];

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
