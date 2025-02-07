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
  nuevaRespuesta = { texto: '' };
  private apiUrl = 'https://localhost:7004/api/Publicacion/Registrar';
  private imgbbApiKey = 'd60d30663d0738e998fef145e02b387a';
  private imgbbUrl = 'https://api.imgbb.com/1/upload';
  private respuestaUrl = 'https://localhost:7004/api/Respuesta/Registrar';

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
        this.publicaciones.forEach(pub => {
          this.getUsuarioById(pub.idUsuario).subscribe({
            next: (usuario) => {
              pub.nombreUsuario = `${usuario.nombre} ${usuario.apellido}`;
            },
            error: (err) => {
              console.error('Error obteniendo datos del usuario:', err);
            }
          });
        });
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
          this.respuestasActuales.forEach(resp => {
            this.getUsuarioById(resp.idUsuario).subscribe({
              next: (usuario) => {
                resp.nombreUsuario = `${usuario.nombre} ${usuario.apellido}`;
              },
              error: (err) => {
                console.error('Error obteniendo datos del usuario:', err);
              }
            });
          });
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

  enviarRespuesta() {
    if (!this.nuevaRespuesta.texto.trim()) {
      alert('La respuesta no puede estar vacía.');
      return;
    }
  
    const idUsuario = Number(localStorage.getItem('idUsuario') || '0');
  
    const nuevaResp = {
      idRespuesta: 0, // Este valor lo asignará el backend
      idPublicacion: this.publicacionSeleccionada.idPublicacion,
      idUsuario: idUsuario,
      texto: this.nuevaRespuesta.texto,
      fecha: new Date().toISOString()
    };
  
    // Enviar la respuesta al servidor
    this.http.post<boolean>(this.respuestaUrl, nuevaResp).subscribe({
      next: (respuestaGuardada: boolean) => {
        if (respuestaGuardada === true) {
          // Si el backend devuelve `true`, construye el objeto de respuesta manualmente
          const respuestaConUsuario = {
            ...nuevaResp,
            idRespuesta: this.respuestasActuales.length + 1, // Asigna un ID temporal (o usa uno real si lo tienes)
            nombreUsuario: '' // Inicialmente vacío
          };
  
          // Obtener los datos del usuario que hizo la respuesta
          this.getUsuarioById(idUsuario).subscribe({
            next: (usuario) => {
              // Agregar el nombre del usuario a la respuesta
              respuestaConUsuario.nombreUsuario = `${usuario.nombre} ${usuario.apellido}`;
              // Agregar la respuesta a la lista de respuestas actuales
              this.respuestasActuales.unshift(respuestaConUsuario);
              // Limpiar el campo de texto
              this.nuevaRespuesta.texto = '';
              // Forzar la detección de cambios
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error obteniendo datos del usuario:', err);
              alert('No se pudo obtener el nombre del usuario.');
            }
          });
        }
      },
      error: (err) => {
        console.error('Error enviando respuesta:', err);
        alert('Hubo un error al enviar la respuesta.');
      }
    });
  }

  getUsuarioById(idUsuario: number) {
    return this.http.get<any>(`https://localhost:7004/api/Cliente/BuscarDatos?idUsuario=${idUsuario}`);
  }
  
}
