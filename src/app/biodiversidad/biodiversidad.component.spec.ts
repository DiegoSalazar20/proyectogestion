import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiodiversidadComponent } from './biodiversidad.component';

describe('BiodiversidadComponent', () => {
  let component: BiodiversidadComponent;
  let fixture: ComponentFixture<BiodiversidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiodiversidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiodiversidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
