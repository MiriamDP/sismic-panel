import { TestBed } from '@angular/core/testing';

import { EarthquakeSocketService } from './earthquake-socket-service';

describe('EarthquakeSocketService', () => {
  let service: EarthquakeSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarthquakeSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
