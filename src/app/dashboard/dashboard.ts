import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente';
import { VisitaService } from '../services/visita';
import { TecnicoService } from '../services/tecnico';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  totalClientes: number = 0;
  visitasHoy: number = 0;
  visitasPendientes: number = 0;
  tecnicosActivos: number = 0;
  agendaHoy: any[] = [];
  proximasVisitas: any[] = [];
  esAdmin: boolean = false;
  esExterno: boolean = false;
  
  get mostrarDirectorioClientes(): boolean {
    return this.esAdmin || this.esExterno;
  }
  
  // Mapeo de estados
  estadosVisita = ['Programada', 'En Camino', 'Completada', 'Cancelada', 'Fallida'];

  constructor(
    private clienteService: ClienteService,
    private visitaService: VisitaService,
    private tecnicoService: TecnicoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdministrador();
    this.cargarDatos();
  }

  cargarDatos() {
    // Si es admin, cargamos clientes y técnicos
    if (this.esAdmin) {
      this.clienteService.getClientes().subscribe({
        next: (clientes) => {
          this.totalClientes = clientes?.filter((c: any) => c.activo).length || 0;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando clientes', err)
      });

      this.tecnicoService.getTecnicos().subscribe({
        next: (tecnicos) => {
          this.tecnicosActivos = tecnicos?.filter((t: any) => t.activo).length || 0;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando técnicos', err)
      });
    }

    // Visitas
    if (this.esAdmin) {
      // Calculamos la fecha actual en YYYY-MM-DD
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, '0');
      const day = String(hoy.getDate()).padStart(2, '0');
      const fechaHoy = `${year}-${month}-${day}`;

      // Pedimos las visitas de hoy, hasta 100 para el dashboard
      this.visitaService.getVisitas(1, 100, fechaHoy, fechaHoy).subscribe({
        next: (response) => this.procesarVisitas(response.items || []),
        error: (err) => console.error('Error cargando todas las visitas', err)
      });
    } else {
      // Obtenemos el ID del técnico desde el token
      const tecnicoId = this.authService.obtenerTecnicoId(); 
      if (!tecnicoId) return; // Si no hay ID, no cargamos nada

      // Obtenemos detalles del técnico para saber si es externo
      this.tecnicoService.getTecnico(tecnicoId).subscribe({
        next: (tecnico) => {
          this.esExterno = tecnico.esExterno;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando detalles del técnico', err)
      });

      // Calculamos la fecha actual en YYYY-MM-DD
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, '0');
      const day = String(hoy.getDate()).padStart(2, '0');
      const fechaHoy = `${year}-${month}-${day}`;

      this.visitaService.getVisitasPorFecha(tecnicoId, fechaHoy).subscribe({
        next: (visitas) => this.procesarVisitas(visitas),
        error: (err) => console.error('Error cargando agenda del técnico', err)
      });
    }
  }

  procesarVisitas(visitas: any[]) {
    if (!visitas) return;

    // Ya vienen filtradas por hoy desde el backend, así que agendaHoy es directamente visitas.
    this.agendaHoy = visitas;

    this.visitasHoy = this.agendaHoy.length;
    this.visitasPendientes = this.agendaHoy.filter((v: any) => v.estado === 0 || v.estado === 1).length;

    // Ordenar agenda de hoy por hora
    this.agendaHoy.sort((a, b) => new Date(a.fechaVisita).getTime() - new Date(b.fechaVisita).getTime());
    
    // Dejar solo las proximas 3 (las pendientes)
    this.proximasVisitas = this.agendaHoy
      .filter((v: any) => v.estado === 0 || v.estado === 1) // Solo programada o en camino
      .slice(0, 3);
      
    this.cdr.detectChanges();
  }

  obtenerClaseEstado(estado: number): string {
    switch (estado) {
      case 0: return 'badge bg-warning text-dark'; // Programada
      case 1: return 'badge bg-info text-dark'; // En camino
      case 2: return 'badge bg-success'; // Completada
      case 3: return 'badge bg-danger'; // Cancelada
      case 4: return 'badge bg-secondary'; // Fallida
      default: return 'badge bg-light text-dark';
    }
  }
}
