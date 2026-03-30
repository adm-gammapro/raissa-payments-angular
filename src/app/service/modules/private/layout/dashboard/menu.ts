import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {environment} from '../../../../../../environments/environment';
import {catchError, EMPTY, map, Observable, throwError} from 'rxjs';
import {
  MenuUsuarioResponse
} from '../../../../../apis/model/module/private/admnistrativo/dashboard/response/menu-usuario-response';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly urlUsuario : string = environment.url.base + '/usuario';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) { }

  getMenuUsuarios(user: string | null, idEmpresa: string | null):  Observable<MenuUsuarioResponse> {

    const params = new HttpParams({ fromObject: {
        ...(user ? { usuario: user } : {}),
        ...(idEmpresa ? { idEmpresa: idEmpresa } : {}),
      }});

    return this.http.get<MenuUsuarioResponse>(`${this.urlUsuario}/listarOpcionesUsuario`, { params }).pipe(
      catchError(err => {
        this.authService.isNoAutorizado(err);
        if (err?.status === 401) {
          return EMPTY;
        }
        return throwError(() => err);
      })
    );
  }
}
