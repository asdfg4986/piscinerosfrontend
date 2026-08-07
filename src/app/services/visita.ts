import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisitaService {
  private apiUrl = 'https://localhost:7168/api/visitas';

  constructor(private http: HttpClient) { }

  // Obtener visitas de un cliente específico
  getVisitasPorCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Registrar una nueva visita
  registrarVisita(visita: any): Observable<any> {
    return this.http.post(this.apiUrl, visita);
  }
}