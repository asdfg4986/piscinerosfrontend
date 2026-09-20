import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { DatePipe, Location, CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitas-agenda-detalle',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './visitas-agenda-detalle.html',
  styleUrl: './visitas-agenda-detalle.scss',
})
export class VisitasAgendaDetalle implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  visitaService = inject(VisitaService);
  location = inject(Location);

  visitaId!: number;
  visitaActual: any = null;

  ngOnInit() {
    this.visitaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatosVisita();
  }

  cargarDatosVisita() {
    this.visitaService.getVisita(this.visitaId).subscribe({
      next: (data) => {
        this.visitaActual = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar la visita', err)
    });
  }

  volver() {
    this.location.back();
  }

  getEstadoInfo() {
    if (!this.visitaActual) return { texto: '', clase: '', icono: '' };
    
    switch (this.visitaActual.estado) {
      case 2: return { texto: 'Visita Completada', clase: 'bg-success', icono: 'bi-check-circle-fill' };
      case 3: return { texto: 'Visita Cancelada', clase: 'bg-danger', icono: 'bi-slash-circle-fill' };
      case 4: return { texto: 'Visita Fallida', clase: 'bg-dark', icono: 'bi-x-circle-fill' };
      default: return { texto: 'Detalle de Visita', clase: 'bg-secondary', icono: 'bi-info-circle-fill' };
    }
  }
}
