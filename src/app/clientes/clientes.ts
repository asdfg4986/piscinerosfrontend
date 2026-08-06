import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ClienteService } from '../services/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes implements OnInit {
  clientes: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe({
      next: (datos) => {
        this.clientes = datos;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al conectar con la API:', err);
      }
    });
  }
}