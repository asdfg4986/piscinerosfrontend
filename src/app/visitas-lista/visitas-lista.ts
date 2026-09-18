import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { DatePipe, CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-visitas-lista',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './visitas-lista.html',
  styleUrl: './visitas-lista.scss'
})
export class VisitasLista implements OnInit {
  visitas: any[] = [];
  clienteId!: number;
  esAdmin: boolean = false;

  constructor(
    private visitaService: VisitaService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdministrador();
    // Obtenemos el ID del cliente desde la URL
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarVisitas();
  }

  cargarVisitas() {
    this.visitaService.getVisitasPorCliente(this.clienteId).subscribe({
      next: (datos) => {
        this.visitas = datos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar visitas:', err)
    });
  }

  volver() {
    this.router.navigate(['/clientes']);
  }

  irANuevaVisita() {
    this.router.navigate(['/clientes', this.clienteId, 'visitas', 'nuevo']);
  }

  editarVisita(visitaId: number) {
    this.router.navigate(['/clientes', this.clienteId, 'visitas', 'editar', visitaId]);
  }

  eliminarVisita(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se borrará este registro de mantenimiento. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545', // Rojo para confirmar el peligro
      cancelButtonColor: '#6c757d', // Gris para cancelar
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.visitaService.eliminarVisita(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminada!', 'La visita ha sido borrada.', 'success');
            // Recargamos la lista silenciosamente para que el registro desaparezca de la tabla
            this.cargarVisitas();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar la visita', 'error');
          }
        });
      }
    });
  }

  // Función para traducir el Enum de C# a texto y color de Bootstrap
  getEstadoInfo(estado: number): { texto: string, clase: string } {
    switch (estado) {
      case 0: 
        return { texto: 'Programada', clase: 'bg-primary' }; // Azul
      case 1: 
        return { texto: 'En Camino', clase: 'bg-info text-dark' }; // Celeste
      case 2: 
        return { texto: 'Completada', clase: 'bg-success' }; // Verde
      case 3: 
        return { texto: 'Cancelada', clase: 'bg-danger' }; // Rojo
      case 4: 
        return { texto: 'Fallida', clase: 'bg-dark' }; // Negro
      default: 
        return { texto: 'Desconocido', clase: 'bg-secondary' };
    }
  }
}