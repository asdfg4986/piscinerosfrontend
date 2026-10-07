import { Component, OnInit, ChangeDetectorRef, inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import imageCompression from 'browser-image-compression';
import SignaturePad from 'signature_pad';
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
  
  // Tareas realizadas
  tareas = {
    cloro: false,
    ph: false,
    retrolavado: false,
    canastillos: false,
    aspirado: false,
    cepillado: false,
    llaves: false,
    llenando: false
  };
  
  // Variables para la cámara
  fotoPreview: string | ArrayBuffer | null = null;
  archivoComprimido: File | null = null;
  procesando = false;

  // Variables para la firma
  @ViewChild('canvasFirma') canvasFirma!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  mostrarModalFirma = false;
  archivoFirma: File | null = null;
  firmaPreview: string | null = null;

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

  abrirModalFirma() {
    this.mostrarModalFirma = true;
    setTimeout(() => {
        this.initSignaturePad();
    }, 100);
  }

  cerrarModalFirma() {
    this.mostrarModalFirma = false;
    this.cdr.detectChanges();
  }

  initSignaturePad() {
    if (this.canvasFirma && this.canvasFirma.nativeElement) {
      const canvas = this.canvasFirma.nativeElement;
      // Ajuste para pantallas retina (DPI)
      const ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      
      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
      });
    }
  }

  limpiarFirma() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  async guardarFirma() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const dataURL = this.signaturePad.toDataURL('image/png');
      this.firmaPreview = dataURL;
      
      try {
        // Convertir dataURL a File
        const res = await fetch(dataURL);
        const blob = await res.blob();
        this.archivoFirma = new File([blob], `firma_${this.visitaId}.png`, { type: 'image/png' });
        this.cerrarModalFirma();
        this.cdr.detectChanges(); // Forzar la actualización de la UI para cerrar el modal de inmediato
      } catch (error) {
        console.error("Error convirtiendo la firma:", error);
      }
    } else {
      Swal.fire('Atención', 'El lienzo está vacío. Dibuja una firma o cancela.', 'warning');
    }
  }

  eliminarFirma() {
      this.archivoFirma = null;
      this.firmaPreview = null;
  }

  finalizarTrabajo() {
    if (!this.archivoComprimido) {
      Swal.fire('Atención', 'Debes tomar una foto de evidencia para finalizar.', 'warning');
      return;
    }

    this.procesando = true;

    // 1. Subimos la foto al endpoint
    this.visitaService.subirFotoVisita(this.visitaId, this.archivoComprimido).subscribe({
      next: (response) => {
        const fotoUrl = response.url;
        
        // 2. Si hay firma, subirla
        if (this.archivoFirma) {
            this.visitaService.subirFirmaVisita(this.visitaId, this.archivoFirma).subscribe({
                next: (firmaRes) => {
                    this.actualizarVisitaFinal(fotoUrl, firmaRes.url);
                },
                error: (err) => {
                    console.error("Error al subir firma:", err);
                    this.manejarError();
                }
            });
        } else {
            this.actualizarVisitaFinal(fotoUrl, null);
        }
      },
      error: (err) => {
         console.error("Error al subir foto:", err);
         this.manejarError();
      }
    });
  }

  actualizarVisitaFinal(fotoUrl: string, firmaUrl: string | null) {
    const { cliente, tecnico, ...visitaLimpia } = this.visitaActual;
    const visitaActualizada: any = { 
      ...visitaLimpia, 
      estado: 2,
      fotoUrl: fotoUrl,
      observaciones: this.observacionesFinales,
      cloro: this.tareas.cloro,
      ph: this.tareas.ph,
      retrolavado: this.tareas.retrolavado,
      canastillos: this.tareas.canastillos,
      aspirado: this.tareas.aspirado,
      cepillado: this.tareas.cepillado,
      llaves: this.tareas.llaves,
      llenando: this.tareas.llenando
    };
    
    if (firmaUrl) {
      visitaActualizada.firmaClienteUrl = firmaUrl;
    }
    
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
