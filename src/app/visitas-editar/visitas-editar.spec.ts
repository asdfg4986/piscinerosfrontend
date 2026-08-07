import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasEditar } from './visitas-editar';

describe('VisitasEditar', () => {
  let component: VisitasEditar;
  let fixture: ComponentFixture<VisitasEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitasEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitasEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
