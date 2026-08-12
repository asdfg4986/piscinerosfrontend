import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';
import { Clientes } from './clientes-lista/clientes'; 
import { NuevoCliente } from './clientes-nuevo/nuevo-cliente';
import { EditarCliente } from './clientes-editar/editar-cliente';
import { VisitasLista } from './visitas-lista/visitas-lista';
import { VisitasNuevo } from './visitas-nuevo/visitas-nuevo';
import { VisitasEditar } from './visitas-editar/visitas-editar';
import { LoginComponent } from './login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Cuando la URL sea /clientes, muestra el componente
  { path: 'clientes', component: Clientes, canActivate: [authGuard] },

  // Ruta para crear un nuevo cliente
  { path: 'clientes/nuevo', component: NuevoCliente, canActivate: [authGuard] },

  // Ruta para editar un cliente existente
  { path: 'clientes/editar/:id', component: EditarCliente, canActivate: [authGuard] },

  // Ruta para ver las visitas de un cliente específico
  { path: 'clientes/:id/visitas', component: VisitasLista, canActivate: [authGuard] },

  // Ruta para registrar una nueva visita para un cliente específico
  { path: 'clientes/:id/visitas/nuevo', component: VisitasNuevo, canActivate: [authGuard] },

  // Ruta para editar una visita existente
  { path: 'clientes/:clienteId/visitas/editar/:id', component: VisitasEditar, canActivate: [authGuard] },

  // Ruta para el login
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [
      () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        
        if (auth.estaAutenticado()) {
          // Si ya tiene sesión, lo "pateamos" al panel principal y le prohibimos ver el login
          router.navigate(['/clientes']);
          return false;
        }
        // Si no tiene sesión, lo dejamos ver el formulario
        return true;
      }
    ]
  },

  // Si el usuario entra a la raíz (/), redirige a login o a clientes según si tiene sesión iniciada o no
  { 
    path: '', 
    pathMatch: 'full',
    redirectTo: () => {
      const auth = inject(AuthService);
      // Si tiene token va a clientes, si no, a login
      return auth.estaAutenticado() ? '/clientes' : '/login'; 
    }
  },

  // Ruta comodín para cualquier otra URL no definida, redirige a login o clientes según el estado de autenticación
  { 
    path: '**', 
    redirectTo: () => {
      const auth = inject(AuthService);
      return auth.estaAutenticado() ? '/clientes' : '/login';
    }
  }
];