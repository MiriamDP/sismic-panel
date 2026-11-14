import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonEarthquakeEvolution } from './comparison-earthquake-evolution';

describe('ComparisonEarthquakeEvolution', () => {
  let component: ComparisonEarthquakeEvolution;
  let fixture: ComponentFixture<ComparisonEarthquakeEvolution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonEarthquakeEvolution],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonEarthquakeEvolution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
