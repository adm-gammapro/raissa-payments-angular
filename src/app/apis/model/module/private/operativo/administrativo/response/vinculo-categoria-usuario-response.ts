import {UsuarioResponse} from '../../../admnistrativo/usuario/response/usuario-response';

export interface VinculoCategoriaUsuarioResponse {
  idCategoria?: number;
  usuariosDisponibles?: UsuarioResponse[];
  usuariosVinculados?: UsuarioResponse[];
}
