import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeEvolution } from './earthquake-evolution';

describe('EarthquakeEvolution', () => {
  let component: EarthquakeEvolution;
  let fixture: ComponentFixture<EarthquakeEvolution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthquakeEvolution],
    }).compileComponents();

    fixture = TestBed.createComponent(EarthquakeEvolution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
