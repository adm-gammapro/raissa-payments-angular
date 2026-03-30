import {DetalleAbono} from './detalle-abono';

export class Cargo {
  id!: number;
  cuentaCargo!: string;
  entidadFinancieraCargo!: string;
  monedaCuentaCargo!: string;
  montoCargo!: number;
  estadoEjecucion!: string;
  detalle!: DetalleAbono[];
}
