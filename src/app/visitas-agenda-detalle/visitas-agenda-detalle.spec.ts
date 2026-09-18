import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasAgendaDetalle } from './visitas-agenda-detalle';

describe('VisitasAgendaDetalle', () => {
  let component: VisitasAgendaDetalle;
  let fixture: ComponentFixture<VisitasAgendaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasAgendaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasAgendaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
