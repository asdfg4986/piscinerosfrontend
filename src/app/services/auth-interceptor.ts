import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  let peticionClonada = req;

  // 1. Inyectamos el token si existe
  if (token) {
    peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Inyectamos los servicios necesarios para la redirección
  const router = inject(Router);
  const authService = inject(AuthService);

  // 2. Enviamos la petición y estamos atentos (catchError) a la respuesta de C#
  return next(peticionClonada).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si C# nos devuelve un 401 (No Autorizado)
      if (error.status === 401) {
        console.warn('El token ha expirado o es inválido. Cerrando sesión...');
        authService.logout(); // Borramos el token vencido
        router.navigate(['/login']); // Pateamos al usuario a la pantalla de inicio
      }
      
      // Dejamos que el error siga su camino por si el componente quiere mostrar un SweetAlert
      return throwError(() => error);
    })
  );
};