import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes implements OnInit {
  clientes: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes(); // Llamamos a la función al iniciar
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (datos) => {
        this.clientes = datos;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error:', err)
    });
  }

  irANuevoCliente() {
    this.router.navigate(['/clientes/nuevo']);
  }

  eliminar(id: number, nombre: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar a ${nombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo Bootstrap
      cancelButtonColor: '#6c757d', // Gris Bootstrap
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario dijo que sí, llamamos a la API
        this.clienteService.eliminarCliente(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El cliente ha sido borrado.', 'success');
            // Recargamos la tabla para que el cliente desaparezca de la pantalla
            this.cargarClientes();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
          }
        });
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/clientes/editar', id]);
  }
}