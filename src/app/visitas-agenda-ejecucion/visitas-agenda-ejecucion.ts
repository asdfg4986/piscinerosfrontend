import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import imageCompression from 'browser-image-compression';
import Swal from 'sweetalert2';
import { DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visitas-agenda-ejecucion',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './visitas-agenda-ejecucion.html',
  styleUrl: './visitas-agenda-ejecucion.scss',
})
export class VisitasAgendaEjecucion implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  visitaService = inject(VisitaService);
  location = inject(Location); // Para volver a la pantalla anterior

  visitaId!: number;
  visitaActual: any = null;
  observacionesFinales: string = ''; // Espacio en blanco inicial
  
  // Variables para la cámara
  fotoPreview: string | ArrayBuffer | null = null;
  archivoComprimido: File | null = null;
  procesando = false;

  ngOnInit() {
    this.visitaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatosVisita();
  }

  cargarDatosVisita() {
    this.visitaService.getVisita(this.visitaId).subscribe({
      next: (data) => {
        this.visitaActual = data;
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (err) => console.error('Error al cargar la visita', err)
    });
  }

  async onFotoTomada(event: any) {
    console.log('Paso 1: Evento disparado (El navegador detectó el archivo)');
    
    const archivoOriginal = event.target.files[0];
    if (!archivoOriginal) {
      console.warn('No se seleccionó ningún archivo');
      return;
    }
  
    console.log(`Paso 2: Archivo original: ${archivoOriginal.name} (${(archivoOriginal.size / 1024 / 1024).toFixed(2)} MB)`);
  
    const opciones = {
      maxSizeMB: 0.3, 
      maxWidthOrHeight: 1280,
      useWebWorker: false // Mantenemos esto en false para evitar el error anterior
    };
  
    try {
      this.procesando = true;
      console.log('Paso 3: Iniciando compresión...');
      
      this.archivoComprimido = await imageCompression(archivoOriginal, opciones);
      
      console.log(`Paso 4: Compresión exitosa. Nuevo tamaño: ${(this.archivoComprimido.size / 1024).toFixed(2)} KB`);
    
      const reader = new FileReader();
      reader.readAsDataURL(this.archivoComprimido);
      reader.onload = () => {
        console.log('Paso 5: Vista previa generada correctamente en memoria');
        this.fotoPreview = reader.result;
        this.procesando = false;
        this.cdr.detectChanges(); // Forzar la detección de cambios en la UI
      };
    } catch (error) {
      console.error('Error fatal durante la compresión:', error);
      this.procesando = false;
      this.cdr.detectChanges(); // Forzar la detección de cambios en la UI
      Swal.fire('Error', 'No se pudo procesar la foto', 'error');
    } finally {
      // EL TRUCO MÁGICO: Limpiamos el input para que puedas volver a elegir la misma foto si quieres
      event.target.value = ''; 
    }
  }

  finalizarTrabajo() {
    if (!this.archivoComprimido) {
      Swal.fire('Atención', 'Debes tomar una foto de evidencia para finalizar.', 'warning');
      return;
    }

    this.procesando = true;

    // 1. Subimos la foto al endpoint que hicimos en C# (y que C# envía a Azure)
    this.visitaService.subirFotoVisita(this.visitaId, this.archivoComprimido).subscribe({
      next: (response) => {
        // 2. Si la foto subió bien, cambiamos el estado de la visita a Completada (2)
        // Y muy importante: quitamos los objetos cliente/tecnico para que el backend (Entity Framework) no se confunda
        // y asignamos la URL de la foto que recién nos respondió Azure.
        const { cliente, tecnico, ...visitaLimpia } = this.visitaActual;
        const visitaActualizada = { 
          ...visitaLimpia, 
          estado: 2,
          fotoUrl: response.url,
          observaciones: this.observacionesFinales // Aquí enviamos las observaciones nuevas (o vacío)
        };
        
        this.visitaService.actualizarVisita(this.visitaId, visitaActualizada).subscribe({
          next: () => {
            this.procesando = false;
            Swal.fire('¡Excelente!', 'Trabajo finalizado y evidencia guardada.', 'success')
              .then(() => this.volver());
          },
          error: (err) => {
             console.error("Error al actualizar la visita:", err);
             this.manejarError();
          }
        });
      },
      error: (err) => {
         console.error("Error al subir foto:", err);
         this.manejarError();
      }
    });
  }

  manejarError() {
    this.procesando = false;
    this.cdr.detectChanges(); // Ensure UI updates on error
    Swal.fire('Error', 'Hubo un problema al guardar la visita. Intenta de nuevo.', 'error');
  }

  volver() {
    this.location.back(); // Vuelve a la agenda
  }
}
