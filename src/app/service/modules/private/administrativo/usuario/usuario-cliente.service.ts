import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  UsuarioClientesTransfer
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-clientes-transfer-response';
import {
  TransferirClientesRequest
} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/transferir-clientes-request';

@Injectable({
  providedIn: 'root',
})
export class UsuarioClienteService {
  private readonly urlUsuarioClientes: string = environment.url.base + '/api/usuario-clientes';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  obtenerClientesParaTransferencia(usuarioId: number): Observable<UsuarioClientesTransfer> {
    console.log('obtenerClientesParaTransferencia', usuarioId);
    return this.http.get<UsuarioClientesTransfer>(
      `${this.urlUsuarioClientes}/transfer/${usuarioId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  transferirClientes(request: TransferirClientesRequest): Observable<void> {
    console.log('transferirClientes', request);
    return this.http.post<void>(
      `${this.urlUsuarioClientes}/transferir`,
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
