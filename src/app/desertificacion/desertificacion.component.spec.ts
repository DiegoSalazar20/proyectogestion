import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesertificacionComponent } from './desertificacion.component';

describe('DesertificacionComponent', () => {
  let component: DesertificacionComponent;
  let fixture: ComponentFixture<DesertificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesertificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
