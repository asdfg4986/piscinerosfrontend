import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-cliente.html',
  styleUrl: './nuevo-cliente.scss'
})
export class NuevoCliente {
  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {
    // Configuramos los campos y validaciones
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      comuna: ['', Validators.required] 
    });
  }

  guardar() {
    if (this.formulario.valid) {
      this.clienteService.crearCliente(this.formulario.value).subscribe({
        next: () => {
          // Disparamos la alerta
          Swal.fire({
            title: '¡Cliente Guardado!',
            text: 'El registro se agregó correctamente a la base de datos.',
            icon: 'success',
            confirmButtonText: 'Excelente',
            confirmButtonColor: '#198754' // Color verde de Bootstrap para mantener el estilo
          }).then(() => {
            // Volvemos a la tabla SOLO cuando el usuario cierra la alerta
            this.router.navigate(['/clientes']);
          });
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          // Alerta de error
          Swal.fire('Error', 'Hubo un problema al guardar el cliente', 'error');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}