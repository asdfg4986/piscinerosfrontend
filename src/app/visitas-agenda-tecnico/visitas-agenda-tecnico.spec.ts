import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasAgendaTecnico } from './visitas-agenda-tecnico';

describe('VisitasAgendaTecnico', () => {
  let component: VisitasAgendaTecnico;
  let fixture: ComponentFixture<VisitasAgendaTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasAgendaTecnico],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasAgendaTecnico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
