import { TestBed } from '@angular/core/testing';

import { NodemailService } from './nodemail.service';

describe('NodemailService', () => {
  let service: NodemailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodemailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
