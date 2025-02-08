import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  imports: [MenuComponent, CommonModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent implements OnInit{
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  nombreUsuario: string | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.nombreUsuario = localStorage.getItem('nombre');
    }
  }
}
