import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth'; 

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
    const token = this.obtenerToken();
    if (!token) return false;
  
    try {
      // Un JWT tiene 3 partes separadas por puntos. La del medio (payload) tiene los datos.
      // atob() decodifica la parte en Base64 para poder leerla.
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // El claim 'exp' viene en segundos, lo multiplicamos por 1000 para pasarlo a milisegundos
      const fechaExpiracion = payload.exp * 1000; 
      
      // Si la fecha actual es mayor a la fecha de expiración, el token está vencido
      if (Date.now() > fechaExpiracion) {
        this.logout(); // Destruimos la evidencia inmediatamente
        return false;
      }
    
      return true; // Si llegamos aquí, el token existe y aún es válido
    } catch (e) {
      // Si hay algún error leyendo el token (ej. está corrupto), cerramos sesión
      this.logout();
      return false;
    }
  }
  
  // 5. Saber si el usuario es Administrador
  esAdministrador(): boolean {
    const roles = localStorage.getItem('roles');
    if (!roles) return false;
    return JSON.parse(roles).includes('Administrador');
  }

  // 6. Obtener el ID del técnico desde el token
  obtenerTecnicoId(): number | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // The claim name is "TecnicoId" as we defined in the backend
      if (payload.TecnicoId) {
        return Number(payload.TecnicoId);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}