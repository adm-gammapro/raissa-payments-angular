import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Auth} from '../authorization/auth';
import {TipoDocumentoResponse} from '../../apis/model/commons/tipo-documento-response';

@Injectable({
  providedIn: 'root'
})
export class TipoDocService {
  private readonly url: string = environment.url.base + '/general';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) {
  }

  getAllTipoDocumentos(): Observable<TipoDocumentoResponse[]> {
    return this.http.get<TipoDocumentoResponse[]>(`${this.url}/listarTipoDocumento`).pipe(
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
