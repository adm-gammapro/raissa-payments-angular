export interface ConfiguracionReglasRequest {
  codigo?: number | null;
  codigoRegla?: number;
  codigoCategoria?: number;
  codigoModo?: number;
  predeterminado?: boolean;
  prioridad?: number;
  codigoCliente: number;
}
