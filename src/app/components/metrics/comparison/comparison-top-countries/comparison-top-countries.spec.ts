import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonTopCountries } from './comparison-top-countries';

describe('ComparisonTopCountries', () => {
  let component: ComparisonTopCountries;
  let fixture: ComponentFixture<ComparisonTopCountries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonTopCountries],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonTopCountries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
