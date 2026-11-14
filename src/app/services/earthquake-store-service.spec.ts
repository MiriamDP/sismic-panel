import { TestBed } from '@angular/core/testing';
import { EarthquakeStoreService } from './earthquake-store-service';


describe('EarthquakeStoreService', () => {
  let service: EarthquakeStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarthquakeStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
