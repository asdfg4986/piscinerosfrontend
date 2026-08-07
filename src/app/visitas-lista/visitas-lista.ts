import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visitas-lista',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './visitas-lista.html',
  styleUrl: './visitas-lista.scss'
})
export class VisitasLista implements OnInit {
  visitas: any[] = [];
  clienteId!: number;

  constructor(
    private visitaService: VisitaService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  // Función para traducir el número del estado a texto y color
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