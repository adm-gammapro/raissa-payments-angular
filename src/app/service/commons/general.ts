import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Auth} from '../authorization/auth';
import {catchError, map, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private readonly urlGeneral: string = environment.url.base + '/general';

  constructor(private readonly http: HttpClient,
              private readonly authService: Auth) { }

  getCodigoRandom(username: string, password: string, medio: string): Observable<string> {
    return this.http.get(`${this.urlGeneral}/obtener-codigo-random`, {
      params: { username: username, passwordPlano: password, modoEnvio: medio },
      responseType: 'text'
    }).pipe(
      map((response: any) => response),
      catchError(e => {
        this.authService.isNoAutorizado(e);
        return throwError(() => e);
      })
    );
  }
}
