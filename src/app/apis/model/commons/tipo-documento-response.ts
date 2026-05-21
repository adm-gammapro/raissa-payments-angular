export interface TipoDocumentoResponse {
  codigo: string;
  abreviatura: string;
  descripcion: string;
  longitudMinima: number;
  longitudMaxima: number;
  indicadorPersonaJuridica: string;
  indicadorPersonaNatural: string;
  documentoComplementario: string;
  equivalenteSbs: string;
  equivalenteSentinel: string;

  estadoRegistro: string;
  audiFechIns: string;
}
