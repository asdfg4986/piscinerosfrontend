import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TecnicoService } from '../services/tecnico';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tecnicos-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tecnicos-nuevo.html'
})
export class TecnicosNuevo {
  formulario: FormGroup;
  cargando = false;

  private fb = inject(FormBuilder);
  private tecnicoService = inject(TecnicoService);
  private router = inject(Router);
  private location = inject(Location);

  constructor() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      rut: [''],
      telefono: [''],
      montoPorVisita: [0, [Validators.required, Validators.min(0)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.tecnicoService.crearTecnico(this.formulario.value).subscribe({
      next: () => {
        this.cargando = false;
        Swal.fire('¡Éxito!', 'Técnico creado correctamente.', 'success')
          .then(() => {
            // Ideally navigate to tecnicos list, but since we don't have one, go to dashboard
            this.router.navigate(['/dashboard']); 
          });
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error creando técnico:', err);
        Swal.fire('Error', 'Hubo un problema al crear el técnico. Verifica los datos o que la contraseña cumpla los requisitos.', 'error');
      }
    });
  }

  cancelar() {
    this.location.back();
  }
}
