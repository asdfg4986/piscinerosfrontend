import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/configuracion';

  getComunas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/comunas`);
  }
}