import {TipoClienteResponse} from './tipo-cliente-response';
import {EstadoRegistroEnum} from '../../../../../emuns/estado-registro.enum';

export class ClienteResponse {
  codigo!: number;
  razonSocial!: string;
  ruc!: string;
  tipoCliente!: TipoClienteResponse;
  direccion!: string;
  telefonoFijo!: string;
  telefonoCelular!: string;
  estadoRegistro!: EstadoRegistroEnum;
  audiFechIns!: string;
}
