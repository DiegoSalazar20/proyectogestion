import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosquesComponent } from './bosques.component';

describe('BosquesComponent', () => {
  let component: BosquesComponent;
  let fixture: ComponentFixture<BosquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BosquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BosquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
