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
  imagenSeleccionada: File | null = null;
  private apiUrl = 'https://localhost:7004/api/Publicacion/Registrar';
  private imgbbApiKey = 'd60d30663d0738e998fef145e02b387a';
  private imgbbUrl = 'https://api.imgbb.com/1/upload';

  modalVisible = false; 
  respuestasActuales: any[] = []; 
  publicacionSeleccionada: any; 

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

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  publicar() {
    if (!this.nuevaPublicacion.texto.trim()) {
      alert('El texto de la publicación no puede estar vacío.');
      return;
    }

    const idUsuario = localStorage.getItem('idUsuario') || '0';

    if (this.imagenSeleccionada) {
      const formData = new FormData();
      formData.append('image', this.imagenSeleccionada);
      formData.append('key', this.imgbbApiKey);

      this.http.post<any>(this.imgbbUrl, formData).subscribe({
        next: (response) => {
          const imageUrl = response.data.url;
          this.enviarPublicacion(idUsuario, imageUrl);
        },
        error: (err) => {
          console.error('Error subiendo imagen:', err);
          alert('No se pudo subir la imagen.');
        }
      });
    } else {
      this.enviarPublicacion(idUsuario, 'https://via.placeholder.com/150');
    }
  }

  enviarPublicacion(idUsuario: string, imageUrl: string) {
    const nueva = {
      idPublicacion: 0,
      idUsuario: Number(idUsuario),
      texto: this.nuevaPublicacion.texto,
      imagen: imageUrl,
      fecha: new Date().toISOString(),
      activo: true
    };

    this.http.post(this.apiUrl, nueva).subscribe({
      next: () => {
        this.publicaciones.unshift(nueva);
        this.nuevaPublicacion = { texto: '', imagen: '' };
        this.imagenSeleccionada = null;
      },
      error: (err) => {
        console.error('Error publicando:', err);
        alert('Hubo un error al publicar.');
      }
    });
  }


  abrirModal(idPublicacion: number) {
    this.publicacionSeleccionada = this.publicaciones.find(p => p.idPublicacion === idPublicacion);
    if (this.publicacionSeleccionada) {
      this.http.get<any[]>(`https://localhost:7004/api/Respuesta/todos?idRespuesta=${idPublicacion}`)
        .subscribe(respuestas => {
          console.log("Respuestas recibidas:", respuestas);
          this.respuestasActuales = respuestas;
          this.modalVisible = true; 
        }, error => {
          console.error("Error obteniendo respuestas:", error);
        });
    }
  }
  
  cerrarModal() {
    this.modalVisible = false;
    this.respuestasActuales = []; 
  }
}
