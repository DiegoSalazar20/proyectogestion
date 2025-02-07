import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, HttpClientModule],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.scss'
})
export class PublicacionesComponent implements OnInit {
  publicaciones: any[] = [];
  nuevaPublicacion = { texto: '', imagen: '' };

  modalVisible = false; // Controla la visibilidad del modal
  respuestasActuales: any[] = []; // Almacena las respuestas para el modal
  publicacionSeleccionada: any; // Almacena la publicación seleccionada

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.obtenerPublicaciones();
  }

  obtenerPublicaciones() {
    this.http.get<any[]>('https://localhost:7004/api/Publicacion/todos').subscribe({
      next: (data) => {
        this.publicaciones = data.filter(p => p.activo);
      },
      error: (err) => {
        console.error('Error obteniendo publicaciones:', err);
      }
    });
  }

  publicar() {
    if (this.nuevaPublicacion.texto.trim() !== '') {
      const nueva = {
        idPublicacion: this.publicaciones.length + 1,
        idUsuario: 1,
        texto: this.nuevaPublicacion.texto,
        imagen: this.nuevaPublicacion.imagen || 'https://via.placeholder.com/150',
        fecha: new Date().toISOString(),
        activo: true
      };
      this.publicaciones.unshift(nueva);
      this.nuevaPublicacion = { texto: '', imagen: '' };
    }
  }


  abrirModal(idPublicacion: number) {
    this.publicacionSeleccionada = this.publicaciones.find(p => p.idPublicacion === idPublicacion);
    if (this.publicacionSeleccionada) {
      this.http.get<any[]>(`https://localhost:7004/api/Respuesta/todos?idRespuesta=${idPublicacion}`)
        .subscribe(respuestas => {
          console.log("Respuestas recibidas:", respuestas);
          this.respuestasActuales = respuestas;
          this.modalVisible = true; // Mostrar el modal
        }, error => {
          console.error("Error obteniendo respuestas:", error);
        });
    }
  }
  
  cerrarModal() {
    this.modalVisible = false;
    this.respuestasActuales = []; // Limpiar las respuestas
  }
}
