import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {InstitucionFinancieraResponse} from '../../apis/model/commons/institucion-financiera-response';
import {Auth} from '../authorization/auth';

@Injectable({
  providedIn: 'root'
})
export class InstitucionFinancieraService {
  private readonly urlGeneral: string = environment.url.base + '/general';

  constructor(private readonly http: HttpClient,
    private readonly authService: Auth) { }

  getAllBancos(codigoCliente: number): Observable<InstitucionFinancieraResponse[]> {
    return this.http.get<InstitucionFinancieraResponse[]>(`${this.urlGeneral}/list-institucion-financiera`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(e => {
        this.authService.isNoAutorizado(e);
        return throwError(() => e);
      })
    );
  }
}
