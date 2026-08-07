import { Routes } from '@angular/router';
import { Clientes } from './clientes-lista/clientes'; 
import { NuevoCliente } from './clientes-nuevo/nuevo-cliente';
import { EditarCliente } from './clientes-editar/editar-cliente';
import { VisitasLista } from './visitas-lista/visitas-lista';
import { VisitasNuevo } from './visitas-nuevo/visitas-nuevo';
import { VisitasEditar } from './visitas-editar/visitas-editar';

export const routes: Routes = [
  // Cuando la URL sea /clientes, muestra el componente
  { path: 'clientes', component: Clientes },

  // Ruta para crear un nuevo cliente
  { path: 'clientes/nuevo', component: NuevoCliente },

  // Ruta para editar un cliente existente
  { path: 'clientes/editar/:id', component: EditarCliente },

  // Ruta para ver las visitas de un cliente específico
  { path: 'clientes/:id/visitas', component: VisitasLista },

  // Ruta para registrar una nueva visita para un cliente específico
  { path: 'clientes/:id/visitas/nuevo', component: VisitasNuevo },

  // Ruta para editar una visita existente
  { path: 'clientes/:clienteId/visitas/editar/:id', component: VisitasEditar },
  
  // Si el usuario entra a la raíz (/), envíalo automáticamente a /clientes
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];