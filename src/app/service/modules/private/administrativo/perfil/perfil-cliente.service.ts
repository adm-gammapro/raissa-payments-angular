import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  PerfilClientesTransfer
} from '../../../../../apis/model/module/private/admnistrativo/perfil/response/perfil-clientes-transfer-response';
import {
  TransferirClientesPerfilRequest
} from '../../../../../apis/model/module/private/admnistrativo/perfil/request/transferir-clientes-request';

@Injectable({
  providedIn: 'root',
})
export class PerfilClienteService {
  private readonly urlPerfilClientes: string = environment.url.base + '/api/perfil-clientes';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  obtenerClientesParaTransferencia(perfilId: number): Observable<PerfilClientesTransfer> {
    console.log('obtenerClientesParaTransferencia', perfilId);
    return this.http.get<PerfilClientesTransfer>(
      `${this.urlPerfilClientes}/transfer/${perfilId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  transferirClientes(request: TransferirClientesPerfilRequest): Observable<void> {
    console.log('transferirClientes', request);
    return this.http.post<void>(
      `${this.urlPerfilClientes}/transferir`,
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
