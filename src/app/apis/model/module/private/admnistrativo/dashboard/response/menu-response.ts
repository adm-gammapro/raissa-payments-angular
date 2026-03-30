import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export class MenuResponse {
  codigo!: number;
  descripcionOpcion!: string;
  rutaOpcion!: string;
  parteFija!: string;
  icono!: string;
  opcionPadre!: number;
  descripcionOpcionPadre!: string;
  numeroOrden!: number;
  codigoModulo!: number;
  descripcionModulo!: string;
  seleccionable!: string;
  estadoRegistro!: EstadoRegistroEnum;
  audiFechIns!: string;
}
