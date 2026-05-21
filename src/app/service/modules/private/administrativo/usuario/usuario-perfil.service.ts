import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  UsuarioPerfilesTransfer
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-perfiles-transfer-response';
import {
  TransferirPerfilesRequest
} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/transferir-perfiles-request';

@Injectable({
  providedIn: 'root',
})
export class UsuarioPerfilService {
  private readonly urlUsuarioPerfiles: string = environment.url.base + '/api/usuario-perfiles';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  obtenerPerfilesParaTransferencia(usuarioId: number): Observable<UsuarioPerfilesTransfer> {
    console.log('obtenerPerfilesParaTransferencia', usuarioId);
    return this.http.get<UsuarioPerfilesTransfer>(
      `${this.urlUsuarioPerfiles}/transfer/${usuarioId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  transferirPerfiles(request: TransferirPerfilesRequest): Observable<void> {
    console.log('transferirPerfiles', request);
    return this.http.post<void>(
      `${this.urlUsuarioPerfiles}/transferir`,
      request
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
