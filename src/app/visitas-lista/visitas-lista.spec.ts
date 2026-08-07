import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasLista } from './visitas-lista';

describe('VisitasLista', () => {
  let component: VisitasLista;
  let fixture: ComponentFixture<VisitasLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasLista],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
