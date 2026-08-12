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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.formulario.invalid) {
      return;
    }

    this.cargando = true;

    this.authService.login(this.formulario.value).subscribe({
      next: () => {
        // Si C# nos da el OK y nos entrega el token, vamos al panel principal
        this.cargando = false;
        this.router.navigate(['/clientes']);
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