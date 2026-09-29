import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente';
import { ConfiguracionService } from '../services/configuracion';
import { TecnicoService } from '../services/tecnico';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-cliente.html',
  styleUrl: './nuevo-cliente.scss'
})
export class NuevoCliente implements OnInit {
  formulario: FormGroup;
  configuracionService = inject(ConfiguracionService);
  tecnicoService = inject(TecnicoService);
  comunas: any[] = [];
  tecnicosExternos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Configuramos los campos y validaciones
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      numeroClienteLegacy: [''],
      direccion: ['', Validators.required],
      comuna: ['', Validators.required],
      telefono: [''],
      correo: [''],
      tecnicoExternoId: [null]
    });
  }

  ngOnInit(): void {
    this.cargarComunas();
    this.cargarTecnicosExternos();
  }

  cargarComunas() {
    this.configuracionService.getComunas().subscribe({
      next: (datos) => {
        this.comunas = datos;
        this.cdr.detectChanges(); // Forzamos la detección de cambios
      },
      error: (err) => console.error('Error al cargar comunas:', err)
    });
  }

  cargarTecnicosExternos() {
    this.tecnicoService.getTecnicos().subscribe({
      next: (datos) => {
        this.tecnicosExternos = datos.filter((t: any) => t.activo && t.esExterno);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar técnicos:', err)
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
          if (err.status === 400 && err.error?.mensaje) {
            Swal.fire('Error', err.error.mensaje, 'error');
          } else {
            Swal.fire('Error', 'Hubo un problema al guardar el cliente', 'error');
          }
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}