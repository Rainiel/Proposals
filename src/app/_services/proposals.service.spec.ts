import { TestBed } from '@angular/core/testing';

import { ProposalsService } from './proposals.service';

describe('ProposalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProposalsService = TestBed.get(ProposalsService);
    expect(service).toBeTruthy();
  });
});
