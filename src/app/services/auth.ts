import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajusta el puerto (ej. 7168) según tu proyecto de C#
  private apiUrl = 'https://localhost:7168/api/auth'; 

  constructor(private http: HttpClient) { }

  // 1. Enviar credenciales a C# y guardar el token si hay éxito
  login(credenciales: { email: string, password: string }): Observable<{ token: string; roles: string[] }> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      // El operador tap nos permite hacer algo con la respuesta ANTES de entregarla al componente
      tap((response: any) => {
        if (response && response.token) {
          // Guardamos el token y los roles en el almacenamiento local del navegador
          localStorage.setItem('token', response.token);
          localStorage.setItem('roles', JSON.stringify(response.roles));
        }
      })
    );
  }

  // 2. Cerrar sesión: simplemente destruimos la pulsera VIP
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }

  // 3. Recuperar el token (lo usaremos más adelante en el interceptor)
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // 4. Saber si el usuario tiene un token activo
  estaAutenticado(): boolean {
    // Retorna true si hay token, false si es null
    return this.obtenerToken() !== null; 
  }
  
  // 5. Saber si el usuario es Administrador
  esAdministrador(): boolean {
    const roles = localStorage.getItem('roles');
    if (!roles) return false;
    return JSON.parse(roles).includes('Administrador');
  }
}