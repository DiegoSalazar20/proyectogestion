import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { isPlatformBrowser } from '@angular/common';

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
  idRolActual: number = 0;

  private apiUrl = 'https://localhost:7004/api/Publicacion/Registrar';
  private imgbbApiKey = 'd60d30663d0738e998fef145e02b387a';
  private imgbbUrl = 'https://api.imgbb.com/1/upload';
  private respuestaUrl = 'https://localhost:7004/api/Respuesta/Registrar';

  mostrarModal: boolean = false;
  mostrarModalComentario: boolean = false;
  mostrarModalError: boolean = false;
  mostrarModalErrorTexto: boolean =false;
  mostrarExitoEstado:boolean =false;
  errorPublicaciones:boolean=false;

  modalVisible = false;
  respuestasActuales: any[] = [];
  publicacionSeleccionada: any;

  
  idUsuarioActual :string | null=null;
  publicacionAEliminar: any = null;
  comentarioAEliminar: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: object) { }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuarioActual = localStorage.getItem('idUsuario');
      this.idRolActual = Number(localStorage.getItem('idRol')) || 0;
    }
    this.obtenerPublicaciones();
  }

  obtenerPublicaciones() {
    var idRolActual: number = 0;
    if(isPlatformBrowser(this.platformId)){
      idRolActual = this.idRolActual;
    }
  
    this.http.get<any[]>('https://localhost:7004/api/Publicacion/todos').subscribe({
      next: (data) => {
        this.publicaciones = idRolActual === 2 ? data : data.filter(p => p.activo);
  
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
        this.errorPublicaciones=true;
      }
    });
  }
  

  togglePublicacion(pub: any) {
    const apiUrl = pub.activo
      ? `https://localhost:7004/api/Publicacion/Cerrar?idPublicacion=${pub.idPublicacion}`
      : `https://localhost:7004/api/Publicacion/Abrir?idPublicacion=${pub.idPublicacion}`;
  
    this.http.put(apiUrl, {}).subscribe({
      next: () => {
        pub.activo = !pub.activo; 
        this.mostrarExito();
      },
      error: (err) => {
        console.error('Error al cambiar estado de la publicación:', err);
        alert('No se pudo cambiar el estado de la publicación.');
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
      this.mostrarErrorTexto();
      return;
    }
    
    const idUsuario = Number(this.idUsuarioActual);

    if(idUsuario==0){
      this.mostrarError();
      return;
    }


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
      this.enviarPublicacion(idUsuario, '');
    }
  }

  enviarPublicacion(id: Number, imageUrl: string) {
    const idUsuario = Number(id);
    this.getUsuarioById(idUsuario).subscribe({
      next: (usuario) => {
        const nuevaPub = {
          idPublicacion: 0,
          idUsuario: idUsuario,
          texto: this.nuevaPublicacion.texto,
          imagen: imageUrl,
          nombreUsuario: `${usuario.nombre} ${usuario.apellido}`,
          fecha: new Date().toISOString()
        };

        this.http.post<boolean>(this.apiUrl, nuevaPub).subscribe({
          next: (publicacionGuardada: boolean) => {
            if (publicacionGuardada === true) {
              this.nuevaPublicacion.texto = '';
              this.imagenSeleccionada = null;
              this.cdr.detectChanges();

              this.publicaciones.unshift(nuevaPub);
              
              this.publicaciones=[];
              this.obtenerPublicaciones();
            }
          },
          error: (err) => {
            console.error('Error enviando publicación:', err);
            alert('Hubo un error al enviar la publicación.');
          }
        });
      },
      error: (err) => {
        console.error('Error obteniendo datos del usuario:', err);
        alert('No se pudo obtener el nombre del usuario.');
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
      this.mostrarErrorTexto();
      return;
    }
    const idUsuario = Number(this.idUsuarioActual);

    if(idUsuario==0){
      this.mostrarError();
      return;
    }

    const nuevaResp = {
      idRespuesta: 0, 
      idPublicacion: this.publicacionSeleccionada.idPublicacion,
      idUsuario: idUsuario,
      texto: this.nuevaRespuesta.texto,
      fecha: new Date().toISOString()
    };

    // Enviar la respuesta al servidor
    this.http.post<boolean>(this.respuestaUrl, nuevaResp).subscribe({
      next: (respuestaGuardada: boolean) => {
        if (respuestaGuardada === true) {
          const respuestaConUsuario = {
            ...nuevaResp,
            idRespuesta: this.respuestasActuales.length + 1, 
            nombreUsuario: '' 
          };

          this.getUsuarioById(idUsuario).subscribe({
            next: (usuario) => {
              respuestaConUsuario.nombreUsuario = `${usuario.nombre} ${usuario.apellido}`;
              this.respuestasActuales.unshift(respuestaConUsuario);
              this.nuevaRespuesta.texto = '';
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

  confirmarEliminar(publicacion: any): void {
    this.publicacionAEliminar = publicacion;
    this.mostrarModal = true;
  }

  confirmarEliminarComentario(comentario: any): void {
    this.comentarioAEliminar = comentario;
    this.mostrarModalComentario = true;
  }

  mostrarError(): void {
    this.mostrarModalError = true;
  }

  mostrarErrorTexto(): void {
    this.mostrarModalErrorTexto = true;
  }

  mostrarExito(): void {
    this.mostrarExitoEstado=true;
  }

  cerrarExito(): void {
    this.mostrarExitoEstado=false;
  }

  cerrarError(): void {
    this.mostrarModalError = false;
  }

  cerrarErrorTexto(): void {
    this.mostrarModalErrorTexto = false;
  }

  cancelarEliminarComentario(): void {
    this.mostrarModalComentario = false;
    this.comentarioAEliminar = null;
  }

  cancelarEliminar(): void {
    this.mostrarModal = false;
    this.publicacionAEliminar = null;
  }

  eliminarPublicacion(): void {
    if (this.publicacionAEliminar) {
      this.http.put(`https://localhost:7004/api/Publicacion/Cerrar?idPublicacion=${this.publicacionAEliminar.idPublicacion}`, {}).subscribe(
        () => {
          this.publicaciones = this.publicaciones.filter(pub => pub.idPublicacion !== this.publicacionAEliminar.idPublicacion);
          this.publicacionAEliminar = null;
          this.mostrarModal=false;
        },
        error => {
          console.error('Error al eliminar publicación', error);
        }
      );
    }
  }


  eliminarComentario(): void {
    if (this.comentarioAEliminar !== null) {
      const url = `https://localhost:7004/api/Respuesta/Eliminar/${this.comentarioAEliminar.idRespuesta }`;
  
      this.http.delete(url).subscribe(
        () => {
          // Filtrar para eliminar el comentario de la lista
          this.respuestasActuales = this.respuestasActuales.filter(resp => resp.idRespuesta !== this.comentarioAEliminar.idRespuesta);
          this.comentarioAEliminar = null;
          this.mostrarModalComentario = false;
        },
        error => {
          console.error('Error al eliminar comentario', error);
        }
      );
    }
  }
  

}
