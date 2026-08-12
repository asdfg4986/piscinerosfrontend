import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyectamos los servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario tiene sesión iniciada, el guardia le abre la puerta
  if (authService.estaAutenticado()) {
    return true;
  }

  // Si no tiene sesión, lo pateamos a la pantalla de login y cerramos la puerta
  router.navigate(['/login']);
  return false;
};