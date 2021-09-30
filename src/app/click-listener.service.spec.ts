import { TestBed } from '@angular/core/testing';

import { ClickListenerService } from './click-listener.service';

describe('ClickListenerService', () => {
  let service: ClickListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
