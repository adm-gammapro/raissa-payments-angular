import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export interface AbonoSolicitudResponse {
  id: number;
  cargoSolicitudId: number;
  cuentaDestino: string;
  codigoEntidadFinanciera: string;
  moneda: string;
  montoDestino: number;
  beneficiario: string;
  estadoEjecucion: string;
  detalleEjecucion: string;

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
