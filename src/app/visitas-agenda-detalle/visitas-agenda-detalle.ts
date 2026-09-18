import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-visitas-agenda-detalle',
  standalone: true,
  imports: [DatePipe],
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
}
