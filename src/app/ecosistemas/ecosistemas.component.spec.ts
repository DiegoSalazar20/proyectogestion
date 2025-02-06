import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcosistemasComponent } from './ecosistemas.component';

describe('EcosistemasComponent', () => {
  let component: EcosistemasComponent;
  let fixture: ComponentFixture<EcosistemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcosistemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcosistemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
