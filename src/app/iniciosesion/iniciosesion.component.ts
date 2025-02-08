import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-iniciosesion',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './iniciosesion.component.html',
  styleUrl: './iniciosesion.component.scss'
})
export class IniciosesionComponent {


  constructor(private router: Router, private http: HttpClient) { }

  usuario = {
    correo: '',
    contrasenia: ''
  };

  onSubmit() {
    if (this.usuario.correo && this.usuario.contrasenia) {
      const loginUrl = `https://localhost:7004/api/Cliente/IniciarSesion?correo=${encodeURIComponent(this.usuario.correo)}&contrasenia=${encodeURIComponent(this.usuario.contrasenia)}`;

      this.http.get(loginUrl).subscribe(
        (response: any) => {
          if (response.idUsuario && response.nombre) {
            console.log('Inicio de sesión exitoso:', response);
            localStorage.setItem('idUsuario', response.idUsuario);
            localStorage.setItem('nombre', response.nombre);
            localStorage.setItem('idRol', response.idRol);
            this.router.navigate(['/principal']); 
          } else {
            console.log('Credenciales incorrectas');
          }
        },
        (error) => {
          if (error.status === 401) {
            console.log('Correo o contraseña incorrectos');
          } else {
            console.error('Error al iniciar sesión', error);
          }
        }
      );
    } else {
      console.log('Por favor, completa todos los campos');
    }
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
