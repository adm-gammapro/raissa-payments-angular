import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export interface AbonoSolicitudResponse {
  id: number;
  cargoSolicitudId: number;
  cuentaDestino: string;
  codigoEntidadFinanciera: string;
  nombreEntidadFinanciera: string;
  moneda: string;
  montoDestino: number;
  beneficiario: string;
  ndocBeneficiarioValidado: string;
  nombreBeneficiarioValidado: string;
  estadoEjecucion: string;
  detalleEjecucion: string;

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
