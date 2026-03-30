import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, forkJoin, mapTo, Observable, of, tap, throwError} from 'rxjs';
import {ClienteResponse} from '../../apis/model/module/private/admnistrativo/cliente/response/cliente-response';
import {UsuarioResponse} from '../../apis/model/module/private/admnistrativo/usuario/response/usuario-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public _token?: string | null;
  private readonly token_url = environment.security.token_url;

  constructor(private readonly httpClient: HttpClient) { }

  public getToken(code: string, code_verifier: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('grant_type',environment.security.grant_type);
    body.set('client_id',environment.security.client_id);
    body.set('redirect_uri',environment.security.redirect_uri);
    body.set('scope',environment.security.scope);
    body.set('code_verifier',code_verifier);
    body.set('code',code);
    const basic_auth = 'Basic ' + btoa(environment.security.client_id+':'+environment.security.secret_client);
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    const httpOptions = { headers: headers_object}
    return this.httpClient.post<any>(this.token_url, body, httpOptions);
  }

  public logout(): void {
    this._token = null;
    if(typeof window !== 'undefined'  && typeof window.sessionStorage !== 'undefined'){
      sessionStorage.clear();
    }
  }

  public isNoAutorizado(err: HttpErrorResponse | any): void {
    const status = err?.status;
    if (status === 401) {
      this.logout();
      const target = environment.url.landing;
      window.location.replace(`${target}?authError=${encodeURIComponent("Sesión caducada, vuelva a autenticarse por favor.")}`);
    }
  }

  guardarUsuario(accessToken: string): Observable<void> {
    const payload = this.obtenerDatosToken(accessToken);
    const usuario = String(payload.username ?? '').replaceAll(/['"]+/g, '');
    const idEmpresa = String(payload.empresaId ?? '').replaceAll(/['"]+/g, '');

    sessionStorage.setItem(environment.session.USERNAME, usuario);

    const ops: Observable<any>[] = [];
    ops.push(
      this.getUsuario(usuario).pipe(
        tap(u => {
          sessionStorage.setItem(environment.session.ID_USUARIO_SESSION, u.id?.toString() ?? '');
          sessionStorage.setItem(environment.session.NOMBRES_USUARIO, u.nombres ?? '');
          sessionStorage.setItem(environment.session.CLASE_USUARIO_SESSION, u.claseUsuario ?? '');

          sessionStorage.setItem(environment.session.APELLIDO_PATERNO_USUARIO_SESSION, u.apePaterno ?? '');
          sessionStorage.setItem(environment.session.APELLIDO_MATERNO_USUARIO_SESSION, u.apeMaterno ?? '');
          sessionStorage.setItem(environment.session.CORREO_USUARIO_SESSION, u.correo ?? '');
          sessionStorage.setItem(environment.session.TELEFONO_USUARIO_SESSION, u.telefono ?? '');
        }),
        catchError(err => {
          return throwError(() => err);
        })
      )
    );

    if (idEmpresa && idEmpresa !== '0') {
      sessionStorage.setItem(environment.session.ID_EMPRESA, idEmpresa);
      ops.push(
        this.getEmpresa(idEmpresa).pipe(
          tap(emp => {
            sessionStorage.setItem(environment.session.NOMBRE_EMPRESA, emp.razonSocial ?? '');
          })
        )
      );
    }

    if (ops.length === 0) {
      return of(void 0);
    }

    return forkJoin(ops).pipe(mapTo(void 0));
  }

  public getUsuario(username: string):  Observable<UsuarioResponse> {
    if (!username) {
      return throwError(() => new Error('username requerido'));
    }

    const url = `${environment.url.base}/usuario/obtenerUsuarioByUsername`;
    const params = new HttpParams().set('username', username);

    return this.httpClient.get<UsuarioResponse>(url, { params }).pipe(
      catchError(err => {
        this.isNoAutorizado(err);
        return throwError(() => err);
      })
    );
  }

  public getEmpresa(idEmpresa: string):  Observable<ClienteResponse> {
    if (!idEmpresa) {
      return throwError(() => new Error('idEmpresa requerido'));
    }

    const url = `${environment.url.base}/cliente/obtenerCliente`;
    const params = new HttpParams().set('idEmpresa', idEmpresa);

    return this.httpClient.get<ClienteResponse>(url, { params }).pipe(
      catchError(err => {
        this.isNoAutorizado(err);
        return throwError(() => err);
      })
    );
  }

  public obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
}
