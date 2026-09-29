import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TecnicoService {
  private apiUrl = environment.apiUrl + '/tecnicos';

  constructor(private http: HttpClient) { }

  // Obtener todos los técnicos activos
  getTecnicos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Obtener un técnico por ID
  getTecnico(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo técnico (y su cuenta de usuario)
  crearTecnico(tecnico: any): Observable<any> {
    return this.http.post(this.apiUrl, tecnico);
  }

  // Actualizar un técnico existente
  actualizarTecnico(id: number, tecnicoActualizado: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tecnicoActualizado);
  }
}