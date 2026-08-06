import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClienteService } from './services/cliente';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  
  clientes: any[] = [];

  // Inyectamos ChangeDetectorRef
  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe({
      next: (datos) => {
        // Guardamos los datos
        this.clientes = datos;
        
        // Le avisamos a Angular que debe actualizar el HTML
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al conectar con la API:', err);
      }
    });
  }
}