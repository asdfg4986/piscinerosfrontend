import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = environment.apiUrl + '/clientes';

  constructor(private http: HttpClient) { }

  // Función para obtener todos los clientes
  getClientes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Función para crear un nuevo cliente
  crearCliente(nuevoCliente: any): Observable<any> {
    return this.http.post(this.apiUrl, nuevoCliente);
  }

  // Función para eliminar un cliente por su ID
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Función para obtener un cliente específico por su ID
  getCliente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Función para actualizar un cliente existente
  actualizarCliente(id: number, clienteActualizado: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, clienteActualizado);
  }
}