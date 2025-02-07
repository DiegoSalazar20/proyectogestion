import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{

  idUsuario: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.idUsuario = localStorage.getItem('idUsuario');
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }

  manejarSesion() {
    if (this.idUsuario) {
      localStorage.removeItem('idUsuario');
      localStorage.removeItem('nombre');  
      this.idUsuario = null;
      window.location.reload();
    } else {
      this.router.navigate(['/iniciosesion']); 
    }
  }

}


