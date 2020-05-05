import { TestBed } from '@angular/core/testing';

import { UnitesService } from './unites.service';

describe('UnitesService', () => {
  let service: UnitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
