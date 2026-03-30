import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, EMPTY, map, Observable, throwError} from 'rxjs';
import {Auth} from '../../../../authorization/auth';
import {SolicitudSearch} from '../../../../../apis/model/module/private/operativo/solicitud/request/solicitud-search';
import {
  SolicitudSearchResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/solicitud-search-response';
import {
  FlujoSolicitudRequest
} from '../../../../../apis/model/module/private/operativo/solicitud/request/flujo-solicitud-request';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  private readonly baseUrl = environment.url.base + '/solicitudes';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) {
  }

  getSolicitudesPage(request: SolicitudSearch): Observable<SolicitudSearchResponse> {
    return this.http.post(`${this.baseUrl}/list-page-solicitud?`, request).pipe(
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

  flujoSolicitudes(request: FlujoSolicitudRequest): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/flujo-solicitud`, request).pipe(
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
