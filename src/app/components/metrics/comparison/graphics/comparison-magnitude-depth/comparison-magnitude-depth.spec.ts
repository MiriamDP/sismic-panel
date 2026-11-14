import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonMagnitudeDepth } from './comparison-magnitude-depth';

describe('ComparisonMagnitudeDepth', () => {
  let component: ComparisonMagnitudeDepth;
  let fixture: ComponentFixture<ComparisonMagnitudeDepth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonMagnitudeDepth],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonMagnitudeDepth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
