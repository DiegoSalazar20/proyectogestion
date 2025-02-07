import { Routes } from '@angular/router';
import { PrincipalComponent } from './principal/principal.component';
import { EcosistemasComponent } from './ecosistemas/ecosistemas.component';
import { BosquesComponent } from './bosques/bosques.component';
import { DesertificacionComponent } from './desertificacion/desertificacion.component';
import { DegradacionComponent } from './degradacion/degradacion.component';
import { BiodiversidadComponent } from './biodiversidad/biodiversidad.component';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { RegistroComponent } from './registro/registro.component';
import { IniciosesionComponent } from './iniciosesion/iniciosesion.component';

export const routes: Routes = [
    { path: '', redirectTo: 'principal', pathMatch: 'full' }, 
    { path: 'principal', component: PrincipalComponent },
    { path: 'ecosistemas', component: EcosistemasComponent },
    { path: 'bosques', component: BosquesComponent },
    { path: 'desertificacion', component: DesertificacionComponent },
    { path: 'degradacion', component: DegradacionComponent },
    { path: 'biodiversidad', component: BiodiversidadComponent },
    { path: 'publicaciones', component: PublicacionesComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'iniciosesion', component: IniciosesionComponent },
  ];