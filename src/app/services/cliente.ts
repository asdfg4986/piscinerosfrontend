import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // Confirma que este sea el puerto correcto donde corre tu API de .NET
  private apiUrl = 'https://localhost:7168/api/clientes';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crearCliente(nuevoCliente: any): Observable<any> {
    return this.http.post(this.apiUrl, nuevoCliente);
  }
}