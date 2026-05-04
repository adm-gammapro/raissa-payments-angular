import {DetalleLiquidacionSolicitudResponse} from './detalle-liquidacion-solicitud-response';

export interface LiquidacionSolicitudResponse {
  idSolicitud: number;
  totalLiquidacion: number;
  cargo: number;
  totalCobros: number;
  totalImpuestos: number;
  totalComisionesOrigen: number;
  totalComisionesDestino: number;
  detalle: DetalleLiquidacionSolicitudResponse[];
}
