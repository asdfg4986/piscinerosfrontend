import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TecnicoService } from '../services/tecnico';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tecnicos-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tecnicos-lista.html'
})
export class TecnicosLista implements OnInit {
  tecnicos: any[] = [];
  cargando: boolean = true;

  constructor(
    private tecnicoService: TecnicoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTecnicos();
  }

  cargarTecnicos() {
    this.cargando = true;
    this.tecnicoService.getTecnicos().subscribe({
      next: (data) => {
        this.tecnicos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando técnicos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleActivo(tecnico: any) {
    const payload = {
      id: tecnico.id,
      activo: tecnico.activo
    };
    this.tecnicoService.actualizarTecnico(tecnico.id, payload).subscribe({
      next: () => {
        console.log('Estado actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar estado', err);
        tecnico.activo = !tecnico.activo;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEsExterno(tecnico: any) {
    const payload = {
      id: tecnico.id,
      esExterno: tecnico.esExterno
    };
    this.tecnicoService.actualizarTecnico(tecnico.id, payload).subscribe({
      next: () => {
        console.log('Tipo actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar tipo', err);
        tecnico.esExterno = !tecnico.esExterno;
        this.cdr.detectChanges();
      }
    });
  }
}
