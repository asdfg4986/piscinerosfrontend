import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { adminOrExternalGuard } from './admin-or-external-guard';

describe('adminOrExternalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminOrExternalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
