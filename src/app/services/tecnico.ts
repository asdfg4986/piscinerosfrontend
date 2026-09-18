import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TecnicoService {
  // Ajusta esta URL si tu controlador se llama distinto
  private apiUrl = 'https://localhost:7168/api/tecnicos';

  constructor(private http: HttpClient) { }

  // Obtener todos los técnicos activos
  getTecnicos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Crear un nuevo técnico (y su cuenta de usuario)
  crearTecnico(tecnico: any): Observable<any> {
    return this.http.post(this.apiUrl, tecnico);
  }
}