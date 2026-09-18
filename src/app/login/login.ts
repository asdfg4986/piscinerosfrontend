import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  formulario: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Creamos el formulario con validaciones básicas
    this.formulario = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.formulario.invalid) {
      return;
    }

    this.cargando = true;

    // Clonar los datos del formulario para modificarlos antes de enviar
    const credenciales = { ...this.formulario.value };
    
    // Si el usuario no escribió un '@', le agregamos el dominio por defecto
    if (!credenciales.email.includes('@')) {
      credenciales.email += '@piscineros.cl';
    }

    this.authService.login(credenciales).subscribe({
      next: () => {
        // Si C# nos da el OK y nos entrega el token, vamos al panel principal
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error en login:', err);
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: 'El correo o la contraseña son incorrectos.'
        });
      }
    });
  }
}