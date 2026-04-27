export interface ConfiguracionReglasRequest {
  codigo?: number | null;
  codigoRegla?: number;
  codigoCategoria?: number;
  codigoModo?: number;
  predeterminado?: string;
  prioridad?: number;
  codigoCliente: number;
}
