import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisitaService {
  private apiUrl = 'https://localhost:7168/api/visitas';

  constructor(private http: HttpClient) { }

  // Obtener todas las visitas
  getVisitas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

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
  
  // Subir una foto para una visita específica
  subirFotoVisita(visitaId: number, foto: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', foto);

    return this.http.post(`${this.apiUrl}/${visitaId}/foto`, formData);
  }

  // Endpoint: api/Visitas/tecnico/{id}/fecha/{fecha}
  getVisitasPorFecha(tecnicoId: number, fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tecnico/${tecnicoId}/fecha/${fecha}`);
  }
}