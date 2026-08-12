import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7168/api/configuracion';

  getComunas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comunas`);
  }
}