export interface ObservacionRequest {
  solicitudId: number;
  descripcion?: string;
  tipoObservacion?: string;
  eventoObservacion?: string;
  usuarioObservacion?: string;

  codigoCliente: number;
}
