import { Routes } from '@angular/router';
import { Clientes } from './clientes-lista/clientes'; 
import { NuevoCliente } from './clientes-nuevo/nuevo-cliente';
import { EditarCliente } from './clientes-editar/editar-cliente';

export const routes: Routes = [
  // Cuando la URL sea /clientes, muestra el componente
  { path: 'clientes', component: Clientes },

  // Ruta para crear un nuevo cliente
  { path: 'clientes/nuevo', component: NuevoCliente },

  // Ruta para editar un cliente existente
  { path: 'clientes/editar/:id', component: EditarCliente },
  
  // Si el usuario entra a la raíz (/), envíalo automáticamente a /clientes
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];