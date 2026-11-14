import { TestBed } from '@angular/core/testing';

import { EarthquakeManagerService } from './earthquake-manager-service';

describe('EarthquakeManagerService', () => {
  let service: EarthquakeManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarthquakeManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
