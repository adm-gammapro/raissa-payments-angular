import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  UsuarioSistemasTransfer
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-sistemas-transfer-response';
import {
  TransferirSistemasRequest
} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/transferir-sistemas-request';

@Injectable({
  providedIn: 'root',
})
export class UsuarioSistemaService {
  private readonly urlUsuarioSistemas: string = environment.url.base + '/api/usuario-sistemas';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  /**
   * Obtener sistemas para transferencia (disponibles y asignados)
   */
  obtenerSistemasParaTransferencia(usuarioId: number): Observable<UsuarioSistemasTransfer> {
    console.log('obtenerSistemasParaTransferencia', usuarioId);
    return this.http.get<UsuarioSistemasTransfer>(
      `${this.urlUsuarioSistemas}/transfer/${usuarioId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Transferir sistemas (asignar y/o desasignar)
   */
  transferirSistemas(request: TransferirSistemasRequest): Observable<void> {
    console.log('transferirSistemas', request);
    return this.http.post<void>(
      `${this.urlUsuarioSistemas}/transferir`,
      request
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
