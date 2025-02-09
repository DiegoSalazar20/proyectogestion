import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {

  mensajeError: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  usuario = {
    idUsuario: 0,
    nombre: '',
    apellido: '',
    correo: '',
    contrasenia: '',
    idRol: 1
  };

  onSubmit() {
    this.mensajeError=null;
    if (this.usuario.nombre && this.usuario.apellido && this.usuario.correo && this.usuario.contrasenia) {
      this.registrarUsuario(this.usuario).subscribe(
        response => {
          if (response.success) {
            console.log('Usuario registrado correctamente', response.message);
            this.redirigir('/iniciosesion');
          } else {
            this.mensajeError = response.message; 
          }
        },
        error => {
          this.mensajeError = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
      );
    } else {
      this.mensajeError = 'Quedan campos vacíos';
    }
  }
  

  registrarUsuario(usuario: any): Observable<any> {
    const url = 'https://localhost:7004/api/Cliente/Registrar';
    return this.http.post(url, usuario);
  }


  limpiarFormulario() {
    this.usuario = {
      idUsuario: 0,
      nombre: '',
      apellido: '',
      correo: '',
      contrasenia: '',
      idRol: 1,
    };
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
