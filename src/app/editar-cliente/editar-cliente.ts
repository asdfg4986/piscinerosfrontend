import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../services/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-cliente.html',
  styleUrl: './editar-cliente.scss'
})
export class EditarCliente implements OnInit {
  formulario: FormGroup;
  clienteId!: number;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute // Herramienta para leer la URL
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      comuna: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Leer el ID de la URL
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Cargar los datos del cliente desde el backend
    this.clienteService.getCliente(this.clienteId).subscribe({
      next: (datos) => {
        // Llenar el formulario con los datos que llegaron
        this.formulario.patchValue({
          nombre: datos.nombre,
          direccion: datos.direccion,
          comuna: datos.comuna
        });
      },
      error: (err) => console.error('Error al cargar cliente:', err)
    });
  }

  actualizar() {
    if (this.formulario.valid) {
      
      // Creamos un nuevo objeto que junta el ID con los datos del formulario
      const datosCompletos = {
        id: this.clienteId, // Añadimos el ID explícitamente
        ...this.formulario.value // Desempaquetamos nombre, direccion y comuna
      };

      // Enviamos 'datosCompletos' en lugar de 'this.formulario.value'
      this.clienteService.actualizarCliente(this.clienteId, datosCompletos).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Actualizado!',
            text: 'Los datos del cliente se modificaron correctamente.',
            icon: 'success',
            confirmButtonColor: '#198754'
          }).then(() => {
            this.router.navigate(['/clientes']);
          });
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}