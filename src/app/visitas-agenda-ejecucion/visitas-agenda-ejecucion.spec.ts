import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasAgendaEjecucion } from './visitas-agenda-ejecucion';

describe('VisitasAgendaEjecucion', () => {
  let component: VisitasAgendaEjecucion;
  let fixture: ComponentFixture<VisitasAgendaEjecucion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasAgendaEjecucion],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasAgendaEjecucion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
