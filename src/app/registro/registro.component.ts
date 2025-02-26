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

    if(!this.validarCorreo(this.usuario.correo)){
      this.mensajeError='El formato del correo es inválido';
      return;
    }

    if(!this.validarContrasenia(this.usuario.contrasenia)){
      this.mensajeError='La contraseña debe tener mínimo 8 caractéres';
      return;
    }


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
          this.mensajeError = 'Ocurrió un error en el registro, inténtelo de nuevo más tarde.';
        }
      );
    } else {
      this.mensajeError = 'No pueden quedar campos vacíos';
    }
  }
  

  validarCorreo(correo: string){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  validarContrasenia(contrasenia: string){
    return contrasenia.length>=8
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
