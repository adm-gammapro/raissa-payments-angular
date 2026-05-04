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
  tipoDocBeneficiario: string;
  nroDocBeneficiario: string;
  mismotitular: string;

  // Respuesta de la transferencia
  transferenciaId: string;
  itf: number;
  comisionOrigen: number;
  comisionDestino: number;
  mpe001idl: string;
  movimientoUid: string;

  // Resultado de la consulta
  codRespuestaConsulta: string;
  dscRespuestaConsulta: string;
  estadoEjecucionConsulta: string;
  fechaConsulta: string;
  horaConsulta: string;

  // Resultado de la transferencia
  codRespuestaTransferencia: string;
  dscRespuestaTransferencia: string;
  estadoEjecucionTransferencia: string;
  fechaTransferencia: string;
  horaTransferencia: string;

  // Datos del beneficiario validado por el banco
  tipoDocBeneficiarioRespuesta: number;
  documentoBeneficiarioRespuesta: string;
  nombreBeneficiarioRespuesta: string;
  direccionBeneficiarioRespuesta: string;
  telefonoBeneficiarioRespuesta: string;
  movilBeneficiarioRespuesta: string;
  mismoTitularOut: string;

  estadoRegistro: EstadoRegistroEnum;
  audiFechIns: string;
}
