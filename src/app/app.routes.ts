import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes'; 

export const routes: Routes = [
  // Cuando la URL sea /clientes, muestra el componente
  { path: 'clientes', component: Clientes },
  
  // Si el usuario entra a la raíz (/), envíalo automáticamente a /clientes
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];