import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasNuevo } from './visitas-nuevo';

describe('VisitasNuevo', () => {
  let component: VisitasNuevo;
  let fixture: ComponentFixture<VisitasNuevo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasNuevo],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasNuevo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
