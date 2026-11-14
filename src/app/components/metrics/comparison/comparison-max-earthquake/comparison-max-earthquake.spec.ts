import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonMaxEarthquake } from './comparison-max-earthquake';

describe('ComparisonMaxEarthquake', () => {
  let component: ComparisonMaxEarthquake;
  let fixture: ComponentFixture<ComparisonMaxEarthquake>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonMaxEarthquake],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonMaxEarthquake);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
