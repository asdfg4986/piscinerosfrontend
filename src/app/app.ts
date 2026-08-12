import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Usamos inject()
  authService = inject(AuthService);
  router = inject(Router);

  cerrarSesion() {
    // 1. Destruimos el token del localStorage y la sesión del usuario
    this.authService.logout();
    
    // 2. Lo enviamos de vuelta al Login
    this.router.navigate(['/login']);
  }
}