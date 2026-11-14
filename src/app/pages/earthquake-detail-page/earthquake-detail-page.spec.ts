import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeDetailPage } from './earthquake-detail-page';

describe('EarthquakeDetailPage', () => {
  let component: EarthquakeDetailPage;
  let fixture: ComponentFixture<EarthquakeDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthquakeDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EarthquakeDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
