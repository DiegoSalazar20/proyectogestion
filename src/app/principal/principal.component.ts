import { Component, OnInit} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  imports: [MenuComponent, CommonModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent implements OnInit{

  nombreUsuario: string | null = null;

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('nombre'); 
  }
}
