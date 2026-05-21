import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  TipoPagoSearch
} from '../../../../../apis/model/module/private/operativo/administrativo/request/tipo-pago-search';
import {
  TipoPagoConnectResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/tipo-pago-connect-response';
import {
  TipoPagoRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/tipo-pago-request';
import {
  TipoPagoResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/tipo-pago-response';
import {
  CategoriaConnectResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/categoria-connect-response';
import {
  CategoriaSearch
} from '../../../../../apis/model/module/private/operativo/administrativo/request/categoria-search';
import {
  CategoriaRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/categoria-request';
import {
  CategoriaResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/categoria-response';
import {ReglaSearch} from '../../../../../apis/model/module/private/operativo/administrativo/request/regla-search';
import {
  ReglaConnectResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/regla-connect-response';
import {ReglaResponse} from '../../../../../apis/model/module/private/operativo/administrativo/response/regla-response';
import {ReglaRequest} from '../../../../../apis/model/module/private/operativo/administrativo/request/regla-request';
import {
  ConfiguracionReglasSearch
} from '../../../../../apis/model/module/private/operativo/administrativo/request/configuracion-reglas-search';
import {
  ConfiguracionReglasConnectResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/configuracion-reglas-connect-response';
import {
  ConfiguracionReglasRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/configuracion-reglas-request';
import {
  ConfiguracionReglasResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/configuracion-reglas-response';
import {
  VinculoCategoriaUsuarioRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/vinculo-categoria-usuario-request';
import {
  VinculoCategoriaUsuarioResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/vinculo-categoria-usuario-response';
import {
  CategoriaUsuarioRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/categoria-usuario-request';

@Injectable({
  providedIn: 'root',
})
export class AdministrativoService {
  private readonly baseUrl = environment.url.base + '/administrativo';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) {
  }

  // TIPO PAGO METHODS
  listarTipoPagoPage(search: TipoPagoSearch): Observable<TipoPagoConnectResponse> {
    return this.http.post<TipoPagoConnectResponse>(
      `${this.baseUrl}/list-page-tipo-pago`,
      search
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  getTipoPago(get: TipoPagoRequest): Observable<TipoPagoResponse> {
    return this.http.post<TipoPagoResponse>(
      `${this.baseUrl}/get-tipo-pago`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  createTipoPago(create: TipoPagoRequest): Observable<TipoPagoResponse> {
    return this.http.post<TipoPagoResponse>(
      `${this.baseUrl}/create-tipo-pago`,
      create
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  updateTipoPago(update: TipoPagoRequest): Observable<TipoPagoResponse> {
    return this.http.post<TipoPagoResponse>(
      `${this.baseUrl}/update-tipo-pago`,
      update
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  deleteTipoPago(remove: TipoPagoRequest): Observable<TipoPagoResponse> {
    return this.http.post<TipoPagoResponse>(
      `${this.baseUrl}/delete-tipo-pago`,
      remove
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  listTipoPago(get: TipoPagoRequest): Observable<TipoPagoResponse[]> {
    return this.http.post<TipoPagoResponse[]>(
      `${this.baseUrl}/list-tipo-pago`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  // CATEGORIA METHODS
  listarCategoriaPage(search: CategoriaSearch): Observable<CategoriaConnectResponse> {
    return this.http.post<CategoriaConnectResponse>(
      `${this.baseUrl}/list-page-categoria`,
      search
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  getCategoria(get: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(
      `${this.baseUrl}/get-categoria`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  createCategoria(create: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(
      `${this.baseUrl}/create-categoria`,
      create
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  updateCategoria(update: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(
      `${this.baseUrl}/update-categoria`,
      update
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  deleteCategoria(remove: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(
      `${this.baseUrl}/delete-categoria`,
      remove
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  listCategoria(get: CategoriaRequest): Observable<CategoriaResponse[]> {
    return this.http.post<CategoriaResponse[]>(
      `${this.baseUrl}/list-categoria`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  getCategoriaUsuariosVinculadosList(request: VinculoCategoriaUsuarioRequest): Observable<VinculoCategoriaUsuarioResponse> {
    return this.http.post<VinculoCategoriaUsuarioResponse>(
      `${this.baseUrl}/list-vinculo-categoria-usuario`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  vincularCategoriaUsuario(request: CategoriaUsuarioRequest): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseUrl}/vincular-categoria-usuario`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  desvincularCategoriaUsuario(request: CategoriaUsuarioRequest): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseUrl}/desvincular-categoria-usuario`,
      request
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  // REGLA METHODS
  listarReglaPage(search: ReglaSearch): Observable<ReglaConnectResponse> {
    console.log("regla");
    console.log(search);
    return this.http.post<ReglaConnectResponse>(
      `${this.baseUrl}/list-page-regla`,
      search
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  getRegla(get: ReglaRequest): Observable<ReglaResponse> {
    return this.http.post<ReglaResponse>(
      `${this.baseUrl}/get-regla`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  createRegla(create: ReglaRequest): Observable<ReglaResponse> {
    return this.http.post<ReglaResponse>(
      `${this.baseUrl}/create-regla`,
      create
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  updateRegla(update: ReglaRequest): Observable<ReglaResponse> {
    return this.http.post<ReglaResponse>(
      `${this.baseUrl}/update-regla`,
      update
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  deleteRegla(remove: ReglaRequest): Observable<ReglaResponse> {
    return this.http.post<ReglaResponse>(
      `${this.baseUrl}/delete-regla`,
      remove
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  listRegla(get: ReglaRequest): Observable<ReglaResponse[]> {
    return this.http.post<ReglaResponse[]>(
      `${this.baseUrl}/list-regla`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  // CONFIGURACION REGLA METHODS
  listarConfiguracionReglaPage(search: ConfiguracionReglasSearch): Observable<ConfiguracionReglasConnectResponse> {
    return this.http.post<ConfiguracionReglasConnectResponse>(
      `${this.baseUrl}/list-page-configuracion-regla`,
      search
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  getConfiguracionRegla(get: ConfiguracionReglasRequest): Observable<ConfiguracionReglasResponse> {
    return this.http.post<ConfiguracionReglasResponse>(
      `${this.baseUrl}/get-configuracion-regla`,
      get
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  createConfiguracionRegla(create: ConfiguracionReglasRequest): Observable<ConfiguracionReglasResponse> {
    return this.http.post<ConfiguracionReglasResponse>(
      `${this.baseUrl}/create-configuracion-regla`,
      create
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  updateConfiguracionRegla(update: ConfiguracionReglasRequest): Observable<ConfiguracionReglasResponse> {
    return this.http.post<ConfiguracionReglasResponse>(
      `${this.baseUrl}/update-configuracion-regla`,
      update
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  deleteConfiguracionRegla(remove: ConfiguracionReglasRequest): Observable<ConfiguracionReglasResponse> {
    return this.http.post<ConfiguracionReglasResponse>(
      `${this.baseUrl}/delete-configuracion-regla`,
      remove
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
