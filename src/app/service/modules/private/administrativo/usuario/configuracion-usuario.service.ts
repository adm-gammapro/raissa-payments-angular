import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  ConfiguracionUsuario,
  OpcionesConfiguracion
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/configuracion-usuario-response';
import {
  ConfiguracionUsuarioRequest
} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/configuracion-request';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionUsuarioService {
  private readonly urlBase: string = environment.url.base + '/api/configuracion-usuario';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  obtenerOpcionesConfiguracion(usuarioId: number): Observable<OpcionesConfiguracion> {
    console.log('obtenerOpcionesConfiguracion', usuarioId);
    return this.http.get<OpcionesConfiguracion>(
      `${this.urlBase}/opciones/${usuarioId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  listarConfiguracionesPorUsuario(usuarioId: number): Observable<ConfiguracionUsuario[]> {
    console.log('listarConfiguracionesPorUsuario', usuarioId);
    return this.http.get<ConfiguracionUsuario[]>(
      `${this.urlBase}/listar/${usuarioId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  guardarConfiguracion(request: ConfiguracionUsuarioRequest): Observable<ConfiguracionUsuario> {
    console.log('guardarConfiguracion', request);
    return this.http.post<ConfiguracionUsuario>(
      `${this.urlBase}/guardar`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  eliminarConfiguracion(configuracionId: number): Observable<void> {
    console.log('eliminarConfiguracion', configuracionId);
    return this.http.delete<void>(
      `${this.urlBase}/eliminar/${configuracionId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  private handleError(err: any) {
    this.authService.isNoAutorizado(err);
    if (err?.status === 401) {
      return throwError(() => new Error('Unauthorized'));
    }
    return throwError(() => err);
  }
}
