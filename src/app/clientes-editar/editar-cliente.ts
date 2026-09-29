import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../services/cliente';
import { ConfiguracionService } from '../services/configuracion';
import { TecnicoService } from '../services/tecnico';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-cliente.html',
  styleUrl: './editar-cliente.scss'
})
export class EditarCliente implements OnInit {
  formulario: FormGroup;
  clienteId!: number;
  configuracionService = inject(ConfiguracionService);
  tecnicoService = inject(TecnicoService);
  comunas: any[] = [];
  tecnicosExternos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute, // Herramienta para leer la URL
    private cdr: ChangeDetectorRef
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      numeroClienteLegacy: [''],
      direccion: ['', Validators.required],
      comuna: ['', Validators.required],
      telefono: ['', [Validators.pattern('^\\+569\\d{8}$')]],
      correo: [''],
      activo: [true],
      tecnicoExternoId: [null]
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
          numeroClienteLegacy: datos.numeroClienteLegacy,
          direccion: datos.direccion,
          comuna: datos.comuna,
          telefono: datos.telefono,
          correo: datos.correo,
          activo: datos.activo,
          tecnicoExternoId: datos.tecnicoExternoId
        });
        this.cargarComunas(); // Cargar comunas después de obtener los datos del cliente
        this.cargarTecnicosExternos();
      },
      error: (err) => console.error('Error al cargar cliente:', err)
    });
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
          if (err.status === 400 && err.error?.mensaje) {
            Swal.fire('Error', err.error.mensaje, 'error');
          } else {
            Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
          }
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}