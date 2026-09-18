import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-visitas-agenda-tecnico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-agenda-tecnico.html',
  styleUrl: './visitas-agenda-tecnico.scss',
})
export class VisitasAgendaTecnico implements OnInit {
  visitaService = inject(VisitaService);
  authService = inject(AuthService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  tecnicoId = 1; // ID del técnico actual
  visitas: any[] = [];
  cargando = false;
  esAdmin = false;
  
  // Variable que almacena la fecha seleccionada (formato YYYY-MM-DD)
  fechaSeleccionada: string = '';
  
  ngOnInit() {
    this.esAdmin = this.authService.esAdministrador();
    // Inicializamos con la fecha de hoy
    this.fechaSeleccionada = this.obtenerFechaIso(new Date());
    this.cargarVisitas();
  }

  // Convierte un objeto Date a texto YYYY-MM-DD sin problemas de zona horaria local
  obtenerFechaIso(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarVisitas() {
    this.cargando = true;
    
    // Si es administrador, cargamos todas las visitas y las filtramos localmente por fecha
    if (this.esAdmin) {
      this.visitaService.getVisitas().subscribe({
        next: (data) => {
          // Filtrar las visitas por la fecha seleccionada
          this.visitas = data.filter((v: any) => {
            const fechaObj = new Date(v.fechaVisita);
            const fechaStr = this.obtenerFechaIso(fechaObj);
            return fechaStr === this.fechaSeleccionada;
          });
          
          // Ordenar por hora
          this.visitas.sort((a, b) => new Date(a.fechaVisita).getTime() - new Date(b.fechaVisita).getTime());

          console.log('Todas las visitas (Admin):', this.visitas);
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando agenda total', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Si es un técnico, simulamos ID 1 por ahora y obtenemos solo las suyas
      this.visitaService.getVisitasPorFecha(this.tecnicoId, this.fechaSeleccionada).subscribe({
        next: (data) => {
          console.log('Visitas del técnico:', data);
          this.visitas = data;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando agenda', err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Función para cambiar de día al hacer clic en los botones
  cambiarDia(dias: number) {
    const [year, month, day] = this.fechaSeleccionada.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    fechaObj.setDate(fechaObj.getDate() + dias);
    
    this.fechaSeleccionada = this.obtenerFechaIso(fechaObj);
    this.cargarVisitas(); // Volvemos a consultar a C# con la nueva fecha
  }

  irAEjecucion(visita: any) {
    if (visita.estado === 2) {
      this.router.navigate(['/agenda/detalle', visita.id]);
    } else {
      this.router.navigate(['/agenda/ejecutar', visita.id]);
    }
  }
}