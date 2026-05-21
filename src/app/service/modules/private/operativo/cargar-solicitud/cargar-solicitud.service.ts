import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CargarSolicitudService {
  private readonly baseUrl = environment.url.base + '/carga-solicitudes';

  constructor(private readonly http: HttpClient) {}

  cargarExcel(file: File, usuarioCarga: string, idEmpresa: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idEmpresa', idEmpresa);
    formData.append('usuarioCarga', usuarioCarga);
    return this.http.post(`${this.baseUrl}/cargar-excel`, formData);
  }
}
