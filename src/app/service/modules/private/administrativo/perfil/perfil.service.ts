import {catchError, map, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {PerfilRequest} from '../../../../../apis/model/module/private/admnistrativo/perfil/request/perfil-request';
import {PerfilResponse} from '../../../../../apis/model/module/private/admnistrativo/perfil/response/perfil-response';
import {
  PerfilSearchResponse
} from '../../../../../apis/model/module/private/admnistrativo/perfil/response/perfil-search-response';
import {PerfilSearch} from '../../../../../apis/model/module/private/admnistrativo/perfil/request/perfil-search';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private readonly urlPerfil: string = environment.url.base + '/perfil';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  private handleError(err: any): Observable<never> {
    console.error('Error en PerfilService:', err);
    throw err;
  }

  /**
   * Registrar un nuevo perfil
   */
  registrarPerfil(request: PerfilRequest): Observable<PerfilResponse> {
    console.log('registrarPerfil', request);
    return this.http.post<PerfilResponse>(
      `${this.urlPerfil}/registrar-perfil`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Actualizar un perfil existente
   */
  actualizarPerfil(request: PerfilRequest): Observable<PerfilResponse> {
    console.log('actualizarPerfil', request);
    return this.http.post<PerfilResponse>(
      `${this.urlPerfil}/actualizar-perfil`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Eliminar (dar de baja) un perfil por código
   */
  eliminarPerfil(codigo: number): Observable<PerfilResponse> {
    console.log('eliminarPerfil', codigo);
    return this.http.post<PerfilResponse>(
      `${this.urlPerfil}/eliminar-perfil/${codigo}`,
      {}
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Listar perfiles con paginación y filtros
   */
  listarPerfilesPage(search: PerfilSearch): Observable<PerfilSearchResponse> {
    console.log('listarPerfilesPage', search);
    return this.http.post<PerfilSearchResponse>(
      `${this.urlPerfil}/listarPerfil`,
      search
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Obtener un perfil por código
   */
  obtenerPerfil(codigoPerfil?: number): Observable<PerfilResponse> {
    console.log('obtenerPerfil', codigoPerfil);
    let params: any = {};
    if (codigoPerfil) {
      params.codigoPerfil = codigoPerfil;
    }
    return this.http.get<PerfilResponse>(
      `${this.urlPerfil}/obtenerPerfil`,
      { params }
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }
}
