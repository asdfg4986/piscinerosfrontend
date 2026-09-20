import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { ClienteService } from '../services/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes implements OnInit {
  clientes: any[] = [];
  esAdmin: boolean = false;

  // Filtros
  filtroTexto: string = '';
  filtroComuna: string = '';
  filtroEstado: string = 'Todos';

  // Paginación
  paginaActual: number = 1;
  tamañoPagina: number = 10;

  get comunasUnicas() {
    const comunas = this.clientes.map(c => c.comuna).filter(c => c && c.trim() !== '');
    return [...new Set(comunas)].sort();
  }

  get clientesFiltrados() {
    return this.clientes.filter(cliente => {
      // Filtro de texto (Nombre o Dirección)
      const texto = this.filtroTexto.toLowerCase();
      const coincideTexto = cliente.nombre.toLowerCase().includes(texto) || 
                            cliente.direccion.toLowerCase().includes(texto);
      
      // Filtro de Comuna
      const coincideComuna = this.filtroComuna === '' || cliente.comuna === this.filtroComuna;

      // Filtro de Estado
      let coincideEstado = true;
      if (this.filtroEstado === 'Activos') coincideEstado = cliente.activo === true;
      if (this.filtroEstado === 'Inactivos') coincideEstado = cliente.activo === false;

      return coincideTexto && coincideComuna && coincideEstado;
    });
  }

  get clientesPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamañoPagina;
    const fin = inicio + this.tamañoPagina;
    return this.clientesFiltrados.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.max(1, Math.ceil(this.clientesFiltrados.length / this.tamañoPagina));
  }

  alCambiarFiltro() {
    this.paginaActual = 1;
  }

  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroComuna = '';
    this.filtroEstado = 'Todos';
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
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdministrador();
    this.cargarClientes(); // Llamamos a la función al iniciar
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (datos) => {
        if (this.esAdmin) {
          this.clientes = datos;
        } else {
          this.clientes = datos.filter((c: any) => c.activo === true);
        }
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

  verVisitas(id: number) {
    this.router.navigate(['/clientes', id, 'visitas']);
  }
}