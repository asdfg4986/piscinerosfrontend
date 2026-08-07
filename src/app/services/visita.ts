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

  // Obtener una visita específica por su ID
  getVisita(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Actualizar una visita existente
  actualizarVisita(id: number, visita: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, visita);
  }

  // Eliminar una visita
  eliminarVisita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}