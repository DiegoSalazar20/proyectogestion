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


  constructor(private router: Router, private http: HttpClient) {}

  usuario = {
    idUsuario: 0,
    nombre: '',
    apellido: '',
    correo: '',
    contrasenia: '',
    idRol: 1
  };

  // Función para manejar el submit del formulario
  onSubmit() {
    if (this.usuario.nombre && this.usuario.apellido && this.usuario.correo && this.usuario.contrasenia) {
      this.registrarUsuario(this.usuario).subscribe(
        response => {
          console.log('Usuario registrado correctamente', response);
          this.redirigir('/principal');
        },
        error => {
          console.error('Error al registrar el usuario', error);
        }
      );
    } else {
      console.log('Por favor, completa todos los campos');
    }
  }

  registrarUsuario(usuario: any): Observable<any> {
    const url = 'https://localhost:7004/api/Cliente/Registrar';
    return this.http.post(url, usuario);
  }

  // Función para limpiar el formulario después de enviar los datos
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
