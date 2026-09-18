import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitaService } from '../services/visita';
import { TecnicoService } from '../services/tecnico';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitas-nuevo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './visitas-nuevo.html',
  styleUrl: './visitas-nuevo.scss'
})
export class VisitasNuevo implements OnInit {
  formulario: FormGroup;
  clienteId!: number;
  tecnicos: any[] = [];
  esAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private visitaService: VisitaService,
    private tecnicoService: TecnicoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    // Configuramos el formulario con las validaciones básicas
    this.formulario = this.fb.group({
      fechaVisita: ['', Validators.required],
      tecnicoId: ['', Validators.required], // Por ahora pediremos el ID manual
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdministrador();
    // Leemos a qué cliente le estamos agendando esta visita
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.esAdmin) {
      this.cargarTecnicos(); // Cargamos los técnicos disponibles para el admin
    } else {
      // Si es un técnico, asignamos su propio ID al form y no hace falta cargar todos los técnicos
      const miId = this.authService.obtenerTecnicoId();
      this.formulario.patchValue({ tecnicoId: miId });
    }
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

  guardar() {
    if (this.formulario.valid) {
      // Armamos el objeto tal como lo espera C#
      const nuevaVisita = {
        clienteId: this.clienteId,
        estado: 0, // 0 = Programada (según tu Enum)
        ...this.formulario.value
      };

      this.visitaService.registrarVisita(nuevaVisita).subscribe({
        next: () => {
          Swal.fire('¡Agendada!', 'La visita ha sido registrada correctamente.', 'success')
            .then(() => this.volver());
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          Swal.fire('Error', 'No se pudo registrar la visita', 'error');
        }
      });
    }
  }

  volver() {
    // Regresamos a la lista de visitas de este cliente específico
    this.router.navigate(['/clientes', this.clienteId, 'visitas']);
  }
}