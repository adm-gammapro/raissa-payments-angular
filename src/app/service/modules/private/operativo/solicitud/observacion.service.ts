import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {catchError, EMPTY, map, Observable, throwError} from 'rxjs';
import {
  ObservacionRequest
} from '../../../../../apis/model/module/private/operativo/solicitud/request/observacion-request';
import {
  ObservacionResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/observacion-response';

@Injectable({
  providedIn: 'root',
})
export class ObservacionService {
  private readonly baseUrl = environment.url.base + '/observacion';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) {
  }

  getObservacionList(request: ObservacionRequest): Observable<ObservacionResponse[]> {
    return this.http.post(`${this.baseUrl}/list-observacion?`, request).pipe(
      map((response: any) => response),
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
