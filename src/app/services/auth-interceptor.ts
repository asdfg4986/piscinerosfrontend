import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el token en la memoria del navegador
  const token = localStorage.getItem('token');

  // 2. Si existe un token, clonamos la petición original y le inyectamos la cabecera de Autorización
  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Dejamos que la petición clonada (ya con el token) siga su camino a C#
    return next(peticionClonada);
  }

  // 3. Si no hay token (ej. está en la pantalla de login), la dejamos pasar tal cual
  return next(req);
};