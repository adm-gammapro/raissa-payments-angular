import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';
import {
  PerfilOpcionesTransfer
} from '../../../../../apis/model/module/private/admnistrativo/perfil/response/perfil-opciones-transfer-response';
import {
  TransferirOpcionesRequest
} from '../../../../../apis/model/module/private/admnistrativo/perfil/request/transferir-opciones-request';

@Injectable({
  providedIn: 'root',
})
export class PerfilOpcionService {
  private readonly urlPerfilOpciones: string = environment.url.base + '/api/perfil-opciones';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: Auth
  ) { }

  obtenerOpcionesParaTransferencia(perfilId: number): Observable<PerfilOpcionesTransfer> {
    return this.http.get<PerfilOpcionesTransfer>(
      `${this.urlPerfilOpciones}/transfer/${perfilId}`
    ).pipe(
      map((response: any) => response),
      catchError(err => this.handleError(err))
    );
  }

  transferirOpciones(request: TransferirOpcionesRequest): Observable<void> {
    return this.http.post<void>(
      `${this.urlPerfilOpciones}/transferir`,
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
