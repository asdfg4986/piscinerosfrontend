import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes'; 
import { NuevoCliente } from './nuevo-cliente/nuevo-cliente';

export const routes: Routes = [
  // Cuando la URL sea /clientes, muestra el componente
  { path: 'clientes', component: Clientes },

  // Ruta para crear un nuevo cliente
  { path: 'clientes/nuevo', component: NuevoCliente },
  
  // Si el usuario entra a la raíz (/), envíalo automáticamente a /clientes
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];