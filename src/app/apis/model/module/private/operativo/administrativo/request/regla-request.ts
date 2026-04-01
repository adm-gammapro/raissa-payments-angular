export interface ReglaRequest {
  codigo?: number | null;
  descripcion?: string;
  moneda?: string;
  limiteInferior?: number;
  limiteSuperior?: number;
  codigoCliente: number;
}
