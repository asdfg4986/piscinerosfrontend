import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../services/cliente';
import { VisitaService } from '../services/visita';
import { TecnicoService } from '../services/tecnico';
import { forkJoin } from 'rxjs';

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
  
  // Mapeo de estados
  estadosVisita = ['Programada', 'En Camino', 'Completada', 'Cancelada', 'Fallida'];

  constructor(
    private clienteService: ClienteService,
    private visitaService: VisitaService,
    private tecnicoService: TecnicoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // Usamos forkJoin para hacer las peticiones en paralelo
    forkJoin({
      clientes: this.clienteService.getClientes(),
      visitas: this.visitaService.getVisitas(),
      tecnicos: this.tecnicoService.getTecnicos()
    }).subscribe({
      next: (datos) => {
        this.totalClientes = datos.clientes.length;
        this.tecnicosActivos = datos.tecnicos.length;

        // Procesar visitas
        const hoy = new Date();
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);

        // 0 = Programada, 1 = En Camino
        this.visitasPendientes = datos.visitas.filter((v: any) => v.estado === 0 || v.estado === 1).length;

        this.agendaHoy = datos.visitas.filter((v: any) => {
          const fechaVisita = new Date(v.fechaVisita);
          return fechaVisita >= inicioHoy && fechaVisita <= finHoy;
        });

        this.visitasHoy = this.agendaHoy.length;

        // Ordenar agenda de hoy por hora
        this.agendaHoy.sort((a, b) => new Date(a.fechaVisita).getTime() - new Date(b.fechaVisita).getTime());
      },
      error: (err) => console.error('Error cargando el dashboard', err)
    });
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
