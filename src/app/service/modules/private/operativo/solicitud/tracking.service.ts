import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../../../../authorization/auth';
import {TrackingRequest} from '../../../../../apis/model/module/private/operativo/solicitud/request/tracking-request';
import {catchError, EMPTY, map, Observable, throwError} from 'rxjs';
import {
  TrackingResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/tracking-response';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private readonly baseUrl = environment.url.base + '/tracking';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) {
  }

  getTrackingList(request: TrackingRequest): Observable<TrackingResponse[]> {
    return this.http.post(`${this.baseUrl}/list-tracking?`, request).pipe(
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
