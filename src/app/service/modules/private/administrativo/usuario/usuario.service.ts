import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {UsuarioRequest} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/usuario-request';
import {
  UsuarioResponse
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-response';
import {catchError, map, Observable, throwError} from 'rxjs';
import {UsuarioSearch} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/usuario-search';
import {
  UsuarioSearchResponse
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-search-response';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly urlUsuario: string = environment.url.base + '/usuario';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  /**
   * Registrar un nuevo usuario
   */
  registrarUsuario(request: UsuarioRequest): Observable<UsuarioResponse> {
    console.log('registrarUsuario', request);
    return this.http.post<UsuarioResponse>(
      `${this.urlUsuario}/registrar-usuario`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Actualizar un usuario existente
   */
  actualizarUsuario(request: UsuarioRequest): Observable<UsuarioResponse> {
    console.log('actualizarUsuario', request);
    return this.http.post<UsuarioResponse>(
      `${this.urlUsuario}/actualizar-usuario`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Eliminar (dar de baja) un usuario por código
   */
  eliminarUsuario(codigo: number): Observable<UsuarioResponse> {
    console.log('eliminarUsuario', codigo);
    return this.http.post<UsuarioResponse>(
      `${this.urlUsuario}/eliminar-usuario/${codigo}`,
      {}
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Listar usuarios con paginación y filtros
   */
  listarUsuariosPage(search: UsuarioSearch): Observable<UsuarioSearchResponse> {
    return this.http.post<UsuarioSearchResponse>(
      `${this.urlUsuario}/listarUsuarios`,
      search
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Obtener un usuario por código
   */
  obtenerUsuario(codigoUsuario?: number): Observable<UsuarioResponse> {
    console.log('obtenerUsuario', codigoUsuario);
    let params: any = {};
    if (codigoUsuario) {
      params.codigoUsuario = codigoUsuario;
    }
    return this.http.get<UsuarioResponse>(
      `${this.urlUsuario}/obtenerUsuario`,
      { params }
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  // Manejo de errores común
  private handleError(err: any) {
    this.authService.isNoAutorizado(err);
    if (err?.status === 401) {
      return throwError(() => new Error('Unauthorized'));
    }
    return throwError(() => err);
  }
}
