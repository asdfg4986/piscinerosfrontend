import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { TecnicoService } from '../services/tecnico';
import { map, catchError, of } from 'rxjs';

export const adminOrExternalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tecnicoService = inject(TecnicoService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    router.navigate(['/login']);
    return false;
  }

  // Si es administrador, acceso directo
  if (authService.esAdministrador()) {
    return true;
  }

  // Si es técnico, consultamos a la API si es externo
  const tecnicoId = authService.obtenerTecnicoId();
  if (!tecnicoId) {
    router.navigate(['/dashboard']);
    return false;
  }

  // Devolvemos un Observable<boolean> que el Router esperará a resolver
  return tecnicoService.getTecnico(tecnicoId).pipe(
    map(tecnico => {
      if (tecnico && tecnico.esExterno) {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/dashboard']);
      return of(false);
    })
  );
};
