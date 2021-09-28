import { TestBed } from '@angular/core/testing';

import { ChordServiceService } from './chord-service.service';

describe('ChordServiceService', () => {
  let service: ChordServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChordServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
