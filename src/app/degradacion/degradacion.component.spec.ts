import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegradacionComponent } from './degradacion.component';

describe('DegradacionComponent', () => {
  let component: DegradacionComponent;
  let fixture: ComponentFixture<DegradacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DegradacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DegradacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
