import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { TecnicoService } from '../services/tecnico';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visitas-editar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './visitas-editar.html',
  styleUrl: './visitas-editar.scss'
})
export class VisitasEditar implements OnInit {
  formulario: FormGroup;
  clienteId!: number;
  visitaId!: number;
  tecnicos: any[] = [];
  visita: any = null;
  
  // Creamos un arreglo con los estados exactos de tu Enum de C#
  estados = [
    { id: 0, nombre: 'Programada' },
    { id: 1, nombre: 'En Camino' },
    { id: 2, nombre: 'Completada' },
    { id: 3, nombre: 'Cancelada' },
    { id: 4, nombre: 'Fallida' }
  ];

  constructor(
    private fb: FormBuilder,
    private visitaService: VisitaService,
    private tecnicoService: TecnicoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formulario = this.fb.group({
      tecnicoId: ['', Validators.required],
      estado: ['', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('clienteId'));
    this.visitaId = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarTecnicos();
    this.cargarVisitaActual();
  }

  cargarTecnicos() {
    this.tecnicoService.getTecnicos().subscribe({
      next: (datos) => {
        this.tecnicos = datos;
        this.cdr.detectChanges(); // Forzamos la actualización de la vista
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  cargarVisitaActual() {
    this.visitaService.getVisita(this.visitaId).subscribe({
      next: (datos) => {
        this.visita = datos; // Guardar para visualizar fotos/firmas
        // Llenamos el formulario con los datos que llegaron
        this.formulario.patchValue({
          tecnicoId: datos.tecnicoId,
          estado: datos.estado,
          observaciones: datos.observaciones
        });
        this.cdr.detectChanges(); // Forzamos la actualización de la vista
      },
      error: (err) => console.error('Error al cargar la visita:', err)
    });
  }

  actualizar() {
    if (this.formulario.valid) {
      // C# requiere el ID en el cuerpo de la petición PUT
      const visitaActualizada = {
        id: this.visitaId,
        clienteId: this.clienteId,
        ...this.formulario.value
      };

      this.visitaService.actualizarVisita(this.visitaId, visitaActualizada).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', 'El estado de la visita se guardó.', 'success')
            .then(() => this.volver());
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/clientes', this.clienteId, 'visitas']);
  }
}