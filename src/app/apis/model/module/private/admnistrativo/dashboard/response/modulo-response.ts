import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export class ModuloResponse {
  codigo!: number;
  nombreModulo!: string;
  descripcion!: string;
  subtitulo!: string;
  icono!: string;
  codigoAplicacion!: string;
  descripcionAplicacion!: string;
  estadoRegistro!: EstadoRegistroEnum;
  audiFechIns!: string;
}
