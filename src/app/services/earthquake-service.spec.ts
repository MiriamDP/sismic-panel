import { TestBed } from '@angular/core/testing';

import { EarthquakeService } from './earthquake-service';

describe('EarthquakeService', () => {
  let service: EarthquakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarthquakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
