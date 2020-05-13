import { TestBed } from '@angular/core/testing';

import { DefenseScheduleService } from './defense-schedule.service';

describe('DefenseScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefenseScheduleService = TestBed.get(DefenseScheduleService);
    expect(service).toBeTruthy();
  });
});
