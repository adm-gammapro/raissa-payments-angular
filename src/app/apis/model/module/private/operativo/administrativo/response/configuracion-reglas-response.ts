export interface ConfiguracionReglasResponse {
  codigo: number;
  codigoRegla?: number;
  descripcionRegla?: string;
  codigoCategoria?: number;
  descripcionCategoria?: string;
  codigoModo?: number;
  descripcionModo?: string;
  predeterminado?: string;
  prioridad: number;
  estadoRegistro: string;
  audiFechIns: string;
}
