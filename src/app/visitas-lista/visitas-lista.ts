import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-visitas-lista',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './visitas-lista.html',
  styleUrl: './visitas-lista.scss'
})
export class VisitasLista implements OnInit {
  visitas: any[] = [];
  clienteId!: number;
  esAdmin: boolean = false;

  // Filtros
  filtroEstado: string = 'Todos';
  filtroTecnico: string = 'Todos';
  filtroMes: string = ''; // Ej. 2026-09

  // Paginación
  paginaActual: number = 1;
  tamañoPagina: number = 10;

  get tecnicosUnicos() {
    const tecnicos = this.visitas.map(v => v.tecnico?.nombre).filter(n => n);
    return [...new Set(tecnicos)].sort();
  }

  get visitasFiltradas() {
    return this.visitas.filter(visita => {
      // Filtro de Estado
      let coincideEstado = true;
      if (this.filtroEstado !== 'Todos') {
        const estadoNum = parseInt(this.filtroEstado, 10);
        coincideEstado = visita.estado === estadoNum;
      }

      // Filtro de Técnico
      let coincideTecnico = true;
      if (this.filtroTecnico !== 'Todos') {
        coincideTecnico = visita.tecnico?.nombre === this.filtroTecnico;
      }

      // Filtro de Mes
      let coincideMes = true;
      if (this.filtroMes) {
        // visita.fechaVisita formato: 'YYYY-MM-DDTHH:mm:ss'
        const visitaMes = new Date(visita.fechaVisita).toISOString().substring(0, 7);
        coincideMes = visitaMes === this.filtroMes;
      }

      return coincideEstado && coincideTecnico && coincideMes;
    });
  }

  get visitasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.tamañoPagina;
    const fin = inicio + this.tamañoPagina;
    return this.visitasFiltradas.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.max(1, Math.ceil(this.visitasFiltradas.length / this.tamañoPagina));
  }

  alCambiarFiltro() {
    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroEstado = 'Todos';
    this.filtroTecnico = 'Todos';
    this.filtroMes = '';
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginas() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

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